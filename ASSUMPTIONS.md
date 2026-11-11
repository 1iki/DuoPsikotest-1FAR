# ASSUMPTIONS.md — Dokumentasi Asumsi & Keputusan Teknis

Dokumen ini mencatat asumsi yang diambil selama pengembangan platform psikotes online (Tes Kraepelin & Tes Pauli).

---

## 1. Mekanik dan Alur Tes
- **Arah Penjumlahan Vertikal**: Dua angka berdampingan (atas dan bawah) dijumlahkan secara berurutan dari pasangan pertama (paling atas / indeks 0 dan 1) ke pasangan berikutnya ke bawah. Jawaban adalah angka satuan `(atas + bawah) % 10`.
- **Tidak Ada Edit Jawaban**: Begitu tombol keypad angka (0-9) ditekan, jawaban langsung tercatat dan kursor otomatis melompat ke pasangan angka berikutnya. Tombol backspace/hapus sengaja tidak disediakan sesuai kaidah baku tes Kraepelin dan Pauli.
- **Transisi Antar Lajur**: Transisi antar lajur dibuat selama 1000ms (1 detik) dengan overlay animasi singkat dan pesan "Lajur X/40 Bersiap...", memberikan jeda orientasi mata tanpa mengurangi keabsahan waktu tes.
- **Autosave dan Ketahanan Jaringan**: Sesi menyimpan hasil tiap lajur ke tabel `column_results` segera setelah waktu lajur berakhir. Jika halaman ter-refresh atau koneksi terputus, pemanggilan `getSessionForResume` akan memuat lajur terakhir yang belum dikerjakan sehingga peserta melanjutkan dari awal lajur berikutnya.
- **Batas Sesi Ditinggalkan (Abandoned)**: Sesi yang tidak diselesaikan dalam waktu 30 menit sejak `started_at` otomatis ditandai `abandoned` dan tidak dapat dilanjutkan kembali.

## 2. Keamanan dan Integritas Skor
- **Kunci Jawaban di Server**: Kunci jawaban (answer key) TIDAK PERNAH dikirim ke client. Client hanya menerima deretan angka kolom (yang digenerate secara deterministik dari `seed`). Saat client mengirimkan jawaban per lajur (`answers: number[]`), server mencocokkan jawaban dengan kunci yang dihitung ulang dari seed dan menghitung `correct`, `wrong`, dan `skipped`.
- **RNG Deterministik**: Menggunakan algoritma Mulberry32 (32-bit PRNG) berbasis integer seed. Sub-seed tiap lajur dihitung secara deterministik dari `seed * 1000 + columnIndex`.
- **Rate Limiting**:
  - Login: maksimal 5 percobaan per menit per email.
  - Registrasi: maksimal 3 pendaftaran per menit per email.
  - Pembuatan sesi tes: maksimal 10 sesi per menit per pengguna.
  - Pengiriman jawaban per lajur: maksimal 60 pengiriman per menit per pengguna.

## 3. Norma dan Kategorisasi Metrik
- Sesuai instruksi, ambang batas norma di `src/config/norms.ts` ditandai dengan komentar jelas `// TODO: ganti dengan norma resmi dari referensi psikologi`.
- Klasifikasi 5 level performa:
  - *Sangat Rendah*
  - *Rendah*
  - *Sedang*
  - *Tinggi*
  - *Sangat Tinggi*
- Arah interpretasi metrik:
  - **Kecepatan (Panker)**: Makin tinggi makin baik (*higher is better*).
  - **Ketelitian (Tianker)**: Mengukur % kesalahan dan total salah/terlewat; makin rendah persentasenya makin baik (*lower is better*).
  - **Keajegan (Janker)**: Mengukur selisih nilai tertinggi & terendah (range) serta standar deviasi; makin kecil variasi makin stabil/baik (*lower is better*).
  - **Ketahanan (Hanker)**: Mengukur selisih separuh akhir dikurangi separuh awal ditambah slope regresi linear; nilai positif menunjukkan performa bertahan atau meningkat (*higher is better*).
- **Disclaimer Hukum / Etika**: Dicantumkan di halaman hasil dan profil: *"Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi."*

## 4. Database & Row Level Security (RLS)
- Autentikasi memanfaatkan Supabase Auth (email + password).
- Seluruh tabel (`profiles`, `test_sessions`, `column_results`, `test_analyses`) diproteksi RLS murni:
  - `profiles`: hanya pemilik (`auth.uid() = id`) yang dapat membaca dan memperbarui datanya.
  - `test_sessions`: hanya pemilik (`auth.uid() = user_id`) yang dapat membuat, membaca, dan memperbarui sesinya.
  - `column_results` dan `test_analyses`: hanya pengguna yang memiliki sesi bersangkutan yang diizinkan melakukan select atau insert melalui relasi ke `test_sessions.user_id = auth.uid()`.
- Pengguna yang belum login otomatis dicegat oleh Next.js middleware saat mencoba mengakses `/tests` atau `/profile`, dan diarahkan ke `/login?redirectTo=...`.

## 5. UI/UX Mobile-First
- Dirancang khusus untuk viewport seluler (lebar dasar 360px) dengan keypad virtual 56px bertarget sentuh besar.
- Mencegah gestur zoom dan double-tap pada layar tes (`touch-action: manipulation`, non-scalable viewport meta, dan listener multi-touch).
- Menggunakan Screen Wake Lock API untuk menjaga layar ponsel tetap menyala selama tes berlangsung.
- Deteksi orientasi layar horizontal (landscape) dengan pesan peringatan otomatis untuk memutar perangkat ke posisi tegak (portrait).

