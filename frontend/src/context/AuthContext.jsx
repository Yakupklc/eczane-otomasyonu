import { createContext, useState, useEffect, useContext } from 'react';
import { getUsers } from '../services/SheetAPI';

// Auth context oluştur
const AuthContext = createContext();

// Auth Provider oluştur
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LocalStorage'dan kullanıcı bilgisini kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Kullanıcı girişi
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sheet.best API'den kullanıcıları getir
      const users = await getUsers();
      console.log("Gelen kullanıcı verisi:", users); // Gelen veriyi kontrol et
      
      // Kullanıcı adı ve şifre kontrolü
      const user = users.find(
        (u) => u.kullanici_adi === username && u.sifre === password
      );
      
      if (user) {
        // Kullanıcı bilgilerini sakla (şifre hariç)
        const userInfo = {
          username: user.kullanici_adi,
          role: user.rol || 'eczaci',
        };
        
        // Kullanıcı bilgilerini state ve localStorage'a kaydet
        setCurrentUser(userInfo);
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        return { success: true };
      } else {
        setError('Kullanıcı adı veya şifre hatalı');
        return { success: false, error: 'Kullanıcı adı veya şifre hatalı' };
      }
    } catch (err) {
      console.error("Login hatası:", err);
      setError('Giriş yapılırken bir hata oluştu');
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  // Çıkış yap
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Context değerlerini sağla
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 