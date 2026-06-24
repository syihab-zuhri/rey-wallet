# Panduan Deploy rey-wallet ke Vercel (Lengkap dari Awal)

Karena Anda mendapatkan pesan error `NOT_FOUND` atau error gagal saat deploy, kita akan menggunakan cara paling aman dan terstruktur untuk menaikkan aplikasi Anda ke internet.

Ikuti panduan ini langkah demi langkah dengan perlahan.

---

## TAHAP 1: Membersihkan & Mempersiapkan Kode

Sebelum di-upload, kita pastikan kodenya sudah bersih dari error.

1. **Buka Terminal di VS Code** Anda (posisi di folder `D:\.project website\rey-money`).
2. Jalankan perintah ini untuk memastikan tidak ada error saat pembuatan aplikasi:
   ```bash
   npm run build
   ```
   *(Tunggu sampai selesai. Jika tulisannya "Compiled successfully", berarti aplikasi aman dan siap diunggah).*

---

## TAHAP 2: Mengunggah (Push) ke GitHub

Vercel mengambil kode dari GitHub. Jadi kita harus memasukkan kode kita ke sana dulu.

### Jika Anda **belum** membuat repository di GitHub:
1. Buka [github.com](https://github.com) dan login.
2. Klik tombol **New** (tanda tambah di kanan atas).
3. Isi `Repository name` dengan: **rey-wallet**
4. Pilih **Private** (agar kode tidak dilihat orang lain).
5. Klik **Create repository**.
6. Jangan tutup halamannya, biarkan terbuka.

### Masukkan Kode via Terminal:
Di terminal VS Code Anda, *copy-paste* dan jalankan perintah ini satu-persatu secara berurutan:

```bash
git add .
git commit -m "Siap deploy ke Vercel"
git branch -M main
```

Lalu, masukkan perintah untuk menghubungkan ke GitHub Anda. Ganti `USERNAME_GITHIUB_ANDA` dengan username Anda yang asli:
*(Contoh: jika username GitHub Anda `syihabzuhri`, maka jadinya `https://github.com/syihabzuhri/rey-wallet.git`)*

```bash
git remote add origin https://github.com/USERNAME_GITHIUB_ANDA/rey-wallet.git
git push -u origin main
```
*(Jika muncul popup login GitHub, silakan login/authorize).*

---

## TAHAP 3: Menyambungkan Vercel dengan GitHub

Sekarang kode sudah aman di GitHub. Waktunya menaikkan ke Vercel.

1. Buka [vercel.com](https://vercel.com) dan pastikan Anda login dengan opsi **Continue with GitHub**.
2. Di pojok kanan atas, klik tombol hitam **Add New...** lalu pilih **Project**.
3. Anda akan melihat daftar repository GitHub Anda. Cari `rey-wallet`, lalu klik tombol **Import** di sebelahnya.
4. Akan muncul halaman **Configure Project**. Biarkan *Project Name* tetap `rey-wallet` dan *Framework Preset* tetap `Next.js`.

---

## TAHAP 4: Memasukkan Environment Variables (SANGAT PENTING!)

Ini adalah **penyebab utama aplikasi error atau 404** jika dilewati. Aplikasi butuh tahu cara menghubungi database Supabase.

Masih di halaman Vercel *Configure Project* tadi, ikuti langkah ini:

1. Scroll sedikit ke bawah dan klik tulisan **Environment Variables** (agar menunya terbuka).
2. Di kolom **Name**, ketik: `NEXT_PUBLIC_SUPABASE_URL`
3. Di kolom **Value**, *copy-paste* link dari file `.env.local` Anda:
   `https://csbwgqlnzyxqtxjtsntu.supabase.co`
4. Klik tombol **Add**.

Lalu masukkan yang kedua:
5. Di kolom **Name** yang baru, ketik: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Di kolom **Value**, *copy-paste* key dari file `.env.local` Anda:
   `sb_publishable_qtydORBBUqhUpYQkrFSW4A_UxznQUZe`
7. Klik tombol **Add**.

Pastikan ada 2 kunci yang muncul di daftar bawahnya. Jika sudah, klik tombol biru **Deploy**.

---

## TAHAP 5: Mengubah URL Redirect di Supabase

Ini langkah terakhir agar saat Anda sukses login, Supabase tidak kebingungan melempar (redirect) Anda ke mana.

1. Setelah Vercel selesai *deploy*, klik tombol **Continue to Dashboard**.
2. Anda akan melihat alamat website Anda, misalnya `https://rey-wallet-alpha.vercel.app`. **Copy alamat tersebut.**
3. Sekarang, buka [Supabase](https://supabase.com) dan masuk ke project Anda.
4. Pergi ke menu ⚙️ **Project Settings** (ikon gerigi di kiri bawah), lalu pilih **Authentication**.
5. Cari bagian **URL Configuration**.
6. Pada kolom **Site URL**, ganti isinya dengan alamat Vercel Anda yang baru dicopy tadi.
   *(Contoh: `https://rey-wallet-alpha.vercel.app`)*
7. Pada bagian **Redirect URLs** (di bawahnya), klik *Add URL*, lalu masukkan:
   `https://rey-wallet-alpha.vercel.app/auth/callback` 
   *(Pastikan ada `/auth/callback` di ujungnya).*
8. Klik **Save**.

🎉 **Selesai!** Buka link Vercel Anda di HP atau browser. Aplikasi pencatat keuangan Anda sekarang sudah *live* dan bisa digunakan sepenuhnya!
