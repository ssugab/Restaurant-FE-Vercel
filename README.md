## REPO NOT USED
# Restaurant Frontend - Vercel Deployment

Frontend aplikasi Restaurant Menu Management System yang dideploy di Vercel.

## Fitur

- 🏠 **Landing Page** - Halaman utama dengan menu makanan
- 🔐 **Authentication** - Login dan Register untuk pelanggan
- 🍽️ **Menu Management** - Tampilan menu berdasarkan kategori
- 🛒 **Order System** - Sistem pemesanan makanan
- 💳 **Payment** - Halaman pembayaran
- 👤 **Profile** - Manajemen profil pengguna
- 👑 **Admin Panel** - Panel admin untuk mengelola menu dan order

## Struktur Folder

```
frontend/
├── admin/          # Panel admin
├── img/            # Asset gambar
├── index/          # Landing page
├── login/          # Halaman login
├── menu/           # Halaman menu
├── order/          # Halaman order
├── payment/        # Halaman payment
├── profil/         # Halaman profil
├── vercel.json     # Konfigurasi Vercel
├── package.json    # Package configuration
└── README.md       # Dokumentasi
```

## Backend API

Frontend ini terhubung dengan backend API yang dideploy di Railway:
- **API URL**: `https://handsome-blessing-production.up.railway.app/api`
- **Authentication**: JWT Token
- **API Key**: Required untuk beberapa endpoint

## Deployment

### Deploy ke Vercel

1. Push code ke repository GitHub
2. Connect repository ke Vercel
3. Vercel akan otomatis deploy menggunakan konfigurasi di `vercel.json`

### Environment Variables

Tidak ada environment variables yang diperlukan untuk frontend karena semua konfigurasi sudah di-hardcode ke production URL.

## Penggunaan

1. **Landing Page**: Akses `/` untuk melihat homepage
2. **Login**: Akses `/login` untuk login
3. **Menu**: Akses `/menu` untuk melihat menu makanan
4. **Admin**: Akses `/admin` untuk panel admin (perlu login sebagai admin)

## API Endpoints yang Digunakan

- `GET /api/menu` - Mengambil daftar menu
- `GET /api/kategori` - Mengambil kategori menu
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `POST /api/orders` - Membuat order baru
- `POST /api/payment` - Proses pembayaran

## Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan Bootstrap
- **JavaScript** - Logika frontend
- **Bootstrap 5** - Framework CSS
- **Vercel** - Platform deployment

## Fitur Keamanan

- JWT Token authentication
- API Key validation
- CORS configuration
- XSS protection headers
- Content type validation

## Support & Contact

Untuk bantuan atau pertanyaan, silakan hubungi developer. 
