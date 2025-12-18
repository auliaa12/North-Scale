# 🚀 Quick Start: Deploy North Scale

## Langkah Cepat Hosting Gratis

### 1️⃣ Export Database (5 menit)
```bash
# Double-click file ini:
export_database.bat

# Atau manual di phpMyAdmin:
# http://localhost/phpmyadmin → Export
```
✅ File `northscale_database.sql` siap diupload

---

### 2️⃣ Setup InfinityFree (15 menit)
1. **Daftar**: [infinityfree.net](https://infinityfree.net) → Sign Up
2. **Buat Hosting**: Create Account → Pilih subdomain
3. **Database**: 
   - MySQL Databases → Create
   - phpMyAdmin → Import file `.sql`
   - **CATAT**: hostname, db_name, username, password
4. **Upload API**:
   - File Manager → `htdocs/` → Buat folder `api`
   - Upload semua isi folder `northscale/api/`
5. **Update Config**: Edit `htdocs/api/config/database.php`:
   ```php
   private $host = "sql200.infinityfree.com"; // dari panel
   private $db_name = "epiz_xxxxx_northscale";
   private $username = "epiz_xxxxx";
   private $password = "your_password";
   ```
6. **Test**: Buka `http://yoursite.infinityfreeapp.com/api/`
   - Harus return JSON ✅

---

### 3️⃣ Deploy ke Vercel (10 menit)
```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/northscale.git
git push -u origin main
```

**Di Vercel**:
1. [vercel.com](https://vercel.com) → Login with GitHub
2. New Project → Import `northscale`
3. Framework: **Vite**
4. Environment Variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `http://yoursite.infinityfreeapp.com/api`
5. **Deploy** → Tunggu 2-3 menit ✅

---

## ✅ Checklist

- [ ] Database exported
- [ ] InfinityFree account created
- [ ] Database imported di InfinityFree
- [ ] API files uploaded
- [ ] `database.php` updated
- [ ] API tested (return JSON)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variable set
- [ ] Frontend deployed
- [ ] Test website working

---

## 🔗 URLs Penting

- InfinityFree: https://infinityfree.net
- Vercel: https://vercel.com
- GitHub: https://github.com

---

## ⚠️ Jika Ada Masalah

### API tidak bisa diakses dari Vercel?
→ Gunakan **Render** bukan InfinityFree (lihat `INFINITYFREE_VERCEL_GUIDE.md`)

### Mixed Content Error?
```
Vercel (HTTPS) ← X → InfinityFree (HTTP)
```
→ Aktifkan SSL di InfinityFree vPanel

### CORS Error?
→ Pastikan `api/index.php` punya header:
```php
header("Access-Control-Allow-Origin: *");
```

---

## 📖 Panduan Lengkap
Lihat: [`INFINITYFREE_VERCEL_GUIDE.md`](file:///c:/xampp/htdocs/northscale/INFINITYFREE_VERCEL_GUIDE.md)
