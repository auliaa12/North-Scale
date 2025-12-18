# 🚀 Deploy North Scale dengan Render + Vercel

Panduan lengkap hosting **GRATIS** yang **lebih stabil** daripada InfinityFree.

## 🎯 Stack Hosting

| Component | Platform | Biaya |
|-----------|----------|-------|
| **Frontend (React)** | Vercel | ✅ Gratis Selamanya |
| **Backend (PHP API)** | Render | ✅ Gratis (750 jam/bulan) |
| **Database (MySQL)** | FreeSQLDatabase | ✅ Gratis |

### ✅ Keuntungan Opsi Ini:
- 🚫 **Tidak ada** security check/browser verification
- 🚫 **Tidak ada** CORS issues seperti InfinityFree
- ✅ **HTTPS** otomatis untuk backend
- ✅ **Lebih cepat** dan stabil
- ✅ **Auto-deploy** dari GitHub

---

## 📋 Langkah 1: Persiapan Database (10 menit)

### A. Daftar di FreeSQLDatabase

1. 🌐 Buka [www.freesqldatabase.com](https://www.freesqldatabase.com)
2. Klik **Sign Up** (atau **Get Started Free**)
3. Isi form registrasi:
   - Email
   - Username
   - Password
4. Verify email Anda

### B. Buat Database MySQL

1. Login ke dashboard FreeSQLDatabase
2. Klik **Create Database** atau **New Database**
3. Isi form:
   - **Database Name**: `northscale` (atau nama lain)
   - **Description**: North Scale E-Commerce DB
4. Klik **Create**
5. **PENTING**: Catat kredensial ini (akan muncul di dashboard):

```
Host: sql.freedb.tech (atau sesuai yang diberikan)
Port: 3306
Database Name: freedb_northscale
Username: freedb_youruser
Password: [auto-generated password]
```

> [!WARNING]
> Password hanya ditampilkan **SEKALI**. Copy dan simpan di tempat aman!

### C. Import Database

**Cara 1: phpMyAdmin (Mudah)**
1. Di dashboard FreeSQLDatabase, klik **phpMyAdmin**
2. Login dengan kredensial yang baru dibuat
3. Pilih database `freedb_northscale` di sidebar kiri
4. Klik tab **Import**
5. **Choose File** → Pilih file `northscale_database.sql` (yang Anda export sebelumnya)
6. Scroll ke bawah, klik **Go**
7. Tunggu hingga muncul "Import has been successfully finished"

**Cara 2: Export dulu jika belum punya**
```bash
# Di terminal lokal, jalankan:
cd c:\xampp\htdocs\northscale

# Double-click file ini:
export_database.bat
```

### D. Verifikasi Database

1. Di phpMyAdmin, klik database Anda
2. Pastikan semua tabel sudah ada:
   - `categories`
   - `products` 
   - `product_images`
   - `users`
   - `orders`
   - `order_items`
   - `cart`
   - dll.

✅ Database siap!

---

## 📋 Langkah 2: Prepare Backend untuk Render (5 menit)

### A. Update Database Config

Edit file [`api/config/database.php`](file:///c:/xampp/htdocs/northscale/api/config/database.php):

```php
<?php
class Database {
    // Ganti dengan kredensial FreeSQLDatabase Anda
    private $host = "sql.freedb.tech"; // dari FreeSQLDatabase
    private $db_name = "freedb_northscale"; // Database name
    private $username = "freedb_youruser"; // Username
    private $password = "your_password_here"; // Password yang di-copy tadi
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

> [!IMPORTANT]
> **JANGAN** commit password ke GitHub! Nanti kita akan pakai environment variables di Render.

### B. Buat File Konfigurasi untuk Environment Variables

Buat file baru [`api/config/database.php`](file:///c:/xampp/htdocs/northscale/api/config/database.php) yang support environment variables:

```php
<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Gunakan environment variables jika ada (untuk production)
        // Atau default ke localhost untuk development
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'northscale';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: '';
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

### C. Commit & Push ke GitHub

```bash
cd c:\xampp\htdocs\northscale

git add .
git commit -m "Update database config for Render deployment"
git push origin master
```

✅ Backend siap untuk deploy!

---

## 📋 Langkah 3: Deploy Backend ke Render (15 menit)

### A. Daftar di Render

1. 🌐 Buka [render.com](https://render.com)
2. Klik **Get Started** atau **Sign Up**
3. **Sign up with GitHub** (recommended untuk auto-deploy)
4. Authorize Render untuk akses repository Anda

### B. Buat Web Service

1. Di Render Dashboard, klik **New +** (di pojok kanan atas)
2. Pilih **Web Service**
3. **Connect a repository**: 
   - Jika belum connect GitHub, klik **Connect account**
   - Pilih repository **`northscale`**
   - Klik **Connect**

### C. Configure Web Service

Fill in the settings:

#### Basic Info
- **Name**: `northscale-api` (atau nama lain, ini akan jadi subdomain)
- **Region**: Singapore (terdekat dengan Indonesia)
- **Branch**: `master` (atau `main`)
- **Root Directory**: `api` ⚠️ **PENTING!**

#### Runtime
- **Runtime**: **PHP**
- **Build Command**: (leave empty atau isi `composer install` jika pakai composer)
- **Start Command**: (leave empty, Render auto-detect)

#### Instance Type
- **Instance Type**: **Free** ✅

### D. Set Environment Variables

Scroll ke **Environment Variables**, klik **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `DB_HOST` | `sql.freedb.tech` |
| `DB_NAME` | `freedb_northscale` |
| `DB_USER` | `freedb_youruser` |
| `DB_PASS` | `your_password_here` |

> [!TIP]
> Ganti value dengan kredensial FreeSQLDatabase Anda yang dicatat tadi!

### E. Deploy!

1. Scroll ke bawah
2. Klik **Create Web Service**
3. Render akan mulai build & deploy (tunggu 3-5 menit)
4. Status akan berubah:
   - 🟡 **Building...**
   - 🟢 **Live** ✅

### F. Get API URL

Setelah deploy sukses:
1. Di halaman service, lihat URL di bagian atas
2. Akan seperti: `https://northscale-api.onrender.com`
3. **Copy URL ini** (akan dipakai di Vercel)

### G. Test Backend API

1. Buka browser, kunjungi: `https://northscale-api.onrender.com/`
2. ✅ **Berhasil**: Anda melihat JSON response:
   ```json
   {"message": "North Scale API", "version": "1.0"}
   ```
3. Test endpoints lain:
   - `https://northscale-api.onrender.com/products` → List produk
   - `https://northscale-api.onrender.com/categories` → List kategori

> [!NOTE]
> **Free tier Render** akan "sleep" setelah 15 menit tidak ada request. Request pertama akan lambat (20-30 detik), tapi request berikutnya cepat.

✅ Backend deployed!

---

## 📋 Langkah 4: Deploy Frontend ke Vercel (10 menit)

### A. Update API URL di Code (Development)

Edit file [`src/services/api.js`](file:///c:/xampp/htdocs/northscale/src/services/api.js):

```javascript
// Base URL for API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/northscale/api';
```

Pastikan menggunakan environment variable `VITE_API_BASE_URL`.

### B. Test Lokal dengan Render API

```bash
# Set environment variable sementara
$env:VITE_API_BASE_URL="https://northscale-api.onrender.com"

# Run dev server
npm run dev
```

Buka `http://localhost:5176` dan test:
- Browse products ✅
- Add to cart ✅
- Login ✅

Jika semua works, lanjut deploy!

### C. Commit & Push

```bash
# Reset env variable
Remove-Item Env:\VITE_API_BASE_URL

# Commit jika ada perubahan
git add .
git commit -m "Ready for Vercel deployment"
git push origin master
```

### D. Daftar di Vercel

1. 🌐 Buka [vercel.com](https://vercel.com)
2. Klik **Sign Up**
3. **Continue with GitHub**
4. Authorize Vercel

### E. Import Project

1. Di Vercel Dashboard, klik **Add New...** → **Project**
2. **Import Git Repository**:
   - Pilih repository **`northscale`**
   - Klik **Import**

### F. Configure Project

#### Framework Preset
- **Framework Preset**: **Vite** (auto-detect)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)

#### Environment Variables

Klik **Environment Variables** (expand), tambahkan:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://northscale-api.onrender.com` |

> [!IMPORTANT]
> Ganti dengan URL Render API Anda (tanpa trailing slash)!

### G. Deploy!

1. Klik **Deploy**
2. Vercel akan build (1-3 menit)
3. Status:
   - 🟡 **Building...**
   - 🟢 **Ready** ✅

### H. Get Website URL

1. Setelah deploy sukses, Vercel akan tampilkan URL
2. Biasanya: `https://northscale.vercel.app` atau `https://northscale-xxx.vercel.app`
3. Klik **Visit** atau buka URL di browser

### I. Test Website

✅ Test semua fitur:
- [ ] Homepage load dengan products
- [ ] Categories berfungsi
- [ ] Search products
- [ ] Add to cart
- [ ] Cart page
- [ ] Register new user
- [ ] Login
- [ ] Place order
- [ ] User profile
- [ ] Admin login (`http://localhost/northscale/admin`)
- [ ] Admin dashboard, products, orders

✅ Website live!

---

## 🔧 Troubleshooting

### ❌ Render API tidak bisa connect ke database

**Error**: `Connection error: SQLSTATE[HY000] [2002]...`

**Solusi**:
1. Cek environment variables di Render:
   - Dashboard → Service → **Environment**
   - Pastikan `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` benar
2. Test koneksi database:
   - Buka phpMyAdmin FreeSQLDatabase
   - Pastikan bisa login
3. Pastikan IP Render tidak diblokir (biasanya tidak)

---

### ❌ Frontend tidak bisa fetch data dari API

**Error di Console**: `Failed to fetch` atau `Network Error`

**Solusi**:
1. Pastikan Render API sudah **Live** (hijau)
2. Test API langsung di browser: `https://northscale-api.onrender.com/products`
3. Cek environment variable di Vercel:
   - Vercel Dashboard → Project → **Settings** → **Environment Variables**
   - Pastikan `VITE_API_BASE_URL` benar (HTTPS, no trailing slash)
4. **Redeploy** Vercel setelah update env var:
   - Tab **Deployments** → Klik **...** → **Redeploy**

---

### ❌ CORS Error

**Error**: `Access to fetch... has been blocked by CORS policy`

**Solusi**:

Edit [`api/index.php`](file:///c:/xampp/htdocs/northscale/api/index.php), pastikan ada di **paling atas**:

```php
<?php
// CORS Headers - HARUS DI PALING ATAS!
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ... rest of your code
```

Commit & push, Render akan auto-redeploy.

---

### ❌ Render Service "Sleeping"

**Problem**: Request pertama lambat (20-30 detik)

**Penjelasan**: Free tier Render akan sleep setelah 15 menit idle.

**Solusi**:
1. **Upgrade** ke paid plan ($7/bulan untuk always-on)
2. Atau **biarkan** (request berikutnya cepat)
3. Atau pakai **cron job** untuk ping setiap 10 menit (keep alive)

**Cara Keep Alive** (Optional):
- Gunakan service seperti [cron-job.org](https://cron-job.org)
- Set ping ke `https://northscale-api.onrender.com` setiap 10 menit

---

### ❌ Database Connection Limit

**Error**: `Too many connections`

**Solusi**:
- FreeSQLDatabase free tier punya limit koneksi
- Pastikan PHP script close koneksi dengan benar
- Atau upgrade database (atau pakai alternatif: db4free.net)

---

## 🚀 Auto-Deploy dari GitHub

**Keuntungan**: Setiap kali Anda push ke GitHub, Render & Vercel akan auto-deploy!

### Setup (Sudah otomatis):
- ✅ Render: Auto-deploy when push to `master`
- ✅ Vercel: Auto-deploy when push to any branch

### Workflow:
```bash
# Make changes
code .

# Test locally
npm run dev

# Commit & push
git add .
git commit -m "Update feature X"
git push origin master

# 🚀 Render & Vercel akan auto-deploy dalam 3-5 menit!
```

---

## 📊 Monitoring & Logs

### Render Logs
1. Render Dashboard → Your Service
2. Tab **Logs**
3. Lihat real-time logs (SQL queries, errors, dll)

### Vercel Logs
1. Vercel Dashboard → Your Project
2. Tab **Deployments**
3. Klik deployment → **View Function Logs**

---

## 🎯 Checklist Deployment

- [ ] FreeSQLDatabase account created
- [ ] Database created & imported
- [ ] Database credentials dicatat
- [ ] `api/config/database.php` updated dengan env vars
- [ ] Code pushed ke GitHub
- [ ] Render account created
- [ ] Render Web Service created
- [ ] Render environment variables set
- [ ] Render deployed & **Live**
- [ ] Render API tested (return JSON)
- [ ] Vercel account created
- [ ] Vercel project imported
- [ ] Vercel environment variable set
- [ ] Vercel deployed & **Ready**
- [ ] Website tested (all features working)

---

## 🌐 URLs Penting

Catat URLs Anda:

```
Database (FreeSQLDatabase):
- phpMyAdmin: https://phpmyadmin.freedb.tech
- Host: sql.freedb.tech

Backend (Render):
- Dashboard: https://dashboard.render.com
- API URL: https://northscale-api.onrender.com

Frontend (Vercel):
- Dashboard: https://vercel.com/dashboard
- Website URL: https://northscale.vercel.app

GitHub:
- Repository: https://github.com/username/northscale
```

---

## 💡 Tips & Best Practices

### 1. **Gunakan .env untuk Development**
Buat file `.env.local`:
```env
VITE_API_BASE_URL=http://localhost/northscale/api
```

Add ke `.gitignore`:
```
.env.local
```

### 2. **Monitoring Uptime**
Gunakan [UptimeRobot](https://uptimerobot.com) untuk monitor:
- Render API
- Vercel Frontend

### 3. **Backup Database**
Export database secara berkala:
- phpMyAdmin → Export → Download

### 4. **Custom Domain (Optional)**
- **Frontend**: Vercel Settings → Domains → Add Domain
- **Backend**: Render Settings → Custom Domains → Add Domain

---

## 🆘 Butuh Bantuan?

**Debugging Steps**:
1. ✅ Cek Render logs untuk backend errors
2. ✅ Cek browser console (F12) untuk frontend errors  
3. ✅ Test API endpoint langsung di browser
4. ✅ Verifikasi environment variables
5. ✅ Restart Render service jika perlu (Manual Deploy)

**Resources**:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [FreeSQLDatabase FAQ](https://freesqldatabase.com/faq)

---

## ✅ Selamat!

Website Anda sekarang **LIVE** dan bisa diakses dari mana saja! 🎉

**Share URL Anda**:
- Frontend: `https://northscale.vercel.app`
- API: `https://northscale-api.onrender.com`

**Next Steps**:
- Customize domain
- Add more features
- Monitor performance
- Share dengan teman! 🚀
