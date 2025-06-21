# Frontend Deployment ke Vercel

## Quick Start
1. Push code ke repository: `https://github.com/ssugab/Menu-Restaurant-FE.git`
2. Connect repository ke Vercel
3. Deploy otomatis akan berjalan

## Repository
```
https://github.com/ssugab/Menu-Restaurant-FE.git
```

## Domain Target
```
https://pemesanan-menu-restoran.vercel.app
```

## File Konfigurasi
- ✅ `vercel.json` - Routing configuration
- ✅ `package.json` - Dependencies
- ✅ `.gitignore` - Git ignore rules

## Environment Variables (Set di Vercel)
```
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api
NODE_ENV=production
```

## Langkah Detail
Lihat `VERCEL_DEPLOY.md` untuk panduan lengkap.

## Testing
Setelah deploy, test URL:
- `https://your-domain.vercel.app/`
- `https://your-domain.vercel.app/menu`
- `https://your-domain.vercel.app/login` 