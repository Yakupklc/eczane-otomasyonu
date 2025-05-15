import { Typography } from 'antd';

const { Title, Text } = Typography;

const EmptyCart = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Title level={4}>Sepetiniz boş</Title>
      <Text type="secondary">Sepete ürün eklemek için ilaç listesine dönebilirsiniz.</Text>
    </div>
  );
};

export default EmptyCart; 