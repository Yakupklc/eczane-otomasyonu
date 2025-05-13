import { createContext, useState, useContext } from 'react';
import {  App } from 'antd';
import { updateMedicine, getMedicines, addSalesRecord } from '../services/SheetAPI';
import moment from 'moment';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  // Ürünü sepete ekle
  const addToCart = (product) => {
    if (product.Stock <= 0) {
      message.error('Bu ürün stokta yok!');
      return;
    }

    // Ürün zaten sepette mi kontrol et
    const existingItemIndex = cartItems.findIndex(
      (item) => item.key === product.key
    );

    if (existingItemIndex !== -1) {
      // Eğer ürün zaten sepette ise miktarını kontrol et
      const existingItem = cartItems[existingItemIndex];
      
      if (existingItem.quantity >= product.Stock) {
        message.warning('Sepete eklenecek daha fazla ürün stokta yok!');
        return;
      }

      // Miktarı artır
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };
      
      setCartItems(updatedCart);
      message.success(`${product['Ilac Adi']} sepete eklendi (${updatedCart[existingItemIndex].quantity} adet)`);
    } else {
      // Sepete yeni ürün ekle
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      message.success(`${product['Ilac Adi']} sepete eklendi`);
    }
  };

  // Sepetten ürün çıkar
  const removeFromCart = (productKey) => {
    const updatedCart = cartItems.filter((item) => item.key !== productKey);
    setCartItems(updatedCart);
    message.success('Ürün sepetten çıkarıldı');
  };

  // Ürün miktarını güncelle
  const updateQuantity = (productKey, newQuantity) => {
    const product = cartItems.find(item => item.key === productKey);
    
    if (newQuantity <= 0) {
      removeFromCart(productKey);
      return;
    }
    
    if (newQuantity > product.Stock) {
      message.warning('Stokta yeterli ürün yok!');
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.key === productKey ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
  };

  // Sepeti boşalt
  const clearCart = () => {
    setCartItems([]);
    message.success('Sepet boşaltıldı');
  };

  // Sepet toplamını hesapla
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * parseFloat(item.Fiyat),
      0
    );
  };

  // Sepet ürün sayısını hesapla
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Satış işlemini tamamla
  const checkout = async () => {
    try {
      setLoading(true);
      
      // Güncel ilaç listesini getir
      const currentMedicines = await getMedicines();
      
      // Her ürün için stok güncelleme işlemi
      for (const item of cartItems) {
        // Güncel veriyi kullanarak stok durumunu kontrol et
        const currentMedicine = currentMedicines.find(
          m => m['Ilac Adi'] === item['Ilac Adi']
        );
        
        if (!currentMedicine) {
          console.error(`İlaç bulunamadı: ${item['Ilac Adi']}`);
          continue;
        }
        
        const currentStock = parseInt(currentMedicine.Stock) || 0;
        
        if (currentStock < item.quantity) {
          message.warning(`"${item['Ilac Adi']}" için stok değişti. Şu an stokta ${currentStock} adet var.`);
          continue;
        }
        
        const updatedStock = Math.max(0, currentStock - item.quantity);
        console.log(`"${item['Ilac Adi']}" stok güncelleniyor: ${currentStock} -> ${updatedStock}`);
        
        // Sadece Stock alanını güncelle, diğer tüm veriler korunacak
        await updateMedicine(item.key, { 
          Stock: updatedStock.toString() 
        });

        // Satış kaydını Satislar sayfasına ekle
        const toplam = (parseFloat(item.Fiyat) * item.quantity).toFixed(2);
        const salesRecord = {
          Tarih: moment().format('YYYY-MM-DD'),
          "Ilac Adi": item['Ilac Adi'],
          "Kategori": item.Kategori || "",
          "Miktar": item.quantity.toString(),
          "Fiyat": item.Fiyat.toString(),
          "Toplam": toplam.toString()
        };
        
        try {
          await addSalesRecord(salesRecord);
          console.log('Satış kaydı eklendi:', salesRecord);
        } catch (salesError) {
          console.error('Satış kaydı eklenirken hata:', salesError);
        }
      }
      
      message.success('Satış işlemi başarıyla tamamlandı');
      setCartItems([]);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Satış işlemi sırasında hata:', error);
      message.error('Satış işlemi sırasında bir hata oluştu');
      setLoading(false);
      return { success: false, error };
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};

export default CartContext; 