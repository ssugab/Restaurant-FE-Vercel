# Panduan Deployment ke Vercel

## Prerequisites

1. Pastikan backend Railway sudah running di: `https://handsome-blessing-production.up.railway.app`
2. Akun Vercel sudah terhubung dengan GitHub
3. Repository ini sudah terhubung dengan Vercel

## Langkah Deployment

### 1. Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "New Project"
3. Import repository `ssugab/Restaurant-FE-Vercel`
4. Klik "Deploy"

### 2. Konfigurasi Otomatis
- Vercel akan otomatis mendeteksi bahwa ini adalah static site
- Menggunakan konfigurasi dari `vercel.json`
- Tidak perlu environment variables untuk frontend

### 3. Domain
Setelah deployment berhasil, aplikasi akan tersedia di:
- Production: `https://restaurant-fe-vercel.vercel.app` (atau domain yang diberikan Vercel)
- Preview: Setiap push ke branch akan mendapat preview URL

## Routing Vercel

Aplikasi menggunakan routing berikut:
- `/` → Landing page (`/index/index.html`)
- `/login` → Login page (`/login/login.html`)
- `/menu` → Menu page (`/menu/menu.html`)
- `/order` → Order page (`/order/order.html`)
- `/payment` → Payment page (`/payment/payment.html`)
- `/admin` → Admin panel (`/admin/admin.html`)
- `/profile` → Profile page (`/profil/profile.html`)

## Backend Integration

Frontend sudah dikonfigurasi untuk menggunakan Railway backend:
```javascript
const API_BASE_URL = 'https://handsome-blessing-production.up.railway.app/api';
```

## Troubleshooting

### 1. CORS Error
Jika terjadi CORS error, pastikan:
- Backend Railway sudah running
- Domain Vercel sudah ditambahkan ke CORS whitelist di backend

### 2. 404 Error
Jika halaman tidak ditemukan:
- Periksa konfigurasi routing di `vercel.json`
- Pastikan path file benar

### 3. API Not Working
Jika API tidak berfungsi:
- Periksa Network tab di browser developer tools
- Pastikan backend Railway status adalah "Active"
- Test API endpoint secara manual

## Manual Deployment

Jika ingin deploy manual:
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

## Monitoring

Setelah deployment:
1. Test semua halaman: landing, login, menu, order, payment, admin
2. Test API integration
3. Test authentication flow
4. Periksa console untuk error

## Support

Jika ada masalah deployment:
1. Periksa Vercel dashboard untuk error logs
2. Periksa Railway dashboard untuk backend status
3. Test API endpoint secara manual
4. Periksa browser console untuk frontend errors 