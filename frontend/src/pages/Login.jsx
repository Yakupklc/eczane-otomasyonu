import { useState, useRef } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState('');
  const passwordRef = useRef(null);
  const [logoError, setLogoError] = useState(false);

  const onFinish = async (values) => {
    try {
      const result = await login(values.username, values.password);
      if (!result.success) {
        setLocalError(result.error || 'Giriş başarısız');
      } else {
        message.success('Giriş başarılı');
      }
    } catch (err) {
      setLocalError('Giriş yapılırken bir hata oluştu');
      console.error('Login error:', err);
    }
  };

  const handleUsernameEnter = () => {
    passwordRef.current?.focus();
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '16px',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{
          padding: '30px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div 
            style={{ 
              width: 100, 
              height: 100, 
              margin: '0 auto 16px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #1890ff',
              overflow: 'hidden'
            }}
          >
            {logoError ? (
              <MedicineBoxOutlined style={{ fontSize: 54, color: '#1890ff' }} />
            ) : (
              <img 
                src="/images/logonobg.png" 
                alt="Pharmatik Logo" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                onError={handleLogoError}
              />
            )}
          </div>
          <Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>Pharmatik</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Eczane Yönetim Sistemi</Text>
        </div>

        {(error || localError) && (
          <Alert
            message="Giriş Hatası"
            description={error || localError}
            type="error"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Lütfen kullanıcı adınızı giriniz!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
              placeholder="Kullanıcı Adı" 
              size="large"
              onPressEnter={handleUsernameEnter}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Şifre"
              size="large"
              ref={passwordRef}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                height: 46,
                borderRadius: 8,
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.5)'
              }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Demo giriş: admin / 123456</Text>
        </div>
      </Card>
    </div>
  );
};

export default Login; 