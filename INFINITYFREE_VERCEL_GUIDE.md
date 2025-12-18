# Panduan Hosting Gratis: North Scale E-Commerce

Panduan lengkap untuk hosting gratis project **North Scale** (Frontend + Backend + Database).

## 🎯 Pilihan Hosting Gratis

### Opsi 1: InfinityFree + Vercel (Recommended untuk Pemula)
- ✅ **Frontend**: Vercel (Gratis, unlimited bandwidth)
- ✅ **Backend PHP**: InfinityFree
- ✅ **Database**: MySQL di InfinityFree
- ⚠️ **Catatan**: Ada kemungkinan CORS/Security issues

### Opsi 2: Render + Vercel (Lebih Stabil)
- ✅ **Frontend**: Vercel
- ✅ **Backend PHP**: Render Web Service
- ✅ **Database**: Free MySQL dari services seperti FreeSQLDatabase
- ✅ **Keuntungan**: Tidak ada browser check security

### Opsi 3: Full Stack di Vercel
- ✅ **Frontend + Backend**: Vercel Serverless Functions
- ⚠️ **Memerlukan**: Convert PHP ke Node.js/Python

---

## 📋 OPSI 1: InfinityFree + Vercel

> [!WARNING]
> **Penting tentang InfinityFree**: Provider hosting gratis seperti InfinityFree memiliki "Security System" yang bisa memblokir API request dari situs eksternal (seperti Vercel). Jika React app Anda mendapat `403 Forbidden` atau error HTML bukan JSON, artinya InfinityFree memblokir koneksi tersebut.
> 
> **Solusi**: Gunakan Opsi 2 (Render) atau upgrade ke premium hosting.

### A. Setup Backend di InfinityFree

