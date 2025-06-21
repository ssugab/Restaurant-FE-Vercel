# Vercel Deployment Guide

## Langkah-langkah Deploy Frontend ke Vercel

### 1. Persiapan Repository
Pastikan repository frontend Anda sudah tersedia:
```
https://github.com/ssugab/Menu-Restaurant-FE.git
```

### 2. Import Project ke Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import dari GitHub repository: `ssugab/Menu-Restaurant-FE`
4. Set framework preset ke "Other"

### 3. Build & Output Settings
Di Vercel dashboard, set konfigurasi berikut:

#### Build Command:
```bash
echo "No build step required for static files"
```

#### Output Directory:
```
./
```

#### Install Command:
```bash
npm install
```

### 4. Environment Variables
Set environment variables berikut di Vercel dashboard:

- `NEXT_PUBLIC_API_URL` = `https://your-railway-app.up.railway.app/api`
- `NODE_ENV` = `production`

### 5. Domain Configuration
Vercel akan memberikan domain otomatis seperti:
- `https://menu-restaurant-fe.vercel.app`
- `https://pemesanan-menu-restoran.vercel.app`

### 6. Custom Domain (Optional)
Jika ingin custom domain:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records sesuai instruksi Vercel

### 7. Deployment
1. Push code ke repository GitHub
2. Vercel akan otomatis deploy ketika ada perubahan di main branch
3. Check deployment logs di Vercel dashboard

### 8. Testing
Setelah deploy berhasil, test halaman berikut:
- `/` - Homepage
- `/login` - Login page
- `/menu` - Menu page
- `/order` - Order page
- `/payment` - Payment page
- `/admin` - Admin dashboard

### File Konfigurasi
- `vercel.json` - Konfigurasi routing dan headers
- `package.json` - Dependencies dan scripts
- `.gitignore` - File yang diabaikan git

### Optimasi
1. **Caching**: Vercel otomatis cache static files
2. **CDN**: Global CDN untuk performa optimal
3. **Compression**: Otomatis compress file

### Troubleshooting
1. **Build failed**: Check build logs di Vercel dashboard
2. **Routing error**: Periksa konfigurasi `vercel.json`
3. **API connection error**: Pastikan CORS sudah dikonfigurasi di backend
4. **Static files not loading**: Check file paths dan directory structure

### CORS Configuration
Pastikan backend Railway sudah mengizinkan origin dari domain Vercel:
```javascript
const allowedOrigins = [
  'https://your-vercel-domain.vercel.app',
  // ... origins lainnya
];
``` 