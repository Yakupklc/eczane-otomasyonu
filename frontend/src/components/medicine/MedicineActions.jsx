import { Button, Space } from 'antd';
import { PlusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const MedicineActions = ({ 
  medicine, 
  onAddToCart, 
  onOpenStockModal, 
  onOpenDeleteModal 
}) => {
  return (
    <Space>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => onAddToCart(medicine)}
        disabled={medicine.Stock <= 0}
      >
        Sepete Ekle
      </Button>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={() => onOpenStockModal(medicine)}
      >
        Stok Ekle
      </Button>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => onOpenDeleteModal(medicine)}
      >
        Sil
      </Button>
    </Space>
  );
};

export default MedicineActions; 