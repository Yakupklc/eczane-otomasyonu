import { useState } from 'react';
import { Form, Typography, message, Card } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { addMedicine } from '../../services/SheetAPI';
import MedicineForm from './MedicineForm';

const { Title } = Typography;

const AddMedicine = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Sheet.best API için formatla
      const medicineData = {
        'Ilac Adi': values.name,
        'Kategori': values.category,
        'Fiyat': values.price.toString(),
        'Stock': values.stock.toString()
      };
      
      await addMedicine(medicineData);
      
      message.success('İlaç başarıyla eklendi');
      form.resetFields();
      
      // Başarılı olduğunda ilaç listesine dön (opsiyonel)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('İlaç eklenirken bir hata oluştu');
      console.error('Error adding medicine:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '8px', 
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        width: '100%',
        padding: '20px'
      }}
    >
      <Title level={4} style={{ marginBottom: '24px' }}>
        <MedicineBoxOutlined style={{ marginRight: '8px' }} />
        Yeni İlaç Ekle
      </Title>
      
      <MedicineForm 
        form={form}
        onFinish={onFinish}
        loading={loading}
      />
    </Card>
  );
};

export default AddMedicine; 