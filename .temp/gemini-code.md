# 📋 WEBSITE PLANNING DOCUMENT

## 1. Project Overview
- **Nama project:** rey-wallet
- **Jenis website:** Web App / Personal Finance Tracker
- **Tujuan utama:** Mencatat pengeluaran dan pemasukan harian dengan mudah.
- **Target audience:** Penggunaan pribadi (Single user).
- **Platform Fokus:** Mobile-first (Dioptimalkan untuk layar HP).

## 2. Sitemap
Peta halaman aplikasi:
├── Dashboard (Home - Ringkasan Saldo & Transaksi Terakhir)
├── Transaksi
│   ├── Tambah Pemasukan
│   └── Tambah Pengeluaran
├── Kategori (Kelola daftar kategori)
└── Pengaturan (Profile & Tampilan)

## 3. Fitur & Fungsionalitas
| Fitur | Prioritas | Deskripsi | Kompleksitas |
|-------|-----------|-----------|-------------|
| Input Transaksi | Tinggi (MVP) | Form untuk memasukkan nominal, tanggal, kategori, dan catatan. | Rendah |
| Dashboard Saldo | Tinggi (MVP) | Menampilkan total pemasukan, pengeluaran, dan sisa saldo bulan ini. | Rendah |
| Kategori Standar | Tinggi (MVP) | Kategori bawaan (Gaji, Makan, Transport, dll). | Rendah |
| Riwayat Transaksi | Tinggi (MVP) | List/Daftar transaksi yang sudah diinput. | Rendah |
| Grafik Pengeluaran | Menengah | Chart visual (Pie/Bar chart) untuk melihat porsi pengeluaran. | Menengah |
| Export Data (Excel) | Rendah | Fitur unduh laporan keuangan ke format CSV/Excel. | Menengah |

## 4. Tech Stack Recommendation
Mengingat budget Rp 0 (Gratis) dan fokus pada kemudahan maintenance:
- **Framework:** Next.js (React) — Sangat cepat, modern, dan bagus untuk web app.
- **Styling:** Tailwind CSS — Memudahkan pembuatan desain yang clean dan minimalis.
- **Database & Auth:** Supabase — Gratis, aman, dan mudah diintegrasikan.
- **Hosting:** Vercel — Gratis seumur hidup untuk project personal, sangat mulus dipadukan dengan Next.js.
- **Domain:** `rey-wallet.vercel.app` (Bawaan Vercel).

## 5. Visual Direction
- **Color palette:** Biru sebagai warna utama (Primary: #2563EB atau #3B82F6), dipadukan dengan putih/abu-abu terang untuk background agar *clean*.
- **Font recommendation:** Inter atau Poppins (Google Fonts) — Sangat rapi dan angka mudah dibaca.
- **Mood/style keywords:** Clean, Minimalis, Modern, Mobile-friendly.
- **Referensi visual:** Logo icon "Uang" (Money/Wallet) sederhana tanpa teks rumit.

## 6. Timeline & Milestones
| Fase | Durasi | Deliverable |
|------|--------|-------------|
| 1. Setup & UI | 1-2 Hari | Tampilan halaman Dashboard dan Form Input (Dummy data). |
| 2. Database | 1 Hari | Set up Supabase dan tabel untuk Kategori & Transaksi. |
| 3. Integrasi | 2 Hari | Menghubungkan UI dengan Database agar fungsi catat berjalan. |
| 4. Deployment | 1 Hari | Rilis ke Vercel agar bisa diakses lewat HP (Live). |

## 7. Content Checklist
Karena ini aplikasi internal, konten sangat minim:
- [x] Nama kategori standar (sudah disiapkan oleh sistem nantinya)
- [x] Icon logo (Cari icon wallet simple format SVG)
```eof

```markdown:SRS.md
# Software Requirements Specification (SRS)
## Project: rey-wallet

### 1. Tujuan
Membuat aplikasi pencatat keuangan pribadi berbasis web yang dioptimalkan untuk mobile browser, memungkinkan pengguna melacak arus kas harian dengan cepat dan gratis.

### 2. Kebutuhan Fungsional
1. **Autentikasi (Opsional untuk MVP):** Sistem login sederhana menggunakan email/password untuk melindungi data pribadi pengguna.
2. **Manajemen Transaksi:**
   - Pengguna dapat menambah pemasukan/pengeluaran baru.
   - Field wajib: Nominal, Tipe (In/Out), Kategori, Tanggal.
   - Field opsional: Catatan/Deskripsi.
   - Pengguna dapat menghapus transaksi yang salah input.
3. **Manajemen Kategori:**
   - Sistem menyediakan kategori bawaan.
   - Pengguna dapat menambah/mengedit/menghapus kategori kustom.
4. **Dashboard & Laporan:**
   - Menampilkan Saldo Saat Ini.
   - Menampilkan Ringkasan Pemasukan dan Pengeluaran bulan berjalan.
   - Menampilkan 5 transaksi terakhir.

### 3. Kebutuhan Non-Fungsional
1. **Aksesibilitas:** UI harus responsif (Mobile First Design) dan bekerja dengan baik di Chrome/Safari HP.
2. **Performa:** Waktu muat (load time) di bawah 3 detik.
3. **Biaya:** Operasional server dan database 100% menggunakan free-tier (Supabase & Vercel).
```eof

```markdown:ERD.md
# Entity Relationship Diagram (ERD)
## Database: rey-wallet

Struktur tabel database sederhana menggunakan Supabase (PostgreSQL).

### Table: `users` (Bawaan Supabase Auth)
- `id` (UUID, Primary Key)
- `email` (String)

### Table: `categories`
Menyimpan daftar kategori pemasukan & pengeluaran.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke users.id) - *Agar data tidak tertukar jika ada user lain*
- `name` (String) - Contoh: "Makan", "Gaji"
- `type` (Enum: 'income', 'expense')
- `icon` (String) - Nama icon
- `created_at` (Timestamp)

