import { useState, useRef } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState('');
  const passwordRef = useRef(null);

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

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Pharmatik</Title>
          <Title level={4}>Giriş Yap</Title>
        </div>

        {(error || localError) && (
          <Alert
            message="Hata"
            description={error || localError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
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
              prefix={<UserOutlined />} 
              placeholder="Kullanıcı Adı" 
              size="large"
              onPressEnter={handleUsernameEnter}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifre"
              size="large"
              ref={passwordRef}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 