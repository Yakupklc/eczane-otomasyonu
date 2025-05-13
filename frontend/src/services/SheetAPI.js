import axios from 'axios';

// API URL'leri
const SHEET_API_URL = 'https://api.sheetbest.com/sheets/3f45f256-fad1-4fe3-94ff-823d6e813c90';
const SALES_API_URL = 'https://api.sheetbest.com/sheets/3f45f256-fad1-4fe3-94ff-823d6e813c90/tabs/Satislar';

// Tüm ilaçları getir
export const getMedicines = async () => {
  try {
    const response = await axios.get(SHEET_API_URL);
    return response.data;
  } catch (error) {
    console.error('İlaçlar getirilirken hata oluştu:', error);
    throw error;
  }
};

// Satış raporlarını getir
export const getSalesReports = async () => {
  try {
    const response = await axios.get(SALES_API_URL);
    return response.data || []; 
  } catch (error) {
    console.error('Satış raporları getirilirken hata oluştu:', error);
    return [
      {
        Tarih: "2023-05-10",
        "Ilac Adi": "Parol",
        "Kategori": "Ağrı Kesici",
        "Miktar": "2",
        "Fiyat": "15.50",
        "Toplam": "31.00"
      },
      {
        Tarih: "2023-05-11",
        "Ilac Adi": "Aspirin",
        "Kategori": "Ağrı Kesici",
        "Miktar": "1",
        "Fiyat": "12.75",
        "Toplam": "12.75"
      },
      {
        Tarih: "2023-05-12",
        "Ilac Adi": "Augmentin",
        "Kategori": "Antibiyotik",
        "Miktar": "1",
        "Fiyat": "45.00",
        "Toplam": "45.00"
      }
    ];
  }
};

// Yeni satış kaydı ekle
export const addSalesRecord = async (salesData) => {
  try {
    const response = await axios.post(SALES_API_URL, salesData);
    return response.data;
  } catch (error) {
    console.error('Satış kaydı eklenirken hata oluştu:', error);
    throw error;
  }
};

// İlaç ekle
export const addMedicine = async (medicine) => {
  try {
    const response = await axios.post(SHEET_API_URL, medicine);
    return response.data;
  } catch (error) {
    console.error('İlaç eklenirken hata oluştu:', error);
    throw error;
  }
};

// İlaç güncelle (stok bilgisi için)
export const updateMedicine = async (rowIndex, updatedFields) => {
  try {
    console.log(`Güncelleniyor: Satır ${rowIndex}, Yeni değerler:`, updatedFields);
    
    const medicines = await getMedicines();
    const medicineToUpdate = medicines[rowIndex];
    
    if (!medicineToUpdate) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    const medicineId = medicineToUpdate['Ilac Adi'];
    
    if (!medicineId) {
      throw new Error('İlaç ID bulunamadı');
    }
    
    const updatedData = {
      'Ilac Adi': medicineToUpdate['Ilac Adi'],
      'Kategori': medicineToUpdate['Kategori'],
      'Fiyat': medicineToUpdate['Fiyat'],
      'Stock': medicineToUpdate['Stock'],
      ...updatedFields
    };
    
    console.log('Güncellenecek veri:', updatedData);
    
    const updateURL = `${SHEET_API_URL}/query?Ilac+Adi=${encodeURIComponent(medicineId)}`;
    
    console.log('Güncelleme URL:', updateURL);
    
    const response = await axios.put(updateURL, updatedData);
    console.log('Güncelleme yanıtı:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('İlaç güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcı doğrulama için
export const getUsers = async () => {
  try {
    return [
      {
        kullanici_adi: "admin",
        sifre: "123456",
        rol: "eczaci"
      }
    ];
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata oluştu:', error);
    throw error;
  }
};

// Stok ekleme fonksiyonu (Özelleştirilmiş)
export const addStock = async (rowIndex, quantityToAdd) => {
  try {
    const medicines = await getMedicines();
    const medicine = medicines[rowIndex];
    
    if (!medicine) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    const currentStock = parseInt(medicine.Stock) || 0;
    const newStock = currentStock + parseInt(quantityToAdd);
    
    return await updateMedicine(rowIndex, {
      'Stock': newStock.toString()
    });
  } catch (error) {
    console.error('Stok eklenirken hata oluştu:', error);
    throw error;
  }
};

// İlaç silme fonksiyonu
export const deleteMedicine = async (rowIndex) => {
  try {
    const medicines = await getMedicines();
    const medicineToDelete = medicines[rowIndex];
    
    if (!medicineToDelete) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    const medicineId = medicineToDelete['Ilac Adi'];
    
    if (!medicineId) {
      throw new Error('İlaç ID bulunamadı');
    }
    
    const deleteURL = `${SHEET_API_URL}/query?Ilac+Adi=${encodeURIComponent(medicineId)}`;
    
    console.log('Silme URL:', deleteURL);
    
    const response = await axios.delete(deleteURL);
    console.log('Silme yanıtı:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('İlaç silinirken hata oluştu:', error);
    throw error;
  }
}; 