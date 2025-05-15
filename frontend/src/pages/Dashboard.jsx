import { useState, useEffect } from 'react';
import { Layout, message, theme } from 'antd';
import { useAuth } from '../context/AuthContext';
import { MedicineList, AddMedicine } from '../components/medicine';
import { SalesReport } from '../components/sales';
import { AppHeader, SideMenu, ContentWrapper } from '../components/ui';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'report'
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

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
      <AppHeader 
        primaryColor={token.colorPrimary} 
        onLogout={handleLogout} 
      />
      
      <Layout>
        <SideMenu
          currentView={currentView}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          onMenuClick={handleMenuClick}
        />
        
        <ContentWrapper>
          {renderContent()}
        </ContentWrapper>
      </Layout>
    </Layout>
  );
};

export default Dashboard; 