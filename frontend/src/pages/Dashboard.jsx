import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, theme, message } from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import MedicineList from '../components/MedicineList';
import AddMedicine from '../components/AddMedicine';
import SalesReport from '../components/SalesReport';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'report'
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  // Uyumlu renkler
  const colors = {
    primary: token.colorPrimary,
    siderBackground: '#4FBDBA', // Turkuaz tonunda arka plan
    menuBackground: '#45A29E', // Biraz daha koyu turkuaz
    menuItemHover: '#6FDFDF', // Daha açık turkuaz
    textColor: 'white'
  };

  useEffect(() => {
    if (!currentUser) {
      // Kullanıcı giriş yapmamışsa, ana sayfa yerine giriş sayfasına yönlendir
      window.location.href = '/';
    }
  }, [currentUser]);

  const handleMenuClick = (key) => {
    setCurrentView(key);
  };

  const handleLogout = () => {
    logout();
    message.success('Başarıyla çıkış yapıldı');
  };

  if (!currentUser) {
    return null; // Kullanıcı giriş yapmamışsa hiçbir şey gösterme
  }

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return <MedicineList />;
      case 'add':
        return <AddMedicine onSuccess={() => setCurrentView('list')} />;
      case 'report':
        return <SalesReport />;
      default:
        return <MedicineList />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: colors.primary,
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
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            Çıkış Yap
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ 
            background: colors.siderBackground,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentView]}
            style={{ 
              height: '100%', 
              borderRight: 0,
              background: colors.menuBackground,
              color: colors.textColor
            }}
            theme="dark"
            items={[
              {
                key: 'list',
                icon: <MedicineBoxOutlined />,
                label: 'İlaç Listesi',
                onClick: () => handleMenuClick('list'),
              },
              {
                key: 'add',
                icon: <PlusOutlined />,
                label: 'İlaç Ekle',
                onClick: () => handleMenuClick('add'),
              },
              {
                key: 'report',
                icon: <FileTextOutlined />,
                label: 'Raporlar',
                onClick: () => handleMenuClick('report'),
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: 'white',
              borderRadius: '8px',
              minHeight: 280,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard; 