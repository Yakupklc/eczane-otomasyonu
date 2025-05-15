import { Row, Col, Card, Statistic } from 'antd';
import { ShoppingCartOutlined, LineChartOutlined, FileTextOutlined } from '@ant-design/icons';

const SalesReportSummary = ({ filteredData }) => {
  // Toplam satış tutarı
  const totalSales = filteredData.reduce((total, sale) => {
    return total + (parseFloat(sale.Toplam) || 0);
  }, 0);

  // Toplam ürün miktarı
  const totalItems = filteredData.reduce((total, sale) => {
    return total + (parseInt(sale.Miktar) || 0);
  }, 0);

  // Benzersiz ilaç sayısı
  const uniqueMedicineCount = [...new Set(filteredData.map(sale => sale['Ilac Adi']).filter(Boolean))].length;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Toplam Satış"
            value={totalSales.toFixed(2)}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix="₺"
            suffix="TL"
            icon={<LineChartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Satılan Ürün Adedi"
            value={totalItems}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Farklı İlaç Sayısı"
            value={uniqueMedicineCount}
            valueStyle={{ color: '#722ed1' }}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SalesReportSummary; 