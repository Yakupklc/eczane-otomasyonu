import { Layout } from 'antd';

const { Content } = Layout;

const ContentWrapper = ({ children }) => {
  return (
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
        {children}
      </Content>
    </Layout>
  );
};

export default ContentWrapper; 