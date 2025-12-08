# Toko LIA Management System

Sistem Manajemen Toko Bahan Kue Terintegrasi. Aplikasi ini dirancang untuk membantu operasional Toko LIA mencakup manajemen inventaris, kasir (POS), manajemen supplier, dan pelaporan keuangan.

## Fitur Utama

- **Dashboard Interaktif**: Ringkasan performa toko real-time.
- **Manajemen Inventaris**:
  - Data Produk & Kategori
  - Stok Opname & Validasi Stok
  - Restock Barang (Pembelian)
- **Point of Sales (POS)**:
  - Kasir modern dengan dukungan barcode scanner (via search)
  - Support multi-payment (Tunai, Transfer, QRIS)
  - Struk digital & manajemen keranjang
  - **Mobile Responsive**: Layout khusus untuk akses via HP/Tablet
- **Manajemen Mitra**:
  - Database Supplier lengkap
  - Multi-kontak (telepon) per supplier
- **Laporan**:
  - Riwayat Transaksi
  - Laporan Keuangan Harian/Bulanan

## Teknologi

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Deployment**: Vercel

## Cara Menjalankan (Development)

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/toko-lia.git
    cd toko-lia
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` dan isi dengan konfigurasi berikut:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
    CLERK_SECRET_KEY=your_clerk_secret
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

## Hak Akses (RBAC)

Sistem menggunakan Role-Based Access Control:
- **Owner**: Akses penuh ke semua fitur.
- **Kasir**: Akses terbatas ke POS dan Riwayat Transaksi.
- **Gudang**: Akses ke Inventaris dan Restock.

## Lisensi

Internal Use Only - Toko LIA.
git remote add origin https://github.com/vicusgod/toko-lia.git
git branch -M main
git push -u origin main