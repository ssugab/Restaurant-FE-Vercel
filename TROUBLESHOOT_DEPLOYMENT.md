# 🔧 TROUBLESHOOTING DEPLOYMENT ISSUES

## 🚨 **MASALAH SAAT INI:**

### **1. CORS Error di Frontend**
```
Access to fetch at 'https://handsome-blessing-production.up.railway.app/api/auth/login' from origin 'https://pemesanan-menu-restoran-ewxlu8c2g-bagus-projects-d637296f.vercel.app' has been blocked by CORS policy
```

### **2. Database Railway Kosong**
- Tidak ada admin account untuk login
- Tidak ada menu data

## ✅ **SOLUSI YANG SUDAH DITERAPKAN:**

### **✅ Frontend URLs Fixed**
Semua file frontend sudah diupdate dengan URL backend yang benar:
- ✅ **URL Lama**: `handsome-blessing-production.up.railway.app`
- ✅ **URL Baru**: `graceful-benevolence-production.up.railway.app`

### **✅ CORS Configuration Updated**
Backend sudah ditambahkan domain Vercel baru:
- ✅ `https://pemesanan-menu-restoran-ewxlu8c2g-bagus-projects-d637296f.vercel.app`

### **✅ Seed Endpoint Added**
Backend sudah ditambahkan endpoint `/api/seed` untuk seed database.

## 🚀 **LANGKAH MANUAL UNTUK DEPLOYMENT:**

### **STEP 1: Verifikasi Backend Railway**
1. **Cek Railway Dashboard**: https://railway.app/dashboard
2. **Pastikan deployment selesai** - lihat logs untuk "✅ All routes registered successfully"
3. **Test health endpoint**:
   ```bash
   curl https://graceful-benevolence-production.up.railway.app/health
   ```

### **STEP 2: Seed Database Railway**

#### **Option A: Manual Seed via Endpoint**
```bash
curl https://graceful-benevolence-production.up.railway.app/api/seed
```

#### **Option B: Auto-Seed via Environment Variable**
1. **Login ke Railway Dashboard**
2. **Go to your project** → **Variables**
3. **Set/Update**:
   ```
   RUN_SEED=true
   ```
4. **Redeploy** aplikasi

### **STEP 3: Test Login Setelah Seed**
Setelah database di-seed, gunakan credentials:

**Admin Account 1:**
- **Email**: `dilla@gmail.com`
- **Password**: `password123`

**Admin Account 2:**
- **Email**: `bayu@gmail.com`
- **Password**: `password123`

### **STEP 4: Deploy Frontend ke Vercel**
1. **Push frontend** ke repository yang benar: https://github.com/ssugab/Restaurant-FE-Vercel.git
2. **Vercel akan auto-deploy** dari GitHub
3. **Test CORS** dengan login di Vercel

## 🔍 **DEBUGGING COMMAND:**

### **Check Backend Status:**
```bash
# Health check
curl https://graceful-benevolence-production.up.railway.app/health

# Available routes
curl https://graceful-benevolence-production.up.railway.app/debug-routes

# CORS test
curl https://graceful-benevolence-production.up.railway.app/cors-test
```

### **Test API Endpoints:**
```bash
# Test auth endpoint
curl -X POST https://graceful-benevolence-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dilla@gmail.com","password":"password123"}'

# Get menu
curl https://graceful-benevolence-production.up.railway.app/api/menu
```

## 🎯 **EXPECTED RESULTS:**

✅ **Backend**: https://graceful-benevolence-production.up.railway.app
✅ **Frontend**: https://pemesanan-menu-restoran-api.vercel.app
✅ **Database**: Seeded with admin accounts and menu data
✅ **CORS**: Working between Vercel and Railway

## 🔧 **JIKA MASIH ERROR:**

### **1. Railway Deployment Issues**
- Check Railway dashboard logs
- Ensure all environment variables set correctly
- Verify MySQL service is running

### **2. Frontend CORS Issues**
- Update `allowedOrigins` di backend jika Vercel URL berubah
- Clear browser cache
- Test di incognito mode

### **3. Database Connection Issues**
- Check MySQL environment variables di Railway
- Verify MYSQL_URL format yang benar
- Test connection dengan `test-mysql-connection.js`

---

**💡 TIP**: Selalu cek Railway dashboard logs untuk melihat error messages real-time selama deployment. 