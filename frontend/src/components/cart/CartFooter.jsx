import { Row, Col, Button, Typography, Tag, Space, Divider } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CartFooter = ({
  total,
  loading,
  onClearCart,
  onCancel,
  onCheckout
}) => {
  return (
    <>
      <Divider />
      
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onClearCart}
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
              {total.toFixed(2)} ₺
            </Tag>
          </div>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '16px' }}>
        <Space style={{ width: 'auto' }}>
          <Button 
            onClick={onCancel}
            style={{ width: 'auto' }}
          >
            İptal
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={loading}
            onClick={onCheckout}
            style={{ width: 'auto' }}
          >
            Satışı Tamamla
          </Button>
        </Space>
      </div>
    </>
  );
};

export default CartFooter; 