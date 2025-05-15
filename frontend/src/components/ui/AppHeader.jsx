import { Layout, Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = ({ 
  primaryColor, 
  onLogout 
}) => {
  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: primaryColor,
        padding: '0 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          marginRight: 12, 
          background: '#fff', 
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src="/images/logo.png" 
            alt="Pharmatik Logo" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'cover' 
            }} 
          />
        </div>
        <Title level={4} style={{ margin: 0, color: 'white' }}>
          Pharmatik
        </Title>
      </div>
      <div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ color: 'white' }}
        >
          Çıkış Yap
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader; 