import { Layout, Menu } from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const SideMenu = ({ 
  currentView, 
  collapsed, 
  onCollapse, 
  onMenuClick 
}) => {
  const menuItems = [
    {
      key: 'list',
      icon: <MedicineBoxOutlined />,
      label: 'İlaç Listesi',
      onClick: () => onMenuClick('list'),
    },
    {
      key: 'add',
      icon: <PlusOutlined />,
      label: 'İlaç Ekle',
      onClick: () => onMenuClick('add'),
    },
    {
      key: 'report',
      icon: <FileTextOutlined />,
      label: 'Raporlar',
      onClick: () => onMenuClick('report'),
    },
  ];

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <Menu
        mode="inline"
        selectedKeys={[currentView]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default SideMenu; 