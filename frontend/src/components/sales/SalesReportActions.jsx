import { Button, Space } from 'antd';
import { FilePdfOutlined, SyncOutlined } from '@ant-design/icons';

const SalesReportActions = ({
  loading,
  onRefresh,
  onOpenReportModal
}) => {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <Space>
        <Button
          type="primary"
          icon={<SyncOutlined />}
          loading={loading}
          onClick={onRefresh}
        >
          Yenile
        </Button>
        <Button
          type="default"
          icon={<FilePdfOutlined />}
          onClick={onOpenReportModal}
        >
          Rapor Oluştur
        </Button>
      </Space>
    </div>
  );
};

export default SalesReportActions; 