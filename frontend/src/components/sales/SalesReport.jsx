import { useState, useEffect } from 'react';
import { Card, Typography, Divider, Form, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { getMedicines, getSalesReports } from '../../services/SheetAPI';
import moment from 'moment';
import 'moment/locale/tr';

import SalesReportFilters from './SalesReportFilters';
import SalesReportSummary from './SalesReportSummary';
import SalesReportTable from './SalesReportTable';
import SalesReportActions from './SalesReportActions';
import EmailModal from './EmailModal';
import ReportModal from './ReportModal';

const { Title } = Typography;

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
    setDateRange([null, null]);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const openReportModal = () => {
    setReportModalVisible(true);
  };

  const openEmailModal = () => {
    setEmailModalVisible(true);
    setEmailSent(false);
    emailForm.resetFields();
  };

  const handleSendEmail = async (values) => {
    try {
      setSendingEmail(true);
      
      // Burada gerçek e-posta gönderme işlemi yapılabilir
      // API çağrısını simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success(`E-posta ${values.email} adresine başarıyla gönderildi`);
      setEmailSent(true);
      
      // Başarılı olduktan sonra formu sıfırla
      emailForm.resetFields();
    } catch (error) {
      message.error('E-posta gönderilirken bir hata oluştu');
      console.error('Error sending email:', error);
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredData = getFilteredSales();

  return (
    <Card style={{ width: '100%' }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        <FileTextOutlined style={{ marginRight: 8 }} /> Satış Raporları
      </Title>
      
      <Divider />
      
      <SalesReportActions
        loading={loading}
        onRefresh={fetchData}
        onOpenReportModal={openReportModal}
      />
      
      <SalesReportFilters
        reportType={reportType}
        setReportType={setReportType}
        dateFilterType={dateFilterType}
        setDateFilterType={setDateFilterType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        searchMedicine={searchMedicine}
        setSearchMedicine={setSearchMedicine}
        medicineOptions={medicineOptions}
        handleDateRangeChange={handleDateRangeChange}
        handleMonthChange={handleMonthChange}
        handleYearChange={handleYearChange}
        handleDateFilterTypeChange={handleDateFilterTypeChange}
      />
      
      <SalesReportSummary filteredData={filteredData} />
      
      <SalesReportTable
        reportType={reportType}
        filteredData={filteredData}
        loading={loading}
      />
      
      <ReportModal
        visible={reportModalVisible}
        reportType={reportType}
        filteredData={filteredData}
        dateFilterType={dateFilterType}
        dateRange={dateRange}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onCancel={() => setReportModalVisible(false)}
        onSendEmail={openEmailModal}
      />
      
      <EmailModal
        visible={emailModalVisible}
        form={emailForm}
        sendingEmail={sendingEmail}
        emailSent={emailSent}
        onCancel={() => setEmailModalVisible(false)}
        onSend={handleSendEmail}
      />
    </Card>
  );
};

export default SalesReport; 