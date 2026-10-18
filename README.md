# MoneyMap

Aplikasi web untuk mencatat keuangan pribadi sekaligus merencanakan budget pernikahan. Awalnya saya bikin karena capek ngatur pengeluaran harian di satu tempat, tabungan di tempat lain, dan rincian biaya nikah di spreadsheet terpisah. Di MoneyMap semuanya jadi satu, dan budget wedding langsung terhubung ke tabungan "Nikah".

Aplikasi ini dibuat untuk satu pengguna (personal), jadi login cukup pakai password tanpa username.

![Dashboard](docs/screenshots/dashboard.png)

## Fitur

**Dashboard**
- Ringkasan bulan berjalan: sisa saldo, total pemasukan, total pengeluaran, dan progress semua tabungan
- Grafik pemasukan, pengeluaran, dan tabungan selama 12 bulan terakhir
- Breakdown pengeluaran per kategori
- "Cek Cepat" untuk catatan tagihan yang harus dibayar (bisa dicentang kalau sudah lunas)
- Insight otomatis, misalnya kategori yang naik/turun dibanding bulan lalu dan persentase uang yang berhasil disisihkan

**Transaksi**
- Tambah pemasukan atau pengeluaran beserta tanggal, kategori, metode bayar (cash, e-wallet, transfer, kartu), dan catatan
- Kalender heatmap pengeluaran, jadi kelihatan hari mana yang paling boros
- Filter berdasarkan kata kunci, tipe, kategori, dan rentang tanggal
- Edit dan hapus transaksi

**Tabungan & Goal**
- Buat goal tabungan dengan target nominal dan target tanggal
- Auto-split: setiap pemasukan yang dicatat otomatis disisihkan sekian persen ke goal tertentu
- Estimasi kapan goal tercapai berdasarkan riwayat setoran
- Simulasi nabung: masukkan nominal per bulan, nanti muncul perkiraan berapa bulan lagi goal tercapai

**Wedding Budget Planner**
- Rincian budget per kategori (venue, katering, dekorasi, dll) dengan kolom estimasi, biaya aktual, sudah dibayar (DP), sisa, dan jatuh tempo
- Data vendor per item
- Perbandingan total kebutuhan dengan saldo tabungan "Nikah"
- Daftar seserahan lengkap dengan harga, link/tempat beli, dan status sudah dibeli atau belum
- Import dan export ke Excel

**Laporan**
- Grafik tren 12 bulan dan distribusi kategori pengeluaran
- Export laporan ke CSV atau Excel

**Pengaturan**
- Mode gelap / terang
- Ganti password
- Kelola kategori (nama, ikon, warna)
- Backup seluruh data ke file JSON dan restore dari file tersebut

Tampilannya juga sudah responsif, di HP navigasinya pindah ke bawah layar.

## Screenshot

> Semua angka di screenshot ini data contoh, bukan data asli.

| Login | Tambah Transaksi |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Tambah transaksi](docs/screenshots/tambah-transaksi.png) |

**Transaksi**

![Transaksi](docs/screenshots/transaksi.png)

**Tabungan & Goal**

![Tabungan](docs/screenshots/tabungan.png)

**Wedding Budget Planner**

![Wedding](docs/screenshots/wedding.png)

**Laporan**

![Laporan](docs/screenshots/laporan.png)

**Pengaturan**

![Pengaturan](docs/screenshots/pengaturan.png)

| Mode Terang | Tampilan Mobile |
|---|---|
| ![Mode terang](docs/screenshots/dashboard-light.png) | <img src="docs/screenshots/mobile-dashboard.png" width="280" alt="Mobile"> |

## Tech Stack

- [Next.js 13](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) dengan database PostgreSQL (saya pakai [Neon](https://neon.tech/))
- [NextAuth](https://next-auth.js.org/) untuk login berbasis password, di-hash pakai bcrypt
- Tailwind CSS + komponen Radix UI
- TanStack Query untuk fetching data di sisi client
- Recharts untuk grafik
- Framer Motion untuk animasi
- ExcelJS dan SheetJS (xlsx) untuk import/export Excel

## Menjalankan di Lokal

Yang perlu disiapkan:
- Node.js 18 atau lebih baru
- Database PostgreSQL (lokal atau hosted seperti Neon / Supabase)

**1. Clone dan install dependency**

```bash
git clone https://github.com/ucuf-cyber/MoneyMap.git
cd MoneyMap
npm install
```

`npm install` juga otomatis menjalankan `prisma generate`.

**2. Buat file `.env`** di root project:

```env
DATABASE_URL="postgresql://user:password@host:5432/moneymap"
DIRECT_URL="postgresql://user:password@host:5432/moneymap"

NEXTAUTH_SECRET="isi-dengan-string-acak"
NEXTAUTH_URL="http://localhost:3000"
```

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string database. Kalau pakai Neon, isi dengan URL yang *pooled* |
| `DIRECT_URL` | Connection string tanpa pooling, dipakai Prisma waktu migrasi. Kalau database lokal, samakan saja dengan `DATABASE_URL` |
| `NEXTAUTH_SECRET` | String acak untuk enkripsi session. Bisa dibuat dengan `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL aplikasi |

**3. Jalankan migrasi dan isi data awal**

```bash
npx prisma migrate deploy
npm run db:seed
```

Seed akan membuat kategori default (Makan, Transport, Gaji, dll), tiga goal tabungan (Dana Darurat, Liburan, Nikah), dan template kategori budget wedding.

**4. Jalankan aplikasinya**

```bash
npm run dev
```

Buka `http://localhost:3000`. Saat pertama kali dibuka, kamu akan diminta membuat password (minimal 6 karakter). Setelah itu halaman login cuma minta password tersebut.

## Format Import Excel (Wedding)

File Excel untuk import budget wedding dibaca dari sheet pertama, dengan header kolom seperti ini:

| Kategori | Vendor | Estimasi Budget | Budget Aktual | Sudah Dibayar (DP) | Jatuh Tempo | Catatan |
|---|---|---|---|---|---|---|
| Venue | Gedung Melati | 35000000 | 38000000 | 15000000 | 2027-01-01 | Kapasitas 400 tamu |

Baris dengan kategori `TOTAL` akan dilewati. Vendor yang belum ada akan dibuat otomatis. Cara paling gampang: export dulu dari aplikasi, edit filenya, lalu import lagi.

## Backup & Restore

Di halaman Pengaturan ada tombol untuk mengunduh semua data dalam format JSON. File itu bisa di-restore kapan saja.

Perlu diingat, restore akan **menghapus semua data yang ada sekarang** lalu menggantinya dengan isi file backup, termasuk password. Jadi pastikan file yang dipakai memang yang benar.

## Struktur Folder

```
prisma/
  schema.prisma        skema database
  seed.ts              data awal
src/
  app/
    (app)/             halaman utama: dashboard, transaksi, tabungan, wedding, laporan, pengaturan
    api/               route API (CRUD, laporan, import/export, auth)
    login/             halaman login & setup password
  components/          komponen UI, dikelompokkan per halaman
  hooks/               custom hook (query & mutation data)
  lib/                 prisma client, konfigurasi auth, helper
  middleware.ts        proteksi semua halaman kecuali login
```

## Deploy

Saya deploy di Vercel dengan database Neon. Script `build` sudah menjalankan `prisma migrate deploy` sebelum `next build`, jadi migrasi otomatis jalan setiap deploy. Cukup isi environment variable yang sama seperti di atas pada pengaturan project Vercel, dan ganti `NEXTAUTH_URL` dengan domain production.

Seed tidak ikut jalan saat deploy, jadi jalankan `npm run db:seed` sekali dari lokal dengan `DATABASE_URL` mengarah ke database production.

## Lisensi

[MIT](LICENSE)