### Table: `transactions`
Menyimpan riwayat arus kas.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke users.id)
- `category_id` (UUID, Foreign Key ke categories.id)
- `amount` (Decimal/Integer) - Jumlah uang
- `type` (Enum: 'income', 'expense')
- `date` (Date) - Tanggal transaksi
- `notes` (Text, Nullable) - Catatan tambahan
- `created_at` (Timestamp)

**Relasi:**
- `users` 1-to-Many `categories`
- `users` 1-to-Many `transactions`
- `categories` 1-to-Many `transactions`
```eof

```markdown:MODULES.md
# Arsitektur Modul
## Project: rey-wallet

Sistem ini dibagi menjadi beberapa modul utama untuk kemudahan manajemen kode:

### 1. UI Components Module (Frontend)
- **Layout:** Header, Bottom Navigation Bar (khas aplikasi mobile).
- **Cards:** Transaction Card, Balance Card.
- **Forms:** Input Transaction Form (dengan numeric keypad helper), Category Form.

### 2. State & Data Module
- Menggunakan React Hooks atau Zustand untuk menyimpan state aplikasi sementara (seperti filter bulan yang sedang dilihat).

### 3. Database & Auth Service
- Modul koneksi ke Supabase.
- CRUD helper untuk Transaksi (Create, Read, Update, Delete).
- CRUD helper untuk Kategori.

### 4. Utilities
- Currency Formatter (Format angka ke format Rupiah: "Rp 100.000").
- Date Formatter (Format tanggal ke format mudah dibaca: "24 Jun 2026").
```eof

```markdown:TASKS.md
# Task List & Development Phases

## Phase 1: Setup & Initialization
- [ ] Buat repository Github baru (`rey-wallet`).
- [ ] Inisialisasi project Next.js dengan Tailwind CSS.
- [ ] Konfigurasi font (Inter) dan warna tema utama (Blue).
- [ ] Buat project baru di Supabase.
- [ ] Ambil URL & API Key Supabase, masukkan ke `.env.local`.

## Phase 2: Database Schema
- [ ] Buat tabel `categories` di Supabase.
- [ ] Buat tabel `transactions` di Supabase.
- [ ] Insert dummy data untuk kategori standar (Makan, Gaji, Transport).

## Phase 3: UI Development (MVP)
- [ ] Buat layout dasar dengan Bottom Navigation.
- [ ] Buat halaman Dashboard (UI Saldo & Recent Transactions).
- [ ] Buat form Input Transaksi (UI).
- [ ] Buat halaman Riwayat Transaksi (UI).

## Phase 4: Integration
- [ ] Hubungkan form Input Transaksi ke database Supabase (Insert data).
- [ ] Tarik data transaksi dari Supabase untuk ditampilkan di Dashboard & Riwayat (Read data).
- [ ] Buat fungsi hitung total Pemasukan, Pengeluaran, dan Saldo berdasarkan data.

## Phase 5: Deployment
- [ ] Hubungkan repository Github ke Vercel.
- [ ] Setting Environment Variables (Supabase Keys) di Vercel.
- [ ] Deploy aplikasi ke `rey-wallet.vercel.app`.
- [ ] Testing langsung di HP pengguna.
```eof

Dokumen pendukung lainnya (seperti `DSD`, `PERMISSION`, `MIGRATION`, `CREDENTIAL`, `AGENT`) saya skip atau rangkum di atas karena aplikasi pencatat keuangan mandiri ini strukturnya sangat fokus dan tidak memerlukan permission rumit (karena hanya digunakan oleh satu orang), tidak butuh migrasi database lama, serta credential harus diatur langsung di sisi server demi keamanan.
