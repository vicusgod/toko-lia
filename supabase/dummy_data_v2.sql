-- Dummy Data v2 with Supplier Relations for Toko LIA
-- Includes TRUNCATE to clear existing data before insertion

-- 0. Clear existing data (Order matters due to foreign keys)
TRUNCATE TABLE "Pembayaran", "DetailPenjualan", "TransaksiPenjualan", "DetailPembelian", "Pembelian", "Produk", "SupplierTelepon", "Supplier", "KategoriProduk" CASCADE;

-- 1. Insert Categories (10 items)
INSERT INTO "KategoriProduk" ("idKategori", "namaKategori") VALUES
('KT001', 'Tepung & Pati'),
('KT002', 'Gula & Pemanis'),
('KT003', 'Coklat & Kakao'),
('KT004', 'Mentega & Margarin'),
('KT005', 'Keju & Dairy'),
('KT006', 'Bahan Pengembang'),
('KT007', 'Perisa & Pewarna'),
('KT008', 'Kacang & Biji-bijian'),
('KT009', 'Selai & Isian'),
('KT010', 'Kemasan & Alat');

-- 2. Insert Suppliers (10 items) & their Phones
INSERT INTO "Supplier" ("idSupplier", "namaSupplier", "alamat") VALUES
('SP001', 'PT Sinar Mas Agro', 'Jl. MH Thamrin No. 51, Jakarta Pusat'), -- Supplier Minyak, Margarin
('SP002', 'CV Bogasari Flour Mills', 'Jl. Raya Cilincing No. 1, Jakarta Utara'), -- Supplier Tepung
('SP003', 'Toko Bahan Kue Sejahtera', 'Jl. Gajah Mada No. 12, Jakarta Barat'), -- General Supplier
('SP004', 'PT Indofood Sukses Makmur', 'Sudirman Plaza, Indofood Tower, Jakarta'), -- General Supplier
('SP005', 'UD Sumber Rejeki', 'Pasar Tanah Abang Blok A, Jakarta Pusat'), -- Supplier Gula
('SP006', 'CV Aneka Rasa', 'Jl. Pahlawan Revolusi No. 99, Jakarta Timur'), -- Supplier Perisa
('SP007', 'PT Fonterra Brands Indonesia', 'Gd. Sovereign Plaza Lt. 20, Jakarta Selatan'), -- Supplier Dairy (Anchor)
('SP008', 'Toko Plastik & Kemasan Jaya', 'Jl. Mangga Dua Raya, Jakarta Pusat'), -- Supplier Kemasan
('SP009', 'CV Manis Legit', 'Jl. Kyai Tapa No. 100, Jakarta Barat'), -- Supplier Selai
('SP010', 'PT Diamond Cold Storage', 'Jl. Ancol Barat I No. 2, Jakarta Utara'); -- Supplier Coklat/Dairy

-- Insert Supplier Phones
INSERT INTO "SupplierTelepon" ("idSupplier", "telephone") VALUES
('SP001', '021-3925555'), ('SP001', '081234567890'),
('SP002', '021-4301234'),
('SP003', '081345678901'),
('SP004', '021-57958822'),
('SP005', '085678901234'),
('SP006', '021-8612345'),
('SP007', '021-29938888'),
('SP008', '081987654321'),
('SP009', '021-5678901'),
('SP010', '021-6901234');

-- 3. Insert Products with idSupplier (30 items)
-- Format: idProduk, idKategori, idSupplier, namaProduk, merk, stok, hargaSatuan
INSERT INTO "Produk" ("idProduk", "idKategori", "idSupplier", "namaProduk", "merk", "stok", "hargaSatuan") VALUES
-- Tepung (KT001) -> CV Bogasari Flour Mills (SP002)
('PR001', 'KT001', 'SP002', 'Tepung Terigu Protein Tinggi', 'Cakra Kembar', 100, 14000),
('PR002', 'KT001', 'SP002', 'Tepung Terigu Serbaguna', 'Segitiga Biru', 150, 12000),
-- Tepung -> Toko Bahan Kue Sejahtera (SP003)
('PR003', 'KT001', 'SP003', 'Tepung Maizena 500gr', 'Maizenaku', 50, 9500),
('PR004', 'KT001', 'SP003', 'Tepung Ketan Putih 500gr', 'Rose Brand', 60, 8000),

-- Gula (KT002) -> UD Sumber Rejeki (SP005)
('PR005', 'KT002', 'SP005', 'Gula Pasir Putih 1kg', 'Gulaku', 200, 16000),
('PR006', 'KT002', 'SP005', 'Gula Halus 500gr', 'Claris', 40, 11000),
('PR007', 'KT002', 'SP005', 'Brown Sugar 500gr', 'Ricoman', 30, 25000),

-- Coklat (KT003) -> PT Diamond Cold Storage (SP010)
('PR008', 'KT003', 'SP010', 'Coklat Blok Dark 1kg', 'Colatta', 25, 55000),
('PR009', 'KT003', 'SP010', 'Coklat Bubuk Kakao 500gr', 'Windmolen', 35, 45000),
('PR010', 'KT003', 'SP010', 'Choco Chips 250gr', 'Colatta', 50, 15000),
('PR011', 'KT003', 'SP010', 'Meses Coklat 500gr', 'Holland', 60, 22000),

-- Mentega (KT004) -> PT Sinar Mas Agro (SP001)
('PR012', 'KT004', 'SP001', 'Margarin Serbaguna 200gr', 'Blue Band', 100, 10000),
('PR013', 'KT004', 'SP007', 'Butter Salted 227gr', 'Anchor', 20, 45000), -- Fonterra
('PR014', 'KT004', 'SP003', 'Butter Unsalted 227gr', 'Elle & Vire', 20, 50000), -- Toko Sejahtera
('PR015', 'KT004', 'SP001', 'Shortening Putih 500gr', 'Menara', 40, 18000),

-- Keju (KT005) -> PT Diamond / Fonterra
('PR016', 'KT005', 'SP010', 'Keju Cheddar 165gr', 'Kraft', 80, 23000),
('PR017', 'KT005', 'SP010', 'Keju Mozzarella 250gr', 'Perfetto', 30, 35000),
('PR018', 'KT005', 'SP007', 'Cream Cheese 250gr', 'Yummy', 25, 38000), -- Fonterra or similar

-- Pengembang (KT006) -> CV Aneka Rasa (SP006)
('PR019', 'KT006', 'SP006', 'Ragi Instan 11gr', 'Fermipan', 200, 5000),
('PR020', 'KT006', 'SP006', 'Baking Powder 45gr', 'Koepoe Koepoe', 100, 6000),
('PR021', 'KT006', 'SP006', 'SP Pengemulsi 30gr', 'Koepoe Koepoe', 100, 8000),

-- Perisa (KT007) -> CV Aneka Rasa (SP006)
('PR022', 'KT007', 'SP006', 'Perisa Vanila 60ml', 'Koepoe Koepoe', 50, 7500),
('PR023', 'KT007', 'SP006', 'Pewarna Merah Tua 30ml', 'Koepoe Koepoe', 50, 6000),
('PR024', 'KT007', 'SP006', 'Pewarna Hijau Pandan 30ml', 'Koepoe Koepoe', 50, 6000),

-- Kacang (KT008) -> Toko Bahan Kue Sejahtera (SP003)
('PR025', 'KT008', 'SP003', 'Kacang Almond Slice 250gr', 'Blue Diamond', 40, 45000),
('PR026', 'KT008', 'SP003', 'Kacang Mete Mentah 500gr', 'Lokal', 30, 75000),

-- Selai (KT009) -> CV Manis Legit (SP009)
('PR027', 'KT009', 'SP009', 'Selai Nanas Nastar 500gr', 'Donnies', 35, 28000),
('PR028', 'KT009', 'SP009', 'Selai Strawberry 350gr', 'Morin', 40, 25000),

-- Kemasan (KT010) -> Toko Plastik Jaya (SP008)
('PR029', 'KT010', 'SP008', 'Loyang Brownies 20x10', 'Bima', 20, 15000),
('PR030', 'KT010', 'SP008', 'Plastik OPP 10x10 (100pcs)', 'Kinci', 100, 5000);
