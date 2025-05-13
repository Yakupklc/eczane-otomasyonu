import { useState } from 'react';
import { Table, Button, InputNumber, Typography, Tag, Modal, Space, Divider, message, App, Row, Col } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

const Cart = ({ onComplete }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    checkout,
    loading 
  } = useCart();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { modal } = App.useApp();

  const handleDeleteItem = (item) => {
    removeFromCart(item.key);
    message.success(`${item['Ilac Adi']} sepetten çıkarıldı`);
  };

  const handleClearCart = () => {
    clearCart();
    message.success('Sepet boşaltıldı');
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      message.warning('Sepetinizde ürün bulunmamaktadır.');
      return;
    }

    const result = await checkout();
    if (result.success) {
      if (onComplete) {
        onComplete();
      }
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'İlaç Adı',
      dataIndex: 'Ilac Adi',
      key: 'name',
    },
    {
      title: 'Fiyat',
      dataIndex: 'Fiyat',
      key: 'price',
      render: (price) => `${price} ₺`,
    },
    {
      title: 'Miktar',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.Stock}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.key, value)}
          style={{ width: '100%' }}
          size="middle"
        />
      ),
    },
    {
      title: 'Toplam',
      key: 'total',
      render: (_, record) => `${(record.quantity * parseFloat(record.Fiyat)).toFixed(2)} ₺`,
    },
    {
      title: 'İşlemler',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteItem(record)}
          size="middle"
        />
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<ShoppingCartOutlined />} 
        onClick={showModal}
        size="large"
        style={{ width: 'auto' }}
      >
        Sepet {cartItems.length > 0 && `(${cartItems.length})`}
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            <span>Alışveriş Sepeti</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Title level={4}>Sepetiniz boş</Title>
            <Text type="secondary">Sepete ürün eklemek için ilaç listesine dönebilirsiniz.</Text>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="key"
              pagination={false}
              locale={{ emptyText: 'Sepet boş' }}
              size="middle"
              scroll={{ x: 'max-content' }}
            />

            <Divider />
            
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearCart}
                  style={{ width: 'auto' }}
                >
                  Sepeti Boşalt
                </Button>
              </Col>
              
              <Col xs={24} md={12}>
                <div style={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: '16px', marginRight: '8px' }}>
                    Toplam: 
                  </Text>
                  <Tag color="blue" style={{ fontSize: '18px', padding: '5px 10px' }}>
                    {getCartTotal().toFixed(2)} ₺
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <Space style={{ width: 'auto' }}>
                <Button 
                  onClick={handleCancel}
                  style={{ width: 'auto' }}
                >
                  İptal
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={loading}
                  onClick={handleCheckout}
                  style={{ width: 'auto' }}
                >
                  Satışı Tamamla
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default Cart; 