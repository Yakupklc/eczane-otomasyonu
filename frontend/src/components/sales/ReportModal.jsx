import { Modal, Divider, Typography, Button } from 'antd';
import { FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import moment from 'moment';
import SalesReportTable from './SalesReportTable';

const { Title, Text } = Typography;

const ReportModal = ({
  visible,
  reportType,
  filteredData,
  dateFilterType,
  dateRange,
  selectedMonth,
  selectedYear,
  onCancel
}) => {
  const getReportTitle = () => {
    switch (reportType) {
      case 'all':
        return 'Tüm Satışlar Raporu';
      case 'medicine':
        return 'İlaçlara Göre Satış Raporu';
      case 'category':
        return 'Kategorilere Göre Satış Raporu';
      case 'daily':
        return 'Günlük Satış Raporu';
      default:
        return 'Satış Raporu';
    }
  };

  const getDateRangeText = () => {
    if (dateFilterType === 'range' && dateRange[0] && dateRange[1]) {
      return `${dateRange[0].format('DD.MM.YYYY')} - ${dateRange[1].format('DD.MM.YYYY')}`;
    } else if (dateFilterType === 'month' && selectedMonth) {
      return selectedMonth.format('MMMM YYYY');
    } else if (dateFilterType === 'year' && selectedYear) {
      return selectedYear.format('YYYY');
    }
    return 'Tüm zamanlar';
  };

  const getTotalSale = () => {
    const total = filteredData.reduce((acc, sale) => {
      return acc + (parseFloat(sale.Toplam) || 0);
    }, 0);
    return total.toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FilePdfOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <span>Rapor Görüntüleme</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>
          Kapat
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Yazdır
        </Button>
      ]}
    >
      <div className="report-content">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={3}>{getReportTitle()}</Title>
          <Text type="secondary">Tarih Aralığı: {getDateRangeText()}</Text>
          <Divider />
          
          <div style={{ marginBottom: 24, textAlign: 'right' }}>
            <Text strong>Rapor Tarihi: </Text>
            <Text>{moment().format('DD.MM.YYYY, HH:mm')}</Text>
          </div>
        </div>
        
        <SalesReportTable 
          reportType={reportType}
          filteredData={filteredData}
          loading={false}
        />
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Text strong style={{ fontSize: 16 }}>Toplam: </Text>
          <Text style={{ fontSize: 16 }}>{getTotalSale()} ₺</Text>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal; 