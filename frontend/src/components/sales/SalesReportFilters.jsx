import { Row, Col, Select, DatePicker, Space, Input, Button } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/tr_TR';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SalesReportFilters = ({
  reportType,
  setReportType,
  dateFilterType,
  setDateFilterType,
  dateRange,
  setDateRange,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  searchMedicine,
  setSearchMedicine,
  medicineOptions,
  handleDateRangeChange,
  handleMonthChange,
  handleYearChange,
  handleDateFilterTypeChange
}) => {
  const renderDateFilter = () => {
    switch (dateFilterType) {
      case 'range':
        return (
          <RangePicker
            locale={locale}
            value={dateRange}
            onChange={handleDateRangeChange}
            style={{ width: '100%' }}
          />
        );
      case 'month':
        return (
          <DatePicker
            locale={locale}
            picker="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ width: '100%' }}
          />
        );
      case 'year':
        return (
          <DatePicker
            locale={locale}
            picker="year"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: '100%' }}
          />
        );
      default:
        return null;
    }
  };

  const getDateFilterTitle = () => {
    switch (dateFilterType) {
      case 'range': return 'Tarih Aralığı';
      case 'month': return 'Ay';
      case 'year': return 'Yıl';
      default: return 'Tarih';
    }
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label>Rapor Tipi</label>
        </div>
        <Select
          value={reportType}
          onChange={value => setReportType(value)}
          style={{ width: '100%' }}
          suffixIcon={<FilterOutlined />}
        >
          <Option value="all">Tüm Satışlar</Option>
          <Option value="medicine">İlaçlara Göre</Option>
          <Option value="category">Kategorilere Göre</Option>
          <Option value="daily">Günlere Göre</Option>
        </Select>
      </Col>

      <Col xs={24} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label>Tarih Filtresi</label>
        </div>
        <Select
          value={dateFilterType}
          onChange={handleDateFilterTypeChange}
          style={{ width: '100%' }}
          suffixIcon={<CalendarOutlined />}
        >
          <Option value="range">Tarih Aralığı</Option>
          <Option value="month">Ay</Option>
          <Option value="year">Yıl</Option>
        </Select>
      </Col>

      <Col xs={24} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label>{getDateFilterTitle()}</label>
        </div>
        {renderDateFilter()}
      </Col>

      <Col xs={24} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label>İlaç Ara</label>
        </div>
        <Select
          showSearch
          allowClear
          placeholder="İlaç adı ara"
          value={searchMedicine}
          onChange={value => setSearchMedicine(value)}
          style={{ width: '100%' }}
          optionFilterProp="children"
          filterOption={(input, option) => 
            option.children ? option.children.toLowerCase().includes(input.toLowerCase()) : false
          }
          suffixIcon={<SearchOutlined />}
        >
          {medicineOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default SalesReportFilters; 