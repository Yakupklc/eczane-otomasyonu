import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getMedicines } from '../../services/SheetAPI';
import { useCart } from '../../context/CartContext';
import MedicineTableHeader from './MedicineTableHeader';
import MedicineTable from './MedicineTable';
import StockModal from './StockModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { addToCart } = useCart();
  
  // Modal states
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await getMedicines();
      
      const processedData = data.map((medicine, index) => ({
        ...medicine,
        key: index,
        Stock: parseInt(medicine.Stock) || 0,
      }));
      
      setMedicines(processedData);
    } catch (error) {
      message.error('İlaçlar getirilirken bir hata oluştu');
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const openStockModal = (medicine) => {
    setSelectedMedicine(medicine);
    setStockModalVisible(true);
  };

  const openDeleteModal = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModalVisible(true);
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  return (
    <div style={{ padding: '10px' }}>
      <MedicineTableHeader
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onRefresh={fetchMedicines}
        loading={loading}
        onComplete={fetchMedicines}
      />

      <MedicineTable
        medicines={medicines}
        searchText={searchText}
        loading={loading}
        onAddToCart={addToCart}
        onOpenStockModal={openStockModal}
        onOpenDeleteModal={openDeleteModal}
      />

      <StockModal
        visible={stockModalVisible}
        medicine={selectedMedicine}
        onClose={() => setStockModalVisible(false)}
        onSuccess={fetchMedicines}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        medicine={medicineToDelete}
        onClose={() => setDeleteModalVisible(false)}
        onSuccess={fetchMedicines}
      />
    </div>
  );
};

export default MedicineList; 