# 🚀 Panduan Lengkap Deploy North Scale E-Commerce

Panduan ALL-IN-ONE untuk hosting **GRATIS** project North Scale dari awal sampai selesai!

---

## 📋 Table of Contents

1. [Export Database](#1-export-database)
2. [Pilih Hosting](#2-pilih-hosting)
3. [Deploy ke Render + Vercel (RECOMMENDED)](#3-deploy-render--vercel)
4. [Deploy ke InfinityFree + Vercel (Alternative)](#4-deploy-infinityfree--vercel)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Export Database

### Cara Termudah: Lewat phpMyAdmin

1. Buka http://localhost/phpmyadmin (atau http://localhost:8080/phpmyadmin)
2. Klik database **northscale_db** di sidebar kiri
3. Klik tab **Export** di atas
4. Pilih **Quick** export method
5. Format: **SQL**
6. Klik **Go**
7. File `northscale_db.sql` akan didownload

### File yang Tersedia

Setelah export, Anda punya file:
- **`northscale_clean.sql`** ✅ **PAKAI INI!**
  - Sudah di-fix TOTAL untuk MySQL 5.5/5.6
  - Tidak ada `ON UPDATE CURRENT_TIMESTAMP` error lagi
  - Siap diimport ke hosting manapun

---

## 2. Pilih Hosting

### Opsi A: Render + Vercel (RECOMMENDED ⭐)

**Keuntungan**:
- ✅ Tidak ada CORS issues
- ✅ HTTPS otomatis
- ✅ Auto-deploy dari GitHub
- ✅ Lebih stabil

**Stack**:
- Database → FreeSQLDatabase (MySQL gratis)
- Backend API → Render.com (PHP gratis)
- Frontend → Vercel.com (React gratis)

**Total Waktu**: ~40 menit

### Opsi B: InfinityFree + Vercel (Alternative)

**Stack**:
- Database + Backend → InfinityFree (all-in-one)
- Frontend → Vercel.com

**Kekurangan**:
- ⚠️ Kadang ada "Security Check" issue
- ⚠️ Mungkin CORS error

**Total Waktu**: ~30 menit

---

## 3. Deploy: Render + Vercel

### Step 1: Setup Database di FreeSQLDatabase (10 menit)

#### A. Daftar

1. Buka [www.freesqldatabase.com](https://www.freesqldatabase.com)
2. Klik **Sign Up**
3. Isi email, username, password
4. Verify email

#### B. Buat Database

1. Login ke dashboard
2. Klik **Create Database**
3. Database Name: `northscale`
4. Create
5. **PENTING**: Copy kredensial (muncul sekali saja!):
   ```
   Host: sql.freedb.tech
   Port: 3306
   Database: freedb_xxxxx_northscale
   Username: freedb_xxxxx
   Password: xxxxxxxx
   ```

#### C. Import Database

1. Di dashboard FreeSQLDatabase, klik **phpMyAdmin**
2. Login dengan kredensial di atas
3. Pilih database `freedb_xxxxx_northscale`
4. Tab **Import**
5. Choose File → **`northscale_clean.sql`**
6. Klik **Go**
7. Tunggu ~1 menit
8. ✅ Success: "Import has been successfully finished"

#### D. Verifikasi

Klik database di sidebar → harus ada tabel:
- categories, products, product_images
- users, orders, order_items
- cart, cart_items

✅ Database ready!

---

### Step 2: Deploy Backend ke Render (15 menit)

#### A. Push Code ke GitHub (Skip jika sudah)

```bash
cd c:\xampp\htdocs\northscale

git add .
git commit -m "Ready for deployment"
git push origin master
```

#### B. Daftar di Render

1. Buka [render.com](https://render.com)
2. **Sign up with GitHub**
3. Authorize Render

#### C. Buat Web Service

1. Dashboard → **New +** → **Web Service**
2. Connect repository → Pilih **northscale**
3. **Settings**:
   - Name: `northscale-api`
   - Region: **Singapore**
   - Branch: `master`
   - **Root Directory**: `api` ⚠️ PENTING!
   - Runtime: **PHP**
   - Build Command: (kosongkan)
   - Start Command: (kosongkan)
   - Instance Type: **Free**

#### D. Environment Variables

Klik **Add Environment Variable**, tambahkan:

| Key | Value |
|-----|-------|
| `DB_HOST` | `sql.freedb.tech` |
| `DB_NAME` | `freedb_xxxxx_northscale` |
| `DB_USER` | `freedb_xxxxx` |
| `DB_PASS` | `your_password` |

> Ganti dengan kredensial FreeSQLDatabase Anda!

#### E. Deploy

1. Scroll bawah → **Create Web Service**
2. Tunggu 3-5 menit (status: Building... → Live)
3. Copy URL API: `https://northscale-api.onrender.com`

#### F. Test API

Buka `https://northscale-api.onrender.com/` di browser:
```json
{"message": "North Scale API", "version": "1.0"}
```

✅ Backend deployed!

---

### Step 3: Deploy Frontend ke Vercel (10 menit)

#### A. Daftar di Vercel

1. Buka [vercel.com](https://vercel.com)
2. **Continue with GitHub**
3. Authorize Vercel

#### B. Import Project

1. Dashboard → **Add New...** → **Project**
2. Import Git Repository → Pilih **northscale**
3. **Settings**:
   - Framework: **Vite** (auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### C. Environment Variable

Expand **Environment Variables**, tambahkan:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://northscale-api.onrender.com` |

> Ganti dengan URL Render API Anda (no trailing slash)!

#### D. Deploy

1. Klik **Deploy**
2. Tunggu 2-3 menit
3. ✅ Website live! (dapat URL: `northscale.vercel.app`)

#### E. Test Website

Buka URL Vercel → Test:
- ✅ Products load
- ✅ Add to cart works
- ✅ Login/Register works
- ✅ Checkout works
- ✅ Admin panel works

🎉 **SELESAI!** Website live di internet!

---

## 4. Deploy: InfinityFree + Vercel

### Step 1: Setup InfinityFree (20 menit)

#### A. Daftar

1. Buka [infinityfree.net](https://infinityfree.net)
2. Sign Up → Create Account
3. Create hosting account → Pilih subdomain (contoh: `northscale.infinityfreeapp.com`)

#### B. Setup Database

1. Buka vPanel → **MySQL Databases**
2. Create Database:
   - Name: `northscale`
   - Set password
3. **Copy kredensial**:
   ```
   Host: sql200.infinityfree.com
   Database: epiz_xxxxx_northscale
   Username: epiz_xxxxx
   Password: your_password
   ```

#### C. Import Database

1. vPanel → **phpMyAdmin**
2. Login
3. Pilih database `epiz_xxxxx_northscale`
4. Import → **`northscale_clean.sql`**
5. Go → Tunggu

#### D. Upload Backend Files

**Via File Manager**:
1. vPanel → **File Manager**
2. Navigate ke `htdocs`
3. Buat folder `api`
4. Upload semua file dari folder `northscale/api` lokal
5. Struktur: `htdocs/api/index.php`, `htdocs/api/config/`, dll

**Via FTP (Lebih cepat)**:
1. Download FileZilla
2. vPanel → **FTP Details** (copy credentials)
3. FileZilla: Connect ke `ftpupload.net`
4. Drag folder `api` → `htdocs/`

#### E. Update Database Config

Di File Manager, edit `htdocs/api/config/database.php`:

```php
<?php
class Database {
    private $host = "sql200.infinityfree.com"; // dari vPanel
    private $db_name = "epiz_xxxxx_northscale";
    private $username = "epiz_xxxxx";
    private $password = "your_password";
    // ... rest
}
```

#### F. Test API

Buka: `http://your-subdomain.infinityfreeapp.com/api/`

✅ Harus return JSON

---

### Step 2: Deploy Frontend ke Vercel

Sama seperti **Step 3** di Render, tapi environment variable:

```
VITE_API_BASE_URL = http://your-subdomain.infinityfreeapp.com/api
```

> ⚠️ **Jika ada Mixed Content error**: Aktifkan SSL di InfinityFree, lalu ganti ke `https://`

---

## 5. Troubleshooting

### ❌ Error: "Unexpected character" saat import

**Solusi**: Pakai file `northscale_clean.sql` (bukan yang lain)

---

### ❌ Error: "TIMESTAMP column" 

**Solusi**: File `northscale_clean.sql` sudah fix issue ini. Pastikan pakai file yang benar.

---

### ❌ CORS Error di browser

**Solusi**: Pastikan `api/index.php` punya header ini di **paling atas**:

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ... rest
```

Commit & push ke GitHub → Render auto-redeploy.

---

### ❌ Frontend tidak bisa fetch data

**Cek**:
1. API backend sudah Live (hijau di Render)
2. Test API langsung: `https://YOUR-API-URL/products`
3. Environment variable `VITE_API_BASE_URL` di Vercel benar
4. **Redeploy** Vercel setelah update env var

---

### ❌ Render service "sleeping" (lambat)

**Normal**: Free tier Render sleep setelah 15 menit idle.

**Solusi**:
- Request pertama lambat (20-30s), request berikutnya cepat
- Atau upgrade ke paid ($7/month always-on)
- Atau pakai cron job ping setiap 10 menit

---

### ❌ InfinityFree "Security Check" error

**Penyebab**: InfinityFree block API calls dari Vercel

**Solusi**: 
- **Tidak ada fix untuk free tier**
- Gunakan **Render** instead (Opsi A)
- Atau upgrade InfinityFree ke premium

---

### ❌ Database connection failed

**Cek**:
1. ✅ Host BUKAN `localhost`
2. ✅ Credentials benar (copy-paste dari dashboard)
3. ✅ Database sudah di-import
4. ✅ Environment variables sudah di-set (Render) atau `database.php` sudah update (InfinityFree)

---

## 📊 Checklist Deployment

### Database
- [ ] Database di-export dari lokal
- [ ] File `northscale_database_fixed.sql` ready
- [ ] Database hosting dibuat
- [ ] Database di-import (no errors)
- [ ] Tabel & data terverifikasi

### Backend
- [ ] Code di-push ke GitHub
- [ ] Hosting account created (Render/InfinityFree)
- [ ] Backend deployed
- [ ] Environment variables set
- [ ] API tested (return JSON)

### Frontend
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variable `VITE_API_BASE_URL` set
- [ ] Frontend deployed
- [ ] Website tested (all features work)

### Final Test
- [ ] Browse products ✅
- [ ] Add to cart ✅
- [ ] Register/Login ✅
- [ ] Checkout ✅
- [ ] Admin panel ✅

---

## 🎉 SELESAI!

Website Anda sekarang **LIVE** di internet! 

**URLs**:
- Frontend: `https://northscale.vercel.app`
- API: `https://northscale-api.onrender.com`

**Auto-deploy**:
Setiap `git push` → Render & Vercel auto-update! 🚀

---

## 🆘 Butuh Bantuan?

**Debugging Steps**:
1. Cek Render logs (Dashboard → Logs)
2. Cek browser console (F12)
3. Test API endpoint langsung
4. Verify environment variables
5. Redeploy jika perlu

**Files Penting**:
- `northscale_database_fixed.sql` - Database export
- `api/config/database.php` - DB config (support env vars)
- `api/index.php` - CORS headers
- `src/services/api.js` - Frontend API calls

**Links**:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [FreeSQLDatabase](https://freesqldatabase.com)
- [InfinityFree](https://infinityfree.net)

Good luck! 🎊
