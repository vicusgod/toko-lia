# Project Requirement Document (PRD): Sistem Informasi Manajemen Toko LIA

## 1\. Project Overview

Membangun aplikasi web manajemen ritel terintegrasi untuk **Toko LIA** (toko bahan kue). [cite_start]Sistem ini bertujuan menggantikan pencatatan manual [cite: 19, 83] [cite_start]dengan sistem basis data digital untuk mengelola stok, transaksi penjualan (POS), pembelian (restock), dan laporan keuangan[cite: 100, 101].

## 2\. Tech Stack

  * **Framework:** Next.js 14+ (App Router).
  * **Language:** TypeScript.
  * **Styling:** Tailwind CSS.
  * **UI Components:** shadcn/ui (Radix UI based).
  * **Database:** Supabase (PostgreSQL).
  * **Auth:** Clerk (Reccomended for speed) atau Better Auth.
  * **State Management:** React Query (Tanstack Query) / Zustand (optional).

-----

## 3\. Database Schema (Supabase/PostgreSQL)

Berdasarkan dokumen Bab 7.3 (Physical Design), berikut adalah skema yang **harus** di-deploy ke Supabase Editor (SQL Editor).

### 3.1. [cite_start]Tables Definition [cite: 254-355]

Copy-paste script ini ke SQL Editor Supabase kamu:

```sql
-- 1. KategoriProduk
CREATE TABLE "KategoriProduk" (
    "idKategori" CHAR(5) PRIMARY KEY NOT NULL, -- Format: KTxxx
    "namaKategori" VARCHAR(100) NOT NULL
);

-- 2. Supplier
CREATE TABLE "Supplier" (
    "idSupplier" CHAR(5) PRIMARY KEY NOT NULL, -- Format: SPxxx
    "namaSupplier" VARCHAR(100) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL
);

-- 3. SupplierTelepon (Normalized as per Source)
CREATE TABLE "SupplierTelepon" (
    "idSupplier" CHAR(5) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    PRIMARY KEY ("idSupplier", "telephone"),
    FOREIGN KEY ("idSupplier") REFERENCES "Supplier"("idSupplier") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Produk
CREATE TABLE "Produk" (
    "idProduk" CHAR(5) PRIMARY KEY NOT NULL, -- Format: PRxxx
    "idKategori" CHAR(5) NOT NULL,
    "namaProduk" VARCHAR(100) NOT NULL,
    "merk" VARCHAR(50) NOT NULL,
    "stok" INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
    "hargaSatuan" DECIMAL(10,2) NOT NULL CHECK ("hargaSatuan" >= 0),
    FOREIGN KEY ("idKategori") REFERENCES "KategoriProduk"("idKategori") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Pembelian (Restock Header)
CREATE TABLE "Pembelian" (
    "idPembelian" CHAR(5) PRIMARY KEY NOT NULL, -- Format: PBxxx
    "idSupplier" CHAR(5) NOT NULL,
    "tanggalPembelian" DATE NOT NULL DEFAULT CURRENT_DATE,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY ("idSupplier") REFERENCES "Supplier"("idSupplier") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. DetailPembelian
CREATE TABLE "DetailPembelian" (
    "idPembelian" CHAR(5) NOT NULL,
    "idProduk" CHAR(5) NOT NULL,
    "jumlah" INT NOT NULL CHECK (jumlah > 0),
    "subtotal" DECIMAL(12,2) NOT NULL, -- Calculated automatically
    PRIMARY KEY ("idPembelian", "idProduk"),
    FOREIGN KEY ("idPembelian") REFERENCES "Pembelian"("idPembelian") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("idProduk") REFERENCES "Produk"("idProduk") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 7. TransaksiPenjualan (Sales Header)
CREATE TABLE "TransaksiPenjualan" (
    "idTransaksi" CHAR(5) PRIMARY KEY NOT NULL, -- Format: TRxxx
    "tanggalTransaksi" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

-- 8. DetailPenjualan
CREATE TABLE "DetailPenjualan" (
    "idTransaksi" CHAR(5) NOT NULL,
    "idProduk" CHAR(5) NOT NULL,
    "jumlah" INT NOT NULL CHECK (jumlah > 0),
    "subtotal" DECIMAL(12,2) NOT NULL,
    PRIMARY KEY ("idTransaksi", "idProduk"),
    FOREIGN KEY ("idTransaksi") REFERENCES "TransaksiPenjualan"("idTransaksi") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("idProduk") REFERENCES "Produk"("idProduk") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 9. Pembayaran
CREATE TABLE "Pembayaran" (
    "idPembayaran" CHAR(5) PRIMARY KEY NOT NULL, -- Format: PYxxx
    "idTransaksi" CHAR(5) NOT NULL,
    "metode" VARCHAR(20) NOT NULL CHECK (metode IN ('Tunai', 'Transfer', 'QRIS')),
    "status" VARCHAR(15) NOT NULL CHECK (status IN ('Lunas', 'Pending')),
    FOREIGN KEY ("idTransaksi") REFERENCES "TransaksiPenjualan"("idTransaksi") ON DELETE CASCADE ON UPDATE CASCADE
);
```

### 3.2. Database Triggers & Functions (Automation)

[cite_start]Sesuai dokumen, sistem membutuhkan kalkulasi otomatis untuk `subtotal` dan `total` serta update stok[cite: 361, 364].

  * **Logic:** Saat item masuk ke DetailPenjualan -\> Kurangi Stok Produk -\> Hitung Subtotal -\> Update Total Transaksi.
  * **Logic:** Saat item masuk ke DetailPembelian -\> Tambah Stok Produk -\> Hitung Subtotal -\> Update Total Pembelian.

*(Note untuk Developer: Implementasikan logic ini via Supabase Database Functions atau via API Endpoint logic di Next.js untuk kemudahan debugging).*

-----

## 4\. User Roles & Authentication

Menggunakan **Clerk** untuk manajemen user.

  * [cite_start]**Role 1: Owner (Super Admin)** [cite: 28, 55]
      * Akses: Full Access (Dashboard, Laporan Keuangan, Manajemen User, Edit Master Data).
  * [cite_start]**Role 2: Admin Kasir** [cite: 29]
      * Akses: Halaman Transaksi (POS), Input Penjualan.
  * [cite_start]**Role 3: Bagian Gudang/Pembelian** [cite: 30, 31]
      * Akses: Halaman Stok, Halaman Pembelian (Restock), Cek Supplier.

-----

## 5\. Feature Requirements (Pages & Components)

### 5.1. Dashboard (Home)

  * [cite_start]**Goal:** Ringkasan bisnis untuk Owner[cite: 114].
  * **Components:**
      * Card: Total Omzet Hari Ini.
      * Card: Total Transaksi Hari Ini.
      * Card: Stok Menipis (Low Stock Alert).
      * Chart: Grafik Penjualan 7 Hari Terakhir.

### 5.2. Master Data Management

  * **Halaman Produk:**
      * Tabel Produk (Search, Filter by Kategori).
      * [cite_start]CRUD Modal (Add/Edit Product) dengan validasi stok tidak boleh negatif[cite: 130].
      * Kolom: ID, Nama, Merk, Stok, Harga, Kategori.
  * **Halaman Supplier:**
      * [cite_start]List Supplier dan No Telepon[cite: 128].
      * CRUD Supplier.

### 5.3. Point of Sales (Kasir) - *Priority High*

  * [cite_start]**Goal:** Mencatat transaksi harian[cite: 50, 77].
  * **Flow:**
    1.  User (Kasir) mencari produk (Search bar).
    2.  Klik produk untuk masuk ke "Cart".
    3.  Sistem menghitung Subtotal & Total otomatis.
    4.  [cite_start]Checkout -\> Input Metode Pembayaran (Tunai/Transfer/QRIS)[cite: 130].
    5.  Submit -\> Create `TransaksiPenjualan`, `DetailPenjualan`, `Pembayaran` & **Kurangi Stok**.

### 5.4. Procurement (Pembelian/Restock)

  * [cite_start]**Goal:** Menambah stok barang dari supplier[cite: 39, 61].
  * **Flow:**
    1.  Pilih Supplier.
    2.  Pilih Produk yang akan dibeli.
    3.  Input jumlah qty.
    4.  Submit -\> Create `Pembelian`, `DetailPembelian` & **Tambah Stok**.

### 5.5. Reporting (Laporan)

  * [cite_start]**Halaman Laporan Penjualan:** Tabel riwayat transaksi filter by date range[cite: 113].
  * [cite_start]**Halaman Laporan Pembelian:** Riwayat belanja ke supplier[cite: 115].

-----

## 6\. Implementation Steps for Vibe Coding

Berikut adalah urutan prompt yang bisa kamu gunakan saat coding dengan AI:

**Phase 1: Setup & Database**

> "Setup a Next.js 14 project with Tailwind and Shadcn UI. Install Supabase client. I have provided the SQL schema for 'Toko LIA' in the context. Please initialize the project structure and create the Supabase types."

**Phase 2: Master Data CRUD**

> "Create a 'Products' page (`/dashboard/products`). Use a Shadcn Data Table to display products fetching from Supabase. Add a Dialog component to 'Add Product' that inserts data into the `Produk` table. Ensure the ID follows the format 'PRxxx' (e.g., generate the next ID automatically)."

**Phase 3: Transaction Logic (The Hardest Part)**

> "Create a POS (Point of Sale) page (`/dashboard/pos`). It should have two sections: Left side is a product grid/search, Right side is the Cart. When I click 'Checkout', create a server action that:
>
> 1.  Creates a record in `TransaksiPenjualan`.
> 2.  Iterates cart items to create records in `DetailPenjualan`.
> 3.  Creates a record in `Pembayaran`.
> 4.  Updates the `stok` in `Produk` table.
>     Use a Supabase Transaction (RPC) to ensure data integrity."

**Phase 4: Reporting**

> "Create a 'Reports' page. Show a list of sales transactions. Clicking a transaction should expand/show a dialog with the details (items purchased) by querying the `DetailPenjualan` table."

-----

## 7\. Business Rules (Validation)

Pastikan validasi ini ada di form:

1.  [cite_start]**ID Generation:** ID harus manual atau auto-generated dengan prefix `PR`, `KT`, `SP`, `TR`, `PB`, `PY` + 3 digit angka[cite: 130].
2.  [cite_start]**Stok:** Tidak boleh input transaksi jika stok 0 atau kurang dari jumlah diminta[cite: 87, 367].
3.  **Hapus Data:**
      * [cite_start]Kategori tidak bisa dihapus jika ada produk di dalamnya[cite: 236].
      * [cite_start]Produk tidak bisa dihapus jika pernah ada transaksi (Gunakan *Soft Delete* atau field `isActive` jika perlu, walau di desain fisik menggunakan `RESTRICT`)[cite: 236].

-----

## 8\. UI Structure (Sidebar Navigation)

  * **Header:** Logo Toko LIA, User Profile (Clerk).
  * **Sidebar:**
      * Dashboard
      * Kasir (POS)
      * Inventory
          * Data Produk
          * Data Kategori
          * Restock Barang (Pembelian)
      * Mitra
          * Data Supplier
      * Laporan
          * Riwayat Transaksi
          * Laporan Keuangan
      * Settings