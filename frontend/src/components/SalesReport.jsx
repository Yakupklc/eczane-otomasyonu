import { useState, useEffect } from 'react';
import { Card, Typography, Divider, Table, Button, Statistic, Row, Col, Select, DatePicker, Space, message, Input, Modal, Form, Alert } from 'antd';
import { FileTextOutlined, LineChartOutlined, ShoppingCartOutlined, CalendarOutlined, SearchOutlined, FilterOutlined, MailOutlined, FilePdfOutlined, SendOutlined } from '@ant-design/icons';
import { getMedicines, getSalesReports } from '../services/SheetAPI';
import moment from 'moment';
import 'moment/locale/tr';
import locale from 'antd/es/date-picker/locale/tr_TR';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker} = DatePicker;

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchMedicine, setSearchMedicine] = useState('');
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [dateFilterType, setDateFilterType] = useState('range'); // 'range', 'month', 'year'
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailForm] = Form.useForm();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const uniqueMedicineNames = [...new Set(salesData.map(sale => sale['Ilac Adi']).filter(Boolean))];
    setMedicineOptions(uniqueMedicineNames.map(name => ({ value: name, label: name })));
  }, [salesData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // İlaçları ve satış verilerini eş zamanlı olarak getir
      const [medicinesData, salesData] = await Promise.all([
        getMedicines(),
        getSalesReports()
      ]);
      
      // İlaç verilerini işle
      const processedMedicines = medicinesData.map((medicine, index) => ({
        ...medicine,
        key: `med_${index}`,
        Stock: parseInt(medicine.Stock) || 0,
        Fiyat: parseFloat(medicine.Fiyat) || 0,
      }));
      
      // Satış verilerini işle
      const processedSales = salesData.map((sale, index) => ({
        ...sale,
        key: `sale_${index}`,
        Miktar: parseInt(sale.Miktar) || 0,
        Fiyat: parseFloat(sale.Fiyat) || 0,
        Toplam: parseFloat(sale.Toplam) || (parseFloat(sale.Fiyat || 0) * parseInt(sale.Miktar || 0)),
        Tarih: sale.Tarih ? sale.Tarih : moment().format('YYYY-MM-DD')
      }));
      
      setMedicines(processedMedicines);
      setSalesData(processedSales);
    } catch (error) {
      message.error('Veriler getirilirken bir hata oluştu');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSales = () => {
    let filtered = [...salesData];
    
    // Tarih filtreleme
    if (dateFilterType === 'range' && dateRange[0] && dateRange[1]) {
      // Tarih aralığı filtresi
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      filtered = filtered.filter(sale => {
        if (!sale.Tarih) return false;
        return sale.Tarih >= startDate && sale.Tarih <= endDate;
      });
    } else if (dateFilterType === 'month' && selectedMonth) {
      // Ay filtresi
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1; // Moment ayları 0'dan başlar
      
      filtered = filtered.filter(sale => {
        if (!sale.Tarih) return false;
        const saleDate = moment(sale.Tarih);
        return saleDate.year() === year && saleDate.month() + 1 === month;
      });
    } else if (dateFilterType === 'year' && selectedYear) {
      // Yıl filtresi
      const year = selectedYear.year();
      
      filtered = filtered.filter(sale => {
        if (!sale.Tarih) return false;
        const saleDate = moment(sale.Tarih);
        return saleDate.year() === year;
      });
    }
    
    // İlaç adı araması
    if (searchMedicine) {
      filtered = filtered.filter(sale => 
        sale['Ilac Adi'] && sale['Ilac Adi'].toLowerCase().includes(searchMedicine.toLowerCase())
      );
    }
    
    // Rapor tipi filtresi
    switch (reportType) {
      case 'category':
        // Kategoriye göre gruplandırma
        const categoryGroups = {};
        filtered.forEach(sale => {
          if (!sale.Kategori) return;
          if (!categoryGroups[sale.Kategori]) {
            categoryGroups[sale.Kategori] = {
              key: sale.Kategori,
              Kategori: sale.Kategori,
              Miktar: 0,
              Toplam: 0,
              Ilac_Sayisi: new Set()
            };
          }
          categoryGroups[sale.Kategori].Miktar += sale.Miktar;
          categoryGroups[sale.Kategori].Toplam += sale.Toplam;
          categoryGroups[sale.Kategori].Ilac_Sayisi.add(sale['Ilac Adi']);
        });
        
        return Object.values(categoryGroups).map(group => ({
          ...group,
          Ilac_Sayisi: group.Ilac_Sayisi.size
        }));
      
      case 'medicine':
        // İlaç adına göre gruplandırma
        const medicineGroups = {};
        filtered.forEach(sale => {
          if (!sale['Ilac Adi']) return;
          if (!medicineGroups[sale['Ilac Adi']]) {
            medicineGroups[sale['Ilac Adi']] = {
              key: sale['Ilac Adi'],
              'Ilac Adi': sale['Ilac Adi'],
              Kategori: sale.Kategori,
              Miktar: 0,
              Toplam: 0,
              Tarih_Sayisi: new Set()
            };
          }
          medicineGroups[sale['Ilac Adi']].Miktar += sale.Miktar;
          medicineGroups[sale['Ilac Adi']].Toplam += sale.Toplam;
          medicineGroups[sale['Ilac Adi']].Tarih_Sayisi.add(sale.Tarih);
        });
        
        return Object.values(medicineGroups).map(group => ({
          ...group,
          Tarih_Sayisi: group.Tarih_Sayisi.size
        }));
      
      case 'daily':
        // Günlük satışlar
        const dailyGroups = {};
        filtered.forEach(sale => {
          if (!sale.Tarih) return;
          if (!dailyGroups[sale.Tarih]) {
            dailyGroups[sale.Tarih] = {
              key: sale.Tarih,
              Tarih: sale.Tarih,
              Miktar: 0,
              Toplam: 0,
              Ilac_Cesitleri: new Set()
            };
          }
          dailyGroups[sale.Tarih].Miktar += sale.Miktar;
          dailyGroups[sale.Tarih].Toplam += sale.Toplam;
          dailyGroups[sale.Tarih].Ilac_Cesitleri.add(sale['Ilac Adi']);
        });
        
        return Object.values(dailyGroups)
          .map(group => ({
            ...group,
            Ilac_Cesitleri: group.Ilac_Cesitleri.size
          }))
          .sort((a, b) => b.Tarih.localeCompare(a.Tarih)); // En son tarih en üstte
          
      default:
        // Tüm satışlar detaylı
        return filtered.sort((a, b) => b.Tarih.localeCompare(a.Tarih));
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleDateFilterTypeChange = (type) => {
    setDateFilterType(type);
    // Diğer filtreleri sıfırla
    if (type !== 'range') setDateRange([null, null]);
    if (type !== 'month') setSelectedMonth(null);
    if (type !== 'year') setSelectedYear(null);
  };

  // Tarih filtreleme bileşenini render et
  const renderDateFilter = () => {
    switch (dateFilterType) {
      case 'range':
        return (
          <RangePicker 
            locale={locale}
            onChange={handleDateRangeChange}
            placeholder={['Başlangıç', 'Bitiş']}
            style={{ width: 240 }}
          />
        );
      case 'month':
        return (
          <DatePicker 
            locale={locale}
            onChange={handleMonthChange}
            picker="month"
            placeholder="Ay Seçin"
            style={{ width: 120 }}
          />
        );
      case 'year':
        return (
          <DatePicker 
            locale={locale}
            onChange={handleYearChange}
            picker="year"
            placeholder="Yıl Seçin"
            style={{ width: 100 }}
          />
        );
      default:
        return null;
    }
  };

  const getColumns = () => {
    switch (reportType) {
      case 'category':
        return [
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'category',
            filters: [
              { text: 'Agri Kesici', value: 'Agri Kesici' },
              { text: 'Antibiyotik', value: 'Antibiyotik' },
              { text: 'Antidepresan', value: 'Antidepresan' },
              { text: 'Vitamin', value: 'Vitamin' },
              { text: 'Cilt Bakimi', value: 'Cilt Bakimi' },
              { text: 'Diğer', value: 'Diğer' },
            ],
            onFilter: (value, record) => record.Kategori === value,
            filterMode: 'menu',
            filterSearch: true,
          },
          {
            title: 'Satılan İlaç Çeşidi',
            dataIndex: 'Ilac_Sayisi',
            key: 'medicineCount',
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'quantity',
          },
          {
            title: 'Toplam Satış (₺)',
            dataIndex: 'Toplam',
            key: 'total',
            render: (total) => `${Number(total).toFixed(2)} ₺`,
          },
        ];
      
      case 'medicine':
        return [
          {
            title: 'İlaç Adı',
            dataIndex: 'Ilac Adi',
            key: 'medicine',
          },
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'category',
            filters: [
              { text: 'Agri Kesici', value: 'Agri Kesici' },
              { text: 'Antibiyotik', value: 'Antibiyotik' },
              { text: 'Antidepresan', value: 'Antidepresan' },
              { text: 'Vitamin', value: 'Vitamin' },
              { text: 'Cilt Bakimi', value: 'Cilt Bakimi' },
              { text: 'Diğer', value: 'Diğer' },
            ],
            onFilter: (value, record) => record.Kategori === value,
            filterMode: 'menu',
            filterSearch: true,
          },
          {
            title: 'Satış Günü Sayısı',
            dataIndex: 'Tarih_Sayisi',
            key: 'dateCount',
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'quantity',
          },
          {
            title: 'Toplam Satış (₺)',
            dataIndex: 'Toplam',
            key: 'total',
            render: (total) => `${Number(total).toFixed(2)} ₺`,
          },
        ];
      
      case 'daily':
        return [
          {
            title: 'Tarih',
            dataIndex: 'Tarih',
            key: 'date',
          },
          {
            title: 'Satılan İlaç Çeşidi',
            dataIndex: 'Ilac_Cesitleri',
            key: 'medicineTypes',
          },
          {
            title: 'Toplam Miktar',
            dataIndex: 'Miktar',
            key: 'quantity',
          },
          {
            title: 'Toplam Satış (₺)',
            dataIndex: 'Toplam',
            key: 'total',
            render: (total) => `${Number(total).toFixed(2)} ₺`,
          },
        ];
      
      default:
        return [
          {
            title: 'Tarih',
            dataIndex: 'Tarih',
            key: 'date',
          },
          {
            title: 'İlaç Adı',
            dataIndex: 'Ilac Adi',
            key: 'medicine',
          },
          {
            title: 'Kategori',
            dataIndex: 'Kategori',
            key: 'category',
            filters: [
              { text: 'Agri Kesici', value: 'Agri Kesici' },
              { text: 'Antibiyotik', value: 'Antibiyotik' },
              { text: 'Antidepresan', value: 'Antidepresan' },
              { text: 'Vitamin', value: 'Vitamin' },
              { text: 'Cilt Bakimi', value: 'Cilt Bakimi' },
              { text: 'Diğer', value: 'Diğer' },
            ],
            onFilter: (value, record) => record.Kategori === value,
            filterMode: 'menu',
            filterSearch: true,
          },
          {
            title: 'Miktar',
            dataIndex: 'Miktar',
            key: 'quantity',
          },
          {
            title: 'Fiyat (₺)',
            dataIndex: 'Fiyat',
            key: 'price',
            render: (price) => `${Number(price).toFixed(2)} ₺`,
          },
          {
            title: 'Toplam (₺)',
            dataIndex: 'Toplam',
            key: 'total',
            render: (total) => `${Number(total).toFixed(2)} ₺`,
          },
        ];
    }
  };

  const filteredSales = getFilteredSales();
  
  // İstatistikler için hesaplamalar
  const totalQuantity = filteredSales.reduce((total, item) => total + (item.Miktar || 0), 0);
  const totalSales = filteredSales.reduce((total, item) => total + (item.Toplam || 0), 0);
  const uniqueMedicines = new Set(filteredSales.map(item => item['Ilac Adi'])).size;
  const uniqueCategories = new Set(filteredSales.map(item => item.Kategori)).size;

  // Tarih filtresi başlığını oluştur
  const getDateFilterTitle = () => {
    if (dateFilterType === 'range' && dateRange[0] && dateRange[1]) {
      return `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')} arası`;
    } else if (dateFilterType === 'month' && selectedMonth) {
      return `${selectedMonth.format('MMMM YYYY')}`;
    } else if (dateFilterType === 'year' && selectedYear) {
      return `${selectedYear.format('YYYY')} yılı`;
    }
    return '';
  };

  // Rapor modal'ını açma fonksiyonu
  const openReportModal = () => {
    setReportModalVisible(true);
  };

  // E-posta modal'ını açma fonksiyonu
  const openEmailModal = () => {
    setReportModalVisible(false);
    setEmailModalVisible(true);
    setEmailSent(false);
  };

  // E-posta gönderme fonksiyonu (simülasyon)
  const handleSendEmail = async (values) => {
    try {
      setSendingEmail(true);
      
      // 2 saniye bekleyerek gönderim simülasyonu yap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`Rapor başarıyla ${values.email} adresine gönderildi`);
      setSendingEmail(false);
      setEmailSent(true);
      
      // Form temizle (5 saniye sonra modal'ı kapat)
      setTimeout(() => {
        setEmailModalVisible(false);
        emailForm.resetFields();
      }, 5000);
    } catch (error) {
      setSendingEmail(false);
      message.error('E-posta gönderilirken bir hata oluştu');
    }
  };

  // Raporu PDF formatında render et
  const renderReportContent = () => {
    const dateTitle = getDateFilterTitle();
    const reportTitle = reportType === 'all' ? 'Tüm Satışlar' : 
                       reportType === 'daily' ? 'Günlük Satış Raporu' :
                       reportType === 'medicine' ? 'İlaçlara Göre Satış Raporu' :
                       'Kategorilere Göre Satış Raporu';
    
    return (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Typography.Title level={3}>Eczane Satış Raporu</Typography.Title>
          <Typography.Title level={4}>{reportTitle}</Typography.Title>
          {dateTitle && <Typography.Text>{dateTitle}</Typography.Text>}
          <Divider />
        </div>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card size="small">
              <Statistic
                title="Toplam Satış"
                value={totalSales.toFixed(2)}
                suffix="₺"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Statistic
                title="Satılan Toplam Miktar"
                value={totalQuantity}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Table
          columns={getColumns()}
          dataSource={filteredSales}
          pagination={false}
          size="small"
          style={{ marginBottom: 20 }}
          summary={() => {
            if (reportType === 'all') {
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong>Toplam</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{totalQuantity}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text strong>-</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text strong>{totalSales.toFixed(2)} ₺</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            } else if (reportType === 'daily' || reportType === 'category' || reportType === 'medicine') {
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong>Toplam</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{totalQuantity}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text strong>{totalSales.toFixed(2)} ₺</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }
            return null;
          }}
        />
        
        <div style={{ marginTop: 30, textAlign: 'right' }}>
          <Typography.Text>Rapor Oluşturulma Tarihi: {moment().format('DD/MM/YYYY HH:mm')}</Typography.Text>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '10px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Title level={4}>Satış Raporu</Title>
        </Col>
        <Col xs={24} sm={12}>
          <Space 
            direction="horizontal" 
            size="middle" 
            style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}
          >
            <Select
              showSearch
              allowClear
              placeholder="İlaç Adı Ara"
              optionFilterProp="label"
              onChange={(value) => setSearchMedicine(value || '')}
              style={{ width: 180 }}
              options={medicineOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <Space.Compact style={{ width: 'auto', display: 'flex' }}>
              <Select 
                value={dateFilterType}
                onChange={handleDateFilterTypeChange}
                style={{ width: 120 }}
              >
                <Option value="range">Tarih Aralığı</Option>
                <Option value="month">Aya Göre</Option>
                <Option value="year">Yıla Göre</Option>
              </Select>
              {renderDateFilter()}
            </Space.Compact>
            <Select 
              defaultValue="all" 
              style={{ width: 180 }} 
              onChange={(value) => setReportType(value)}
            >
              <Option value="all">Tüm Satışlar</Option>
              <Option value="daily">Günlük Satışlar</Option>
              <Option value="medicine">İlaçlara Göre</Option>
              <Option value="category">Kategorilere Göre</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Satış"
              value={totalSales.toFixed(2)}
              suffix="₺"
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Satılan Toplam Miktar"
              value={totalQuantity}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Satılan İlaç Çeşidi"
              value={uniqueMedicines}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Satılan Kategori Sayısı"
              value={uniqueCategories}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Table
        title={() => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            <span>
              {reportType === 'all' ? 'Tüm Satışlar' : 
               reportType === 'daily' ? 'Günlük Satış Raporu' :
               reportType === 'medicine' ? 'İlaçlara Göre Satış Raporu' :
               'Kategorilere Göre Satış Raporu'}
              {getDateFilterTitle() && ` (${getDateFilterTitle()})`}
            </span>
          </div>
        )}
        columns={getColumns()}
        dataSource={filteredSales}
        loading={loading}
        pagination={{ 
          pageSize: 10
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
        summary={() => {
          if (reportType === 'all') {
            return (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>Toplam</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{totalQuantity}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>-</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong>{totalSales.toFixed(2)} ₺</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          } else if (reportType === 'daily' || reportType === 'category' || reportType === 'medicine') {
            return (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong>Toplam</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{totalQuantity}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>{totalSales.toFixed(2)} ₺</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }
          return null;
        }}
      />

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button 
          type="primary" 
          icon={<FilePdfOutlined />} 
          onClick={openReportModal}
          style={{ marginRight: 8, width: 'auto' }}
        >
          Rapor Oluştur
        </Button>
      </div>
      
      {/* Rapor Modal */}
      <Modal
        title="Satış Raporu"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        width={800}
        centered
        footer={[
          <Button key="cancel" onClick={() => setReportModalVisible(false)}>
            Kapat
          </Button>,
          <Button 
            key="email" 
            type="primary" 
            icon={<MailOutlined />} 
            onClick={openEmailModal}
          >
            E-posta ile Gönder
          </Button>,
        ]}
      >
        {renderReportContent()}
      </Modal>
      
      {/* E-posta Gönderme Modal */}
      <Modal
        title="Raporu E-posta ile Gönder"
        open={emailModalVisible}
        onCancel={() => {
          if (!sendingEmail) {
            setEmailModalVisible(false);
            emailForm.resetFields();
          }
        }}
        footer={null}
        width={520}
        centered
      >
        {emailSent ? (
          <Alert
            message="Başarılı"
            description="Rapor başarıyla e-posta adresine gönderildi. Bu pencere otomatik olarak kapanacaktır."
            type="success"
            showIcon
          />
        ) : (
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleSendEmail}
          >
            <Form.Item
              name="email"
              label="E-posta Adresi"
              rules={[
                { required: true, message: 'Lütfen e-posta adresini girin' },
                { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
              ]}
            >
              <Input placeholder="ornek@mail.com" prefix={<MailOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="subject"
              label="Konu"
              initialValue="Eczane Satış Raporu"
              rules={[{ required: true, message: 'Lütfen konu girin' }]}
            >
              <Input placeholder="E-posta konusu" />
            </Form.Item>
            
            <Form.Item
              name="message"
              label="Mesaj"
              initialValue="Ekteki raporu bilgilerinize sunarım."
            >
              <Input.TextArea rows={4} placeholder="Mesaj içeriği" />
            </Form.Item>
            
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space direction="horizontal" style={{ width: 'auto' }}>
                <Button
                  type="default"
                  onClick={() => setEmailModalVisible(false)}
                  style={{ marginRight: 8, width: 'auto' }}
                  disabled={sendingEmail}
                >
                  İptal
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />} 
                  loading={sendingEmail}
                  style={{ width: 'auto' }}
                >
                  Gönder
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default SalesReport; 