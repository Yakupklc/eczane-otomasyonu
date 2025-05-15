import { Table, Tag } from 'antd';
import moment from 'moment';

const SalesReportTable = ({ reportType, filteredData, loading }) => {
  const getColumns = () => {
    switch (reportType) {
      case 'category':
        return [
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'kategori',
            render: (kategori) => <Tag color="blue">{kategori}</Tag>,
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'miktar',
            sorter: (a, b) => a.Miktar - b.Miktar,
          },
          {
            title: 'Toplam Satış',
            dataIndex: 'Toplam',
            key: 'toplam',
            sorter: (a, b) => a.Toplam - b.Toplam,
            render: (toplam) => `${toplam.toFixed(2)} ₺`,
          },
          {
            title: 'İlaç Çeşidi',
            dataIndex: 'Ilac_Sayisi',
            key: 'ilacSayisi',
            sorter: (a, b) => a.Ilac_Sayisi - b.Ilac_Sayisi,
          },
        ];
      
      case 'medicine':
        return [
          {
            title: 'İlaç Adı',
            dataIndex: 'Ilac Adi',
            key: 'ilacAdi',
          },
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'kategori',
            render: (kategori) => <Tag color="blue">{kategori}</Tag>,
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'miktar',
            sorter: (a, b) => a.Miktar - b.Miktar,
          },
          {
            title: 'Toplam Satış',
            dataIndex: 'Toplam',
            key: 'toplam',
            sorter: (a, b) => a.Toplam - b.Toplam,
            render: (toplam) => `${toplam.toFixed(2)} ₺`,
          },
          {
            title: 'Satıldığı Gün Sayısı',
            dataIndex: 'Tarih_Sayisi',
            key: 'tarihSayisi',
            sorter: (a, b) => a.Tarih_Sayisi - b.Tarih_Sayisi,
          },
        ];
      
      case 'daily':
        return [
          {
            title: 'Tarih',
            dataIndex: 'Tarih',
            key: 'tarih',
            render: (tarih) => moment(tarih).format('DD.MM.YYYY'),
            sorter: (a, b) => moment(a.Tarih).unix() - moment(b.Tarih).unix(),
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'miktar',
            sorter: (a, b) => a.Miktar - b.Miktar,
          },
          {
            title: 'Toplam Satış',
            dataIndex: 'Toplam',
            key: 'toplam',
            sorter: (a, b) => a.Toplam - b.Toplam,
            render: (toplam) => `${toplam.toFixed(2)} ₺`,
          },
          {
            title: 'İlaç Çeşitleri',
            dataIndex: 'Ilac_Cesitleri',
            key: 'ilacCesitleri',
            sorter: (a, b) => a.Ilac_Cesitleri - b.Ilac_Cesitleri,
          },
        ];
      
      default:
        return [
          {
            title: 'Tarih',
            dataIndex: 'Tarih',
            key: 'tarih',
            render: (tarih) => moment(tarih).format('DD.MM.YYYY'),
            sorter: (a, b) => moment(a.Tarih).unix() - moment(b.Tarih).unix(),
          },
          {
            title: 'İlaç Adı',
            dataIndex: 'Ilac Adi',
            key: 'ilacAdi',
          },
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'kategori',
            render: (kategori) => <Tag color="blue">{kategori}</Tag>,
          },
          {
            title: 'Miktar',
            dataIndex: 'Miktar',
            key: 'miktar',
            sorter: (a, b) => a.Miktar - b.Miktar,
          },
          {
            title: 'Birim Fiyat',
            dataIndex: 'Fiyat',
            key: 'fiyat',
            render: (fiyat) => `${fiyat} ₺`,
            sorter: (a, b) => a.Fiyat - b.Fiyat,
          },
          {
            title: 'Toplam',
            dataIndex: 'Toplam',
            key: 'toplam',
            render: (toplam) => `${parseFloat(toplam).toFixed(2)} ₺`,
            sorter: (a, b) => a.Toplam - b.Toplam,
          },
        ];
    }
  };

  return (
    <Table
      columns={getColumns()}
      dataSource={filteredData}
      loading={loading}
      rowKey="key"
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Toplam ${total} kayıt`,
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
    />
  );
};

export default SalesReportTable; 