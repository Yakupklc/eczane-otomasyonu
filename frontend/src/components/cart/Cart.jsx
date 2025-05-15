import { useState } from 'react';
import { Modal, message, App } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import CartButton from './CartButton';
import CartTable from './CartTable';
import CartFooter from './CartFooter';
import EmptyCart from './EmptyCart';

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <CartButton 
        itemCount={cartItems.length} 
        onClick={showModal}
      />

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
          <EmptyCart />
        ) : (
          <>
            <CartTable
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onDeleteItem={handleDeleteItem}
            />

            <CartFooter
              total={getCartTotal()}
              loading={loading}
              onClearCart={handleClearCart}
              onCancel={handleCancel}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default Cart; 