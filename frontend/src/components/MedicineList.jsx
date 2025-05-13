import { useState, useEffect } from 'react';
import { Table, Typography, Button, Input, Select, message, Tag, Space, Modal, InputNumber, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getMedicines, addStock, deleteMedicine } from '../services/SheetAPI';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const { Title } = Typography;

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { addToCart } = useCart();
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [stockToAdd, setStockToAdd] = useState(1);
  const [addingStock, setAddingStock] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await getMedicines();
      
      const processedData = data.map((medicine, index) => ({
        ...medicine,
        key: index,
        Stock: parseInt(medicine.Stock) || 0,
      }));
      
      setMedicines(processedData);
    } catch (error) {
      message.error('İlaçlar getirilirken bir hata oluştu');
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddStock = async () => {
    try {
      setAddingStock(true);
      
      await addStock(selectedMedicine.key, stockToAdd);
      
      message.success(`${selectedMedicine['Ilac Adi']} için ${stockToAdd} adet stok eklendi`);
      
      await fetchMedicines();
      
      setStockModalVisible(false);
      setSelectedMedicine(null);
      setStockToAdd(1);
    } catch (error) {
      message.error('Stok eklenirken bir hata oluştu');
      console.error('Error adding stock:', error);
    } finally {
      setAddingStock(false);
    }
  };

  const openStockModal = (medicine) => {
    setSelectedMedicine(medicine);
    setStockToAdd(1);
    setStockModalVisible(true);
  };

  const openDeleteModal = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModalVisible(true);
  };

  const handleDeleteMedicine = async () => {
    try {
      setDeleting(true);
      
      await deleteMedicine(medicineToDelete.key);
      
      message.success(`${medicineToDelete['Ilac Adi']} başarıyla silindi`);
      
      await fetchMedicines();
      
      setDeleteModalVisible(false);
      setMedicineToDelete(null);
    } catch (error) {
      message.error('İlaç silinirken bir hata oluştu');
      console.error('Error deleting medicine:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'İlaç Adı',
        dataIndex: 'Ilac Adi',
        key: 'name',
        sorter: (a, b) => (a['Ilac Adi'] || '').localeCompare(b['Ilac Adi'] || ''),
      },
      {
        title: 'Kategori',
        dataIndex: 'Kategori',
        key: 'category',
        filters: [
          { text: 'Agri Kesici', value: 'Agri Kesici' },
          { text: 'Antibiyotik', value: 'Antibiyotik' },
          { text: 'Antidepresan', value: 'Antidepresan' },
          { text: 'Vitamin', value: 'Vitamin' },
          { text: 'Cilt Bakimi', value: 'Cilt Bakimi' },
          { text: 'Diğer', value: 'Diğer' },
        ],
        onFilter: (value, record) => record.Kategori === value,
        filterMode: 'menu',
        filterSearch: true,
        render: (category) => (
          <Tag color="blue">{category}</Tag>
        ),
      },
      {
        title: 'Fiyat (₺)',
        dataIndex: 'Fiyat',
        key: 'price',
        sorter: (a, b) => parseFloat(a.Fiyat) - parseFloat(b.Fiyat),
        render: (price) => `${price} ₺`,
      },
      {
        title: 'Stok',
        dataIndex: 'Stock',
        key: 'stock',
        sorter: (a, b) => a.Stock - b.Stock,
        render: (stock) => {
          let color = 'green';
          if (stock <= 0) {
            color = 'red';
          } else if (stock <= 5) {
            color = 'orange';
          }
          return <Tag color={color}>{stock}</Tag>;
        },
      },
      {
        title: 'İşlemler',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => addToCart(record)}
              disabled={record.Stock <= 0}
            >
              Sepete Ekle
            </Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => openStockModal(record)}
            >
              Stok Ekle
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record)}
            >
              Sil
            </Button>
          </Space>
        ),
      },
    ];
    
    return baseColumns;
  };

  return (
    <div style={{ padding: '10px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Title level={4}>İlaç Listesi</Title>
        </Col>
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space style={{ width: 'auto' }}>
            <Cart onComplete={fetchMedicines} />
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={fetchMedicines}
              loading={loading}
              style={{ width: 'auto' }}
            >
              Yenile
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="İlaç Adı Ara"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      <Table
        columns={getColumns()}
        dataSource={medicines.filter(medicine => 
          medicine['Ilac Adi']?.toLowerCase().includes(searchText.toLowerCase()) || false
        )}
        loading={loading}
        rowKey="key"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} ilaç`,
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
      />

      <Modal
        title={selectedMedicine ? `${selectedMedicine['Ilac Adi']} - Stok Ekle` : 'Stok Ekle'}
        open={stockModalVisible}
        onCancel={() => setStockModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStockModalVisible(false)}>
            İptal
          </Button>,
          <Button 
            key="add" 
            type="primary" 
            loading={addingStock} 
            onClick={handleAddStock}
          >
            Stok Ekle
          </Button>,
        ]}
        centered
        width={520}
      >
        {selectedMedicine && (
          <div>
            <p><strong>Mevcut Stok:</strong> {selectedMedicine.Stock}</p>
            <p><strong>Eklenecek Miktar:</strong></p>
            <InputNumber
              min={1}
              defaultValue={1}
              value={stockToAdd}
              onChange={(value) => setStockToAdd(value)}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="İlaç Silme İşlemi"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            İptal
          </Button>,
          <Button 
            key="delete" 
            danger
            loading={deleting} 
            onClick={handleDeleteMedicine}
            icon={<DeleteOutlined />}
          >
            Sil
          </Button>,
        ]}
        centered
        width={520}
      >
        {medicineToDelete && (
          <div>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24, marginRight: 10 }} />
            <Typography.Text strong style={{ fontSize: 16 }}>
              {medicineToDelete['Ilac Adi']} ilacını silmek istediğinize emin misiniz?
            </Typography.Text>
            <p style={{ marginTop: 20 }}>
              Bu işlem geri alınamaz. İlaç sistemden tamamen silinecektir.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicineList; 