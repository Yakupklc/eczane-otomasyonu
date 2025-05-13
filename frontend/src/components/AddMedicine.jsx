import { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Typography, message, Card, Space, Row, Col } from 'antd';
import { MedicineBoxOutlined, TagOutlined, DollarOutlined, InboxOutlined } from '@ant-design/icons';
import { addMedicine } from '../services/SheetAPI';

const { Title } = Typography;
const { Option } = Select;

const AddMedicine = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const categories = [
    'Agri Kesici',
    'Antibiyotik',
    'Antidepresan',
    'Vitamin',
    'Cilt Bakimi',
    'Diger'
  ];

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
      
      <Form
        form={form}
        name="addMedicine"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: '100%' }}
      >
        <Form.Item
          name="name"
          label="İlaç Adı"
          rules={[{ required: true, message: 'Lütfen ilaç adını girin' }]}
        >
          <Input 
            prefix={<MedicineBoxOutlined style={{ color: '#bfbfbf' }} />} 
            placeholder="İlaç adını girin" 
          />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Kategori"
          rules={[{ required: true, message: 'Lütfen kategori seçin' }]}
        >
          <Select 
            placeholder="Kategori seçin"
            suffixIcon={<TagOutlined />}
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="price"
              label="Fiyat (₺)"
              rules={[{ required: true, message: 'Lütfen fiyat girin' }]}
            >
              <InputNumber
                min={0}
                placeholder="0.00"
                addonAfter="₺"
                prefix={<DollarOutlined />}
                style={{ width: '100%' }}
                precision={2}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\₺\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="stock"
              label="Stok Miktarı"
              rules={[{ required: true, message: 'Lütfen stok miktarı girin' }]}
              initialValue={1}
            >
              <InputNumber
                min={0}
                placeholder="Stok miktarı"
                prefix={<InboxOutlined />}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item style={{ marginTop: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<MedicineBoxOutlined />}
            loading={loading}
            size="large"
            block
          >
            İlaç Ekle
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddMedicine; 