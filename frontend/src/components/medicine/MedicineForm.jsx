import { Form, Input, Button, Select, InputNumber, Row, Col } from 'antd';
import { MedicineBoxOutlined, TagOutlined, DollarOutlined, InboxOutlined } from '@ant-design/icons';

const { Option } = Select;

const MedicineForm = ({ 
  form, 
  onFinish, 
  loading 
}) => {
  const categories = [
    'Agri Kesici',
    'Antibiyotik',
    'Antidepresan',
    'Vitamin',
    'Cilt Bakimi',
    'Diger'
  ];

  return (
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
  );
};

export default MedicineForm; 