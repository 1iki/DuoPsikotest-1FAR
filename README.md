# Psikotes Online — Platform Uji Tes Kraepelin & Tes Pauli

Platform latihan uji psikotes online **mobile-first** berstandar modern yang mencakup **Tes Kraepelin** dan **Tes Pauli**. Dilengkapi sistem penilaian dan analisis otomatis (kecepatan, ketelitian, keajegan, ketahanan, serta grafik kurva kerja) dengan antarmuka berbahasa Indonesia yang dirancang responsif mulai dari resolusi 360px.

---

## 🚀 Fitur Utama

- **Mobile-First & Touch-Optimized**: Desain dasar 360px dengan tombol angka virtual kustom (min 56px) berperekat di bawah layar (*sticky bottom keypad*), mendukung dark mode, cegah zoom/double-tap, dan Screen Wake Lock API agar layar tidak mati saat tes.
- **Dua Pilihan Tes Terkonfigurasi (`src/config/tests.ts`)**:
  - **Tes Kraepelin**: 40 lajur × 30 detik per lajur (50 angka per lajur).
  - **Tes Pauli**: 40 lajur × 60 detik per lajur (60 angka per lajur).
- **Integritas Penilaian Server-Side**: Angka dihasilkan secara deterministik dari `seed` di server (Mulberry32 PRNG). Kunci jawaban tidak pernah dikirim ke client; server menghitung ulang kunci dari seed sehingga skor tidak dapat dimanipulasi.
- **Sesi Latihan (Practice Mode)**: Sesi 1 lajur tanpa penilaian sebelum tes sungguhan untuk membiasakan ritme pengerjaan.
- **Autosave & Resume**: Jawaban tersimpan otomatis per lajur. Jika halaman terputus atau ter-refresh, peserta dapat melanjutkan dari lajur berikutnya. Sesi lebih dari 30 menit otomatis ditandai *abandoned*.
- **Analisis & Metrik Psikotes Lengkap**:
  - **Kecepatan (Panker)**: Rata-rata jawaban per lajur.
  - **Ketelitian (Tianker)**: Total kesalahan (salah & terlewat) serta % kesalahan.
  - **Keajegan (Janker)**: Range (selisih max - min) dan Standar Deviasi.
  - **Ketahanan (Hanker)**: Selisih rata-rata paruh akhir vs paruh awal & slope regresi linier.
  - **Kurva Kerja (Work Curve)**: Grafik garis dinamis per lajur menggunakan Recharts.
  - **Kategorisasi 5 Tingkat**: Sangat Rendah, Rendah, Sedang, Tinggi, Sangat Tinggi berdasarkan ambang batas norma (`src/config/norms.ts`).
  - **Ringkasan Naratif Otomatis**: 3-5 kalimat interpretasi dalam Bahasa Indonesia (`src/config/interpretations.ts`).
- **Keamanan & RLS**: Supabase Authentication, PostgreSQL dengan Row Level Security (RLS) ketat antar pengguna, validasi Zod di setiap endpoint, dan sliding-window rate limiting.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + TypeScript Strict Mode
- **Styling**: Tailwind CSS
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Auth Email/Password)
- **Validasi**: [Zod](https://zod.dev/)
- **Visualisasi Grafik**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Target Deployment**: Vercel + Supabase

---

## 📂 Struktur Proyek

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Halaman Masuk
│   │   └── register/page.tsx            # Halaman Pendaftaran
│   ├── (protected)/
│   │   ├── layout.tsx                   # Navigasi & autentikasi
│   │   ├── tests/
│   │   │   ├── page.tsx                 # Dashboard pilihan tes
│   │   │   └── [type]/
│   │   │       ├── instructions/page.tsx # Petunjuk pengerjaan
│   │   │       ├── practice/page.tsx     # Sesi latihan (1 lajur)
│   │   │       ├── run/[sessionId]/page.tsx # Layar pengerjaan tes
│   │   │       └── result/[sessionId]/page.tsx # Hasil langsung tes
│   │   └── profile/
│   │       ├── page.tsx                 # Tab Kraepelin & Pauli + Tren
│   │       └── [sessionId]/page.tsx     # Rincian sesi & tabel per lajur
│   ├── layout.tsx                       # Root layout (Viewport & font)
│   └── page.tsx                         # Landing page
├── components/
│   ├── profile/
│   │   ├── MetricCard.tsx               # Kartu metrik dengan badge warna
│   │   ├── NarrativeSummary.tsx         # Narasi interpretasi
│   │   └── WorkCurveChart.tsx           # Grafik kurva kerja Recharts
│   └── test/
│       ├── Keypad.tsx                   # Keypad sentuh 0-9 sticky (min 56px)
│       ├── NumberColumn.tsx             # Tampilan lajur angka berpasangan
│       ├── TestEngine.tsx               # State engine & transisi antar lajur
│       └── Timer.tsx                    # Timer lingkaran per lajur
├── config/
│   ├── tests.ts                         # Konfigurasi lajur, durasi, angka
│   ├── norms.ts                         # Ambang batas norma 5 tingkat (placeholder)
│   └── interpretations.ts               # Teks interpretasi naratif Bahasa Indonesia
├── lib/
│   ├── actions/
│   │   ├── auth.ts                      # Server action masuk, daftar, keluar
│   │   └── session.ts                   # Server action sesi & penilaian server
│   ├── scoring/
│   │   ├── seed.ts                      # Mulberry32 PRNG & generator deretan
│   │   ├── checker.ts                   # Validasi jawaban & answer key generator
│   │   ├── metrics.ts                   # Kalkulasi Panker, Tianker, Janker, Hanker
│   │   └── categorize.ts                # Pemetaan metrik ke level kategori
│   ├── security/
│   │   └── ratelimit.ts                 # Rate limiter sliding window in-memory
│   ├── supabase/
│   │   ├── client.ts                    # Supabase browser client (@supabase/ssr)
│   │   ├── server.ts                    # Supabase server client (@supabase/ssr)
│   │   └── middleware.ts                # Middleware penyegaran session auth
│   └── validators/
│       └── schemas.ts                   # Skema validasi Zod
└── types/
    └── index.ts                         # Definisi tipe TypeScript
supabase/
├── migrations/
│   └── 00001_create_tables.sql          # Skema database & konfigurasi RLS
└── seed.sql                             # Contoh seed data demo
```

---

## ⚡ Panduan Setup Lokal

### 1. Prasyarat
- [Node.js](https://nodejs.org/) v18.18+ atau v20+
- Akun proyek di [Supabase](https://supabase.com/) (gratis)

### 2. Kloning & Instalasi Dependensi
```bash
cd psikotes2
npm install
```

### 3. Konfigurasi Database Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru.
2. Buka tab **SQL Editor**.
3. Jalankan seluruh isi file migrasi:
   `supabase/migrations/00001_create_tables.sql`
   *(Migrasi ini membuat tabel `profiles`, `test_sessions`, `column_results`, `test_analyses`, trigger otomatis pembuatan profil user baru, serta aturan Row Level Security).*
4. (Opsional) Sesuaikan pengaturan Email Auth di Supabase Dashboard:
   - Masuk ke **Authentication** > **Providers** > **Email**.
   - Untuk pengembangan lokal tanpa verifikasi email, nonaktifkan opsi *Confirm email*.

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi nilai variabel dengan kredensial dari Supabase (**Project Settings** > **API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 5. Menjalankan Aplikasi
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🧪 Menjalankan Pengujian (Testing)

Proyek dilengkapi pengujian unit menggunakan **Vitest** untuk memverifikasi logika penilaian, determinisme generator deretan angka, kalkulasi metrik, penanganan kasus tepi, serta penegakan kebijakan keamanan RLS:

```bash
# Jalankan seluruh unit test
npm run test

# Jalankan linter ESLint
npm run lint

# Jalankan typecheck TypeScript
npx tsc --noEmit
```

### Kasus Uji yang Dicakup:
- **Seed & PRNG**: Deterministik pada seed yang sama, acak pada seed berbeda, dan rentang digit 0-9.
- **Answer Checker**: Evaluasi satuan modulo `(a + b) % 10`, perlakuan jawaban benar, salah, dan terlewat (*skipped*).
- **Scoring Metrics**:
  - Sesi kosong (0 lajur).
  - Semua jawaban benar (0 error rate).
  - Semua jawaban salah (100% error rate).
  - Jumlah lajur ganjil (e.g. 5 lajur) dengan pembagian paruh yang tepat.
  - Regresi linier kurva kerja (slope positif, negatif, dan datar).
- **Norma & Narasi**: Pemetaan kategori dan pembuatan ringkasan naratif 3-5 kalimat disertai disclaimer resmi.
- **Row Level Security (RLS)**: Verifikasi isolasi antar akun pengguna dan pencegahan akses/injeksi lintas sesi.

---

## 🌐 Panduan Deployment

### Deploy ke Vercel:
1. Hubungkan repositori GitHub proyek ke [Vercel](https://vercel.com).
2. Tambahkan Environment Variables di dashboard Vercel (**Settings** > **Environment Variables**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Klik **Deploy**. Vercel akan otomatis menjalankan `next build` dan mendistribusikan aplikasi secara global di edge network.

---

## ⚖️ Penafian (Disclaimer)
Hasil uji tes pada platform ini bersifat latihan dan gambaran awal performa kecepatan, ketelitian, keajegan, serta ketahanan kerja, bukan merupakan diagnosis atau asesmen psikologis resmi.
