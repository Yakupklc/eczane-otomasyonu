# Eczane Otomasyonu

Eczane Otomasyonu, eczaneler için stok takibi, satış yönetimi ve raporlama işlemlerini kolaylaştıran bir web tabanlı sistemdir.

## Özellikler

- İlaç Yönetimi: İlaç ekleme, listeleme, silme ve stok güncelleme
- Satış İşlemleri: Sepet üzerinden satış yapma
- Stok Takibi: İlaç stoklarını gerçek zamanlı takip etme
- Raporlama: Satış raporlarını görüntüleme, filtreleme ve e-posta olarak gönderme
- Kategori Bazlı Filtreleme: İlaçları kategorilere göre filtreleme

## Kullanılan Teknolojiler

- Frontend: React, Ant Design
- Backend: Google Sheets ve Sheet.best API
- HTTP İstekleri: Axios
- Tarih İşlemleri: Moment.js

## Kurulum

1. Projeyi klonlayın
   ```
   git clone https://github.com/Yakupklc/eczane-otomasyonu.git
   cd eczane-otomasyonu
   ```

2. Frontend bağımlılıklarını yükleyin
   ```
   cd frontend
   npm install
   ```

3. Uygulamayı çalıştırın
   ```
   npm run dev
   ```

4. Tarayıcıda [http://localhost:5173](http://localhost:5173) adresini açın

## Kullanıcı Girişi

- Kullanıcı Adı: `admin`
- Şifre: `123456`

## Proje Yapısı

```
eczane-otomasyonu/
├── frontend/               # Frontend kodları
│   ├── public/             # Statik dosyalar
│   ├── src/                # Kaynak kodları
│   │   ├── components/     # React bileşenleri
│   │   ├── context/        # Context API
│   │   ├── services/       # API servisleri
│   │   └── App.jsx         # Ana uygulama
│   ├── package.json        # Bağımlılıklar
│   └── vite.config.js      # Vite yapılandırması
└── README.md               # Proje açıklaması
```

## Notlar

- Responsive tasarım kaldırılmıştır.
- Filtrelemeye "Tümü" seçeneği eklenmiştir.
- Stok durumuna göre filtreleme kaldırılmıştır.
- Türkçe karakter optimizasyonu yapılmıştır.