-- Indexes for optimizing the 12 identified business transactions

-- 1. Optimize T9: Mencari Produk berdasarkan Kategori
-- Helps quickly filter products by category
CREATE INDEX IF NOT EXISTS idx_produk_kategori ON "Produk" ("idKategori");

-- 2. Optimize T10: Melihat Riwayat Pembelian per Supplier
-- Helps quickly list purchases for a specific supplier
CREATE INDEX IF NOT EXISTS idx_pembelian_supplier ON "Pembelian" ("idSupplier");

-- 3. Optimize T8: Mengecek Status Pembayaran
-- Helps quickly find the payment record for a transaction
CREATE INDEX IF NOT EXISTS idx_pembayaran_transaksi ON "Pembayaran" ("idTransaksi");

-- 4. Optimize T11: Memperbarui Kontak (Telepon) Supplier
-- Helps quickly find phone numbers for a supplier (Composite PK usually handles this, but good for explicit lookups)
CREATE INDEX IF NOT EXISTS idx_supplier_telepon_supplier ON "SupplierTelepon" ("idSupplier");

-- 5. Optimize T1 & T7: Dashboard & Sales History (Date Filtering)
-- Helps filter transactions by date range
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON "TransaksiPenjualan" ("tanggalTransaksi");

-- 6. Optimize T1: Dashboard Low Stock Alert
-- Helps quickly find products with low stock
CREATE INDEX IF NOT EXISTS idx_produk_stok ON "Produk" ("stok") WHERE stok < 10;
