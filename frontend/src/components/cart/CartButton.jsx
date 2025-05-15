import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const CartButton = ({ 
  itemCount = 0, 
  onClick 
}) => {
  return (
    <Button 
      type="primary" 
      icon={<ShoppingCartOutlined />} 
      onClick={onClick}
      size="large"
      style={{ width: 'auto' }}
    >
      Sepet {itemCount > 0 && `(${itemCount})`}
    </Button>
  );
};

export default CartButton; 