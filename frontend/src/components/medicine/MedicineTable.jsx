import { Table, Tag } from 'antd';
import MedicineActions from './MedicineActions';

const MedicineTable = ({
  medicines,
  searchText,
  loading,
  onAddToCart,
  onOpenStockModal,
  onOpenDeleteModal
}) => {
  const getColumns = () => {
    return [
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
          <MedicineActions
            medicine={record}
            onAddToCart={onAddToCart}
            onOpenStockModal={onOpenStockModal}
            onOpenDeleteModal={onOpenDeleteModal}
          />
        ),
      },
    ];
  };

  const filteredMedicines = medicines.filter(medicine => 
    medicine['Ilac Adi']?.toLowerCase().includes(searchText.toLowerCase()) || false
  );

  return (
    <Table
      columns={getColumns()}
      dataSource={filteredMedicines}
      loading={loading}
      rowKey="key"
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Toplam ${total} ilaç`,
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
    />
  );
};

export default MedicineTable; 