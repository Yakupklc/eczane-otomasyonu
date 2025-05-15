import { Row, Col, Typography, Space, Button, Input } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Cart } from '../cart';

const { Title } = Typography;

const MedicineTableHeader = ({
  searchText,
  onSearchChange,
  onRefresh,
  loading,
  onComplete
}) => {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Title level={4}>İlaç Listesi</Title>
        </Col>
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space style={{ width: 'auto' }}>
            <Cart onComplete={onComplete} />
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={onRefresh}
              loading={loading}
              style={{ width: 'auto' }}
            >
              Yenile
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="İlaç Adı Ara"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '100%' }}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
      </Row>
    </>
  );
};

export default MedicineTableHeader; 