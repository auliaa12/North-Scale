# 📸 Panduan Upload Multiple Images untuk Produk

## Fitur Baru

### 🎯 Untuk Admin
Admin sekarang bisa upload **hingga 5 gambar** untuk setiap produk.

#### Cara Upload Gambar:
1. Masuk ke **Admin Panel** → **Products** → **Add/Edit Product**
2. Scroll ke bagian **Product Images**
3. Klik area upload atau drag & drop gambar
4. Upload maksimal 5 gambar (JPG, PNG, GIF)

#### Penting! 📌
- **Gambar pertama** yang diupload otomatis menjadi **thumbnail utama**
- Thumbnail akan ditampilkan di:
  - Product List
  - Shopping Cart
  - Order Details
  - Product Detail (sidebar thumbnails)

#### Urutan Gambar:
- Gambar #1 = **Main Thumbnail** (ditandai dengan badge "Thumbnail")
- Gambar #2-5 = Gambar tambahan

### 🛍️ Untuk User
Tampilan detail produk sekarang menampilkan:
- **Thumbnail sidebar** di sebelah kiri (jika ada multiple images)
- **Gambar besar** di tengah
- Klik thumbnail untuk mengganti gambar besar
- Hover effect dan smooth transitions

## Tampilan Baru

### Detail Produk
```
┌─────────────────────────────────────┐
│  [📷]  ┌──────────────────┐         │
│  [📷]  │                  │         │
│  [📷]  │   Main Image     │  Info   │
│  [📷]  │                  │         │
│  [📷]  └──────────────────┘         │
└─────────────────────────────────────┘
```

### Admin Upload Form
- Counter: "Images: 3 / 5"
- Badge "Thumbnail" pada gambar pertama
- Nomor urutan pada setiap gambar
- Hapus gambar dengan hover button

## Reset Data (Jika Diperlukan)

Jika data lama perlu direset untuk melihat produk dengan multiple images:

1. Buka Browser Console (F12)
2. Ketik: `resetLocalStorage()`
3. Tekan Enter
4. Konfirmasi reset
5. Halaman akan reload dengan data baru

## Technical Details

### Struktur Data Product
```javascript
{
  id: 1,
  name: "Product Name",
  images: [
    { 
      id: 1, 
      image_path: "url", 
      is_main: true  // First image
    },
    { 
      id: 2, 
      image_path: "url", 
      is_main: false 
    }
  ],
  main_image: "url" // For backward compatibility
}
```

### Validasi
- Maksimal 5 gambar per produk
- Alert jika mencoba upload lebih dari 5
- Validasi di frontend dan backend (localStorage service)

## Tips untuk Admin

1. **Pilih Gambar Terbaik untuk Thumbnail**
   - Upload gambar terbaik/paling menarik sebagai gambar pertama
   - Ini akan jadi first impression di halaman produk

2. **Variasi Gambar**
   - Gambar 1: Tampak depan
   - Gambar 2: Tampak samping
   - Gambar 3: Tampak atas
   - Gambar 4: Detail close-up
   - Gambar 5: Packaging/box

3. **Kualitas Gambar**
   - Gunakan resolusi minimal 600x600px
   - Format: JPG atau PNG
   - Background putih/bersih lebih baik

## Troubleshooting

**Q: Gambar tidak muncul?**
A: Coba reset localStorage dengan `resetLocalStorage()` di console

**Q: Tidak bisa upload lebih dari 5?**
A: Ini adalah batasan sistem. Hapus gambar yang tidak diperlukan terlebih dahulu.

**Q: Urutan gambar salah?**
A: Saat ini urutan berdasarkan upload. Untuk mengubah thumbnail, hapus semua dan upload ulang dengan urutan yang benar.

---

Dibuat: Desember 2024