#### 1. Daftar & Buat Akun
1. 🌐 Kunjungi [InfinityFree.net](https://infinityfree.net)
2. Klik **Sign Up** dan buat akun gratis
3. Setelah login, klik **Create Account** untuk buat hosting account
4. Pilih subdomain (contoh: `northscale.infinityfreeapp.com`)

#### 2. Export Database Lokal
Buka terminal dan jalankan:
```bash
# Export database dari MySQL lokal
# Ganti 'root' dengan username MySQL Anda
```

Atau bisa export lewat phpMyAdmin:
1. Buka `http://localhost/phpmyadmin`
2. Pilih database `northscale`
3. Klik tab **Export**
4. Klik **Go** untuk download `.sql` file

#### 3. Setup Database di InfinityFree
1. Login ke **InfinityFree Control Panel** (vPanel)
2. Scroll ke **MySQL Databases**
3. Klik **Create Database**:
   - Database Name: `northscale` (akan jadi `epiz_xxxxx_northscale`)
   - Username: otomatis dibuat
   - Password: set password yang kuat
4. **PENTING**: Catat kredensial berikut:
   ```
   MySQL Hostname: sql200.infinityfree.com (atau sesuai panel Anda)
   Database Name: epiz_xxxxx_northscale
   Username: epiz_xxxxx
   Password: [password yang Anda buat]
   ```

#### 4. Import Database
1. Di vPanel, klik **phpMyAdmin**
2. Login dengan kredensial yang baru dibuat
3. Pilih database `epiz_xxxxx_northscale`
4. Klik tab **Import**
5. Pilih file `.sql` yang di-export tadi
6. Klik **Go** dan tunggu hingga selesai

#### 5. Update Konfigurasi Database
Edit file [`api/config/database.php`](file:///c:/xampp/htdocs/northscale/api/config/database.php):

```php
<?php
class Database {
    private $host = "sql200.infinityfree.com"; // Ganti sesuai panel Anda
    private $db_name = "epiz_xxxxx_northscale"; // Database name dari panel
    private $username = "epiz_xxxxx"; // Username dari panel
    private $password = "your_password_here"; // Password yang Anda buat
    private $conn;
    // ... rest of code
}
```

#### 6. Upload File Backend
**Cara 1: File Manager (Mudah)**
1. Di vPanel, klik **Online File Manager**
2. Navigate ke folder `htdocs`
3. Buat folder baru bernama `api`
4. Upload semua file dari folder `northscale/api` lokal Anda ke `htdocs/api`
5. Struktur harus seperti ini:
   ```
   htdocs/
   └── api/
       ├── index.php
       ├── config/
       │   └── database.php
       ├── controllers/
       │   ├── ProductController.php
       │   ├── OrderController.php
       │   └── ...
       └── ...
   ```

**Cara 2: FTP dengan FileZilla (Lebih Cepat untuk banyak file)**
1. Download [FileZilla](https://filezilla-project.org/)
2. Di vPanel InfinityFree, klik **FTP Details**
3. Catat: FTP Hostname, Username, Password
4. Buka FileZilla:
   - Host: `ftpupload.net` (atau sesuai panel)
   - Username: `epiz_xxxxx`
   - Password: [FTP password]
   - Port: 21
5. Drag & drop folder `api` ke `htdocs/`

#### 7. Test Backend API
1. Buka browser, kunjungi: `http://your-subdomain.infinityfreeapp.com/api/`
2. ✅ **Berhasil**: Anda melihat JSON response seperti:
   ```json
   {"message": "North Scale API", "version": "1.0"}
   ```
3. ❌ **Gagal**: Jika muncul "Security Check" atau "Browser Check", API tidak akan bisa dipanggil dari Vercel (gunakan Opsi 2)

4. Test endpoint lain:
   - `/api/products` - harus return daftar produk
   - `/api/categories` - harus return daftar kategori

---

### B. Setup Frontend di Vercel

#### 1. Persiapan GitHub
Jika belum push ke GitHub:
```bash
cd c:\xampp\htdocs\northscale

# Initialize git jika belum
git init
git add .
git commit -m "Initial commit"

# Buat repo di GitHub, lalu:
git remote add origin https://github.com/username/northscale.git
git branch -M main
git push -u origin main
```

#### 2. Deploy ke Vercel
1. 🌐 Kunjungi [vercel.com](https://vercel.com)
2. Sign up/Login dengan GitHub
3. Klik **Add New Project**
4. **Import Git Repository** → Pilih repo `northscale`
5. **Configure Project**:
   - **Framework Preset**: **Vite**
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)

#### 3. Setup Environment Variables
Di **Environment Variables** section, tambahkan:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `http://your-subdomain.infinityfreeapp.com/api` |

> [!IMPORTANT]
> Ganti `your-subdomain` dengan subdomain InfinityFree Anda!

#### 4. Deploy
1. Klik **Deploy**
2. Tunggu 2-3 menit
3. ✅ **Berhasil**: Anda akan dapat URL Vercel seperti `northscale.vercel.app`

#### 5. Test Frontend
1. Buka URL Vercel Anda
2. Coba fitur:
   - Browse products
   - Add to cart
   - Login/Register
   - Place order

---

## 🔧 Troubleshooting

### ❌ Mixed Content Error
**Problem**: Vercel (HTTPS) tidak bisa panggil InfinityFree (HTTP)

**Solution**:
1. Di InfinityFree vPanel, aktifkan SSL:
   - Klik **SSL Certificates**
   - Pilih **Free SSL** (Cloudflare)
   - Install SSL
2. Update environment variable di Vercel:
   - `VITE_API_BASE_URL` = `https://your-subdomain.infinityfreeapp.com/api`
3. Redeploy Vercel

### ❌ CORS Error
**Problem**: Cross-Origin Request Blocked

**Solution**: 
Pastikan [`api/index.php`](file:///c:/xampp/htdocs/northscale/api/index.php) punya header ini di bagian paling atas:
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
// ... rest of code
```

### ❌ 403 Forbidden / Security Check
**Problem**: InfinityFree memblokir API calls

**Solution**: Tidak ada fix untuk free tier. **Gunakan Opsi 2** (Render) atau upgrade hosting.

### ❌ Database Connection Failed
**Problem**: API tidak bisa connect ke database

**Checklist**:
1. ✅ Host bukan `localhost`, tapi `sqlXXX.infinityfree.com`
2. ✅ Database name, username, password sesuai panel
3. ✅ Database sudah di-import dengan benar
4. ✅ Cek `api/config/database.php` sudah update

---

## 📋 OPSI 2: Render + Vercel (Lebih Stabil)

> [!TIP]
> Opsi ini lebih stabil dan tidak ada security check issues seperti InfinityFree.

### A. Setup Database (Free MySQL)
1. Daftar di [db4free.net](https://db4free.net) atau [FreeSQLDatabase.com](https://freesqldatabase.com)
2. Buat database MySQL gratis
3. Catat kredensial: host, database name, username, password

### B. Deploy Backend ke Render
1. 🌐 Kunjungi [render.com](https://render.com)
2. Sign up dengan GitHub
3. Klik **New** → **Web Service**
4. Connect repository `northscale`
5. **Settings**:
   - **Name**: `northscale-api`
   - **Root Directory**: `api`
   - **Environment**: **PHP**
   - **Build Command**: (leave empty)
   - **Start Command**: (Render auto-detect)
6. **Environment Variables**: Tambahkan DB credentials
7. Klik **Create Web Service**
8. Tunggu deploy selesai, dapat URL seperti `northscale-api.onrender.com`

### C. Deploy Frontend ke Vercel
Sama seperti Opsi 1, tapi environment variable:
- `VITE_API_BASE_URL` = `https://northscale-api.onrender.com`

---

## 📌 Setelah Deploy

### Update Environment di Vercel
Jika Anda perlu ganti API URL:
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Edit `VITE_API_BASE_URL`
3. **Save**
4. Tab **Deployments** → **Redeploy**

### Custom Domain (Opsional)
**Frontend (Vercel)**:
1. Settings → **Domains**
2. Add domain Anda (misal dari [Freenom](https://freenom.com) gratis)

**Backend (InfinityFree)**:
1. vPanel → **Addon Domains**
2. Add domain untuk API

---

## 🎯 Checklist Deployment

- [ ] Database di-export dari lokal
- [ ] Database di-import ke hosting
- [ ] `database.php` updated dengan credentials hosting
- [ ] Backend files uploaded ke hosting
- [ ] Backend API bisa diakses dan return JSON
- [ ] Code di-push ke GitHub
- [ ] Vercel project created dan connected
- [ ] Environment variable `VITE_API_BASE_URL` diset
- [ ] Frontend deployed dan bisa diakses
- [ ] Test semua fitur: browse, cart, checkout, admin panel

---

## 🆘 Butuh Bantuan?

Jika mengalami error:
1. Check browser console (F12) untuk error messages
2. Check Vercel deployment logs
3. Check InfinityFree error logs (vPanel → **Error Logs**)
4. Pastikan CORS headers sudah benar
5. Test API endpoint langsung di browser
