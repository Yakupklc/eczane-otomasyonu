import { Modal, Form, Input, Button } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';

const EmailModal = ({
  visible,
  form,
  sendingEmail,
  onCancel,
  onSend
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MailOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <span>Raporu E-posta ile Gönder</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSend}
      >
        <Form.Item
          name="email"
          label="E-posta Adresi"
          rules={[
            { required: true, message: 'Lütfen bir e-posta adresi girin!' },
            { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="ornek@example.com" />
        </Form.Item>
        
        <Form.Item
          name="subject"
          label="Konu"
          rules={[{ required: true, message: 'Lütfen bir konu girin!' }]}
          initialValue="Satış Raporu"
        >
          <Input placeholder="E-posta konusu" />
        </Form.Item>
        
        <Form.Item
          name="message"
          label="Mesaj"
          initialValue="Ekteki raporu inceleyebilirsiniz."
        >
          <Input.TextArea rows={4} placeholder="Opsiyonel mesaj" />
        </Form.Item>
        
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            type="default" 
            onClick={onCancel} 
            style={{ marginRight: 8 }}
          >
            İptal
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={sendingEmail}
            icon={<SendOutlined />}
          >
            Gönder
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmailModal; 