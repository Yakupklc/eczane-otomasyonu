import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, theme, message, Input } from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  LogoutOutlined,
  FileTextOutlined,
  EditOutlined,
  SaveOutlined,
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
  const [pharmacyName, setPharmacyName] = useState('Eczane Otomasyonu');
  const [isEditingName, setIsEditingName] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const { token } = theme.useToken();

  useEffect(() => {
    if (!currentUser) {
      // Kullanıcı giriş yapmamışsa, ana sayfa yerine giriş sayfasına yönlendir
      window.location.href = '/';
    }
    
    // Yerel depolamadan eczane adını ve logo URL'ini al
    const savedPharmacyName = localStorage.getItem('pharmacyName');
    const savedLogoUrl = localStorage.getItem('logoUrl');
    
    if (savedPharmacyName) {
      setPharmacyName(savedPharmacyName);
    }
    
    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    }
  }, [currentUser]);

  const handleMenuClick = (key) => {
    setCurrentView(key);
  };

  const handleLogout = () => {
    logout();
    message.success('Başarıyla çıkış yapıldı');
  };

  const handlePharmacyNameChange = (e) => {
    setPharmacyName(e.target.value);
  };

  const handleSavePharmacyName = () => {
    localStorage.setItem('pharmacyName', pharmacyName);
    setIsEditingName(false);
    message.success('Eczane adı kaydedildi');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setLogoUrl(url);
        localStorage.setItem('logoUrl', url);
      };
      reader.readAsDataURL(file);
    }
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
          background: token.colorPrimary,
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
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => document.getElementById('logo-upload').click()}
          >
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Eczane Logo" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'cover' 
                }} 
              />
            ) : (
              <MedicineBoxOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
            )}
            <input 
              type="file" 
              id="logo-upload" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleLogoChange} 
            />
          </div>
          
          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                value={pharmacyName}
                onChange={handlePharmacyNameChange}
                style={{ 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  width: 200,
                  marginRight: 8
                }}
                onPressEnter={handleSavePharmacyName}
              />
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={handleSavePharmacyName}
                style={{ color: 'white' }}
                size="small"
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0, color: 'white' }}>
                {pharmacyName}
              </Title>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setIsEditingName(true)}
                style={{ color: 'white', marginLeft: 8 }}
                size="small"
              />
            </div>
          )}
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
        >
          <Menu
            mode="inline"
            selectedKeys={[currentView]}
            style={{ height: '100%', borderRight: 0 }}
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