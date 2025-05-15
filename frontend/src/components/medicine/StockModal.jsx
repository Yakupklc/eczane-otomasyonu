import { useState } from 'react';
import { Modal, InputNumber, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addStock } from '../../services/SheetAPI';

const StockModal = ({ 
  visible, 
  medicine, 
  onClose, 
  onSuccess 
}) => {
  const [stockToAdd, setStockToAdd] = useState(1);
  const [addingStock, setAddingStock] = useState(false);

  const handleAddStock = async () => {
    if (!medicine) return;
    
    try {
      setAddingStock(true);
      
      await addStock(medicine.key, stockToAdd);
      
      message.success(`${medicine['Ilac Adi']} için ${stockToAdd} adet stok eklendi`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error) {
      message.error('Stok eklenirken bir hata oluştu');
      console.error('Error adding stock:', error);
    } finally {
      setAddingStock(false);
    }
  };

  const handleClose = () => {
    setStockToAdd(1);
    onClose();
  };

  return (
    <Modal
      title={medicine ? `${medicine['Ilac Adi']} - Stok Ekle` : 'Stok Ekle'}
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          İptal
        </Button>,
        <Button 
          key="add" 
          type="primary" 
          loading={addingStock} 
          onClick={handleAddStock}
          icon={<PlusOutlined />}
        >
          Stok Ekle
        </Button>
      ]}
    >
      <p>Eklemek istediğiniz stok miktarını girin:</p>
      <InputNumber
        min={1}
        value={stockToAdd}
        onChange={setStockToAdd}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};

export default StockModal; 