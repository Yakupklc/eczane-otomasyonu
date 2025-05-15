import { Table, Button, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const CartTable = ({
  cartItems,
  onUpdateQuantity,
  onDeleteItem
}) => {
  const columns = [
    {
      title: 'İlaç Adı',
      dataIndex: 'Ilac Adi',
      key: 'name',
    },
    {
      title: 'Fiyat',
      dataIndex: 'Fiyat',
      key: 'price',
      render: (price) => `${price} ₺`,
    },
    {
      title: 'Miktar',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.Stock}
          value={record.quantity}
          onChange={(value) => onUpdateQuantity(record.key, value)}
          style={{ width: '100%' }}
          size="middle"
        />
      ),
    },
    {
      title: 'Toplam',
      key: 'total',
      render: (_, record) => `${(record.quantity * parseFloat(record.Fiyat)).toFixed(2)} ₺`,
    },
    {
      title: 'İşlemler',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDeleteItem(record)}
          size="middle"
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cartItems}
      rowKey="key"
      pagination={false}
      locale={{ emptyText: 'Sepet boş' }}
      size="middle"
      scroll={{ x: 'max-content' }}
    />
  );
};

export default CartTable; 