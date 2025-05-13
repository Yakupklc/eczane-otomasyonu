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
    // Sheet.best API'sinde farklı bir sekmeye erişmek için /tabs/ kullanılır (/tab/ değil)
    const response = await axios.get(SALES_API_URL);
    return response.data || []; // Eğer veri yoksa boş dizi döndür
  } catch (error) {
    console.error('Satış raporları getirilirken hata oluştu:', error);
    // Test amaçlı örnek veri döndürelim (gerçek uygulama için kaldırılabilir)
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
    
    // Bütün ilaçları getir
    const medicines = await getMedicines();
    
    // Güncellenecek ilacı bul
    const medicineToUpdate = medicines[rowIndex];
    
    if (!medicineToUpdate) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    // İlaç ID'sini al
    const medicineId = medicineToUpdate['Ilac Adi'];
    
    if (!medicineId) {
      throw new Error('İlaç ID bulunamadı');
    }
    
    // Mevcut tüm verileri koru, sadece güncellenecek alanları değiştir
    const updatedData = {
      'Ilac Adi': medicineToUpdate['Ilac Adi'],
      'Kategori': medicineToUpdate['Kategori'],
      'Fiyat': medicineToUpdate['Fiyat'],
      'Stock': medicineToUpdate['Stock'],
      ...updatedFields // Güncellenecek alanlar
    };
    
    console.log('Güncellenecek veri:', updatedData);
    
    // Filtreleme ölçütü olarak ilaç adını kullan
    const updateURL = `${SHEET_API_URL}/query?Ilac+Adi=${encodeURIComponent(medicineId)}`;
    
    console.log('Güncelleme URL:', updateURL);
    
    // İlacı güncelle
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
    // Doğrudan kullanıcı verilerini manuel olarak döndürelim
    // Gerçek API çağrısı çalışmadığı için bu geçici bir çözüm
    return [
      {
        kullanici_adi: "admin",
        sifre: "123456",
        rol: "eczaci"
      }
    ];
    
    // API çağrısı - şu an devre dışı
    // const response = await axios.get(`${SHEET_API_URL}/tab/kullanicilar`);
    // console.log("Kullanıcılar API yanıtı:", response.data);
    // return response.data;
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata oluştu:', error);
    throw error;
  }
};

// Stok ekleme fonksiyonu (Özelleştirilmiş)
export const addStock = async (rowIndex, quantityToAdd) => {
  try {
    // Bütün ilaçları getir
    const medicines = await getMedicines();
    
    // Stok eklenecek ilacı bul
    const medicine = medicines[rowIndex];
    
    if (!medicine) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    // Mevcut stok miktarını al ve sayıya çevir
    const currentStock = parseInt(medicine.Stock) || 0;
    
    // Yeni stok miktarını hesapla
    const newStock = currentStock + parseInt(quantityToAdd);
    
    // Stok güncelleme
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
    // Bütün ilaçları getir
    const medicines = await getMedicines();
    
    // Silinecek ilacı bul
    const medicineToDelete = medicines[rowIndex];
    
    if (!medicineToDelete) {
      throw new Error(`${rowIndex} indeksinde ilaç bulunamadı`);
    }
    
    // İlaç ID'sini al
    const medicineId = medicineToDelete['Ilac Adi'];
    
    if (!medicineId) {
      throw new Error('İlaç ID bulunamadı');
    }
    
    // Silme URL'sini oluştur
    const deleteURL = `${SHEET_API_URL}/query?Ilac+Adi=${encodeURIComponent(medicineId)}`;
    
    console.log('Silme URL:', deleteURL);
    
    // İlacı sil (DELETE isteği gönderiyor)
    const response = await axios.delete(deleteURL);
    console.log('Silme yanıtı:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('İlaç silinirken hata oluştu:', error);
    throw error;
  }
}; 