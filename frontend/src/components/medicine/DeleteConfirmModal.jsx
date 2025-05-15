import { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMedicine } from '../../services/SheetAPI';

const DeleteConfirmModal = ({
  visible,
  medicine,
  onClose,
  onSuccess
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteMedicine = async () => {
    if (!medicine) return;
    
    try {
      setDeleting(true);
      
      await deleteMedicine(medicine.key);
      
      message.success(`${medicine['Ilac Adi']} başarıyla silindi`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      message.error('İlaç silinirken bir hata oluştu');
      console.error('Error deleting medicine:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
          İlaç Silme Onayı
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          İptal
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          loading={deleting}
          onClick={handleDeleteMedicine}
        >
          Sil
        </Button>
      ]}
    >
      <p>
        {medicine ? `"${medicine['Ilac Adi']}" ilacını silmek istediğinize emin misiniz?` : 'İlacı silmek istediğinize emin misiniz?'}
      </p>
      <p>Bu işlem geri alınamaz.</p>
    </Modal>
  );
};

export default DeleteConfirmModal; 