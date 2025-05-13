import { useState, useEffect } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import trTR from 'antd/lib/locale/tr_TR';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <ConfigProvider
      locale={trTR}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
