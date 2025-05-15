import { Button, Space } from 'antd';
import { MailOutlined, FilePdfOutlined, SyncOutlined } from '@ant-design/icons';

const SalesReportActions = ({
  loading,
  onRefresh,
  onOpenReportModal,
  onOpenEmailModal
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
          Raporu Göster
        </Button>
        <Button
          type="default"
          icon={<MailOutlined />}
          onClick={onOpenEmailModal}
        >
          E-posta Gönder
        </Button>
      </Space>
    </div>
  );
};

export default SalesReportActions; 