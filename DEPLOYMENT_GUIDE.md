# 🚀 Panduan Deploy: AeonFree + Vercel

Panduan ini khusus untuk setup **AeonFree** (Backend PHP Gratis) dan **Vercel** (Frontend React Gratis).

---

## 📋 Ringkasan Stack
- **Backend & Database**: AeonFree (Gratis, Shared Hosting)
- **Frontend**: Vercel (Gratis, Static/SPA Hosting)
- **Biaya**: Rp 0 / selamanya

---

## 1. Setup Backend (AeonFree)

### A. Daftar & Buat Akun
1. Buka [aeonfree.com](https://aeonfree.com) -> **Sign Up**.
2. Verifikasi email & Login.
3. Klik **Create New Account**.
4. Pilih **Subdomain** (gratis), misal: `northscale.aeonfree.com`.
5. Selesaikan setup sampai status akun **Active**.
6. Klik tombol **Control Panel** (hijau/biru) untuk masuk panel admin.

### B. Buat Database
1. Di Control Panel, cari menu **MySQL Databases**.
2. **Create New Database**:
   - Masukkan nama: `northscale`
   - Klik **Create Database**.
3. **PENTING**: Catat detail database Anda (lihat tabel di bawahnya):
   - **MySQL Host Name** (contoh: `sql303.aeonfree.com`)
   - **MySQL User Name** (contoh: `aeon_3512345`)
   - **MySQL Password** (copy password dari panel)
   - **MySQL Database Name** (contoh: `aeon_3512345_northscale`)

### C. Import Database SQL
1. Di halaman MySQL Databases tadi, klik tombol **Admin** di sebelah database Anda.
2. Ini akan membuka **phpMyAdmin**.
3. Klik tab **Import**.
4. Pilih file **`northscale_clean.sql`** dari folder project Anda.
5. Klik **Go** (Kirim). Tunggu sampai sukses "Import has been successfully finished".

### D. Upload File Backend
1. Kembali ke Control Panel / Client Area.
2. Klik **Online File Manager**.
3. Masuk ke folder **`htdocs`**.
4. **Hapus** file bawaan (`index2.html`, `default.php`, dll).
5. Buat folder baru: **`api`**.
6. Masuk ke folder `api`.
7. **Upload** semua file dari folder local `c:\xampp\htdocs\northscale\api\` ke sini.
   - *Tips*: Zip dulu folder `api` di komputer -> Upload zip -> Extract di File Manager (klik kanan -> Extract) agar cepat.
   - Hasil akhir: `htdocs/api/index.php`, `htdocs/api/config`, dll.

### E. Koneksi Database
1. Di File Manager, buka file `htdocs/api/config/database.php`.
2. Klik kanan -> **Edit**.
3. Ubah bagian `__construct` sesuai data di Langkah B:
   ```php
   // ...
   $this->host = 'sql303.aeonfree.com'; // Ganti Host
   $this->db_name = 'aeon_3512345_northscale'; // Ganti DB Name
   $this->username = 'aeon_3512345'; // Ganti User
   $this->password = 'password_Anda'; // Ganti Password
   // ...
   ```
4. **Save**.

### F. Test API
Buka di browser: `http://subdomain-anda.aeonfree.com/api/`
Harus muncul text JSON: `{"message": "North Scale API", ...}`

---

## 2. Setup Frontend (Vercel)

### A. Persiapan Kode
Pastikan kode sudah dipush ke GitHub.

### B. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) -> Login with GitHub.
2. **Add New...** -> **Project**.
3. Import repository `northscale`.
4. **Settings**:
   - **Framework Preset**: Vite (otomatis)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** (Wajib):
   - Klik **Environment Variables**.
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://subdomain-anda.aeonfree.com/api` (URL dari Langkah 1.F, **tanpa** slash `/` di akhir).
   - Klik **Add**.
6. Klik **Deploy**.

### C. Selesai
Setelah deploy sukses (confetti 🎉), buka link Vercel Anda. Website sudah live dengan backend AeonFree!

---

## � Troubleshooting

### API Error / Data tidak muncul?
1. Cek `http://subdomain-anda.aeonfree.com/api/products` di browser hp/laptop lain. Kalau error database, cek lagi file `database.php`.
2. Pastikan link di Environment Variable Vercel **TIDAK** berakhiran garis miring (`/`).
   - Benar: `.../api`
   - Salah: `.../api/`
3. Jika deploy ulang Vercel, pastikan "Redeploy" agar env var baru terbaca.
