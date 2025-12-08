-- Enable UUID extension if needed (though we use CHAR(5) as per PRD)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- Calculated automatically
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
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
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

-- TRIGGERS AND FUNCTIONS

-- Function to calculate subtotal for DetailPenjualan
CREATE OR REPLACE FUNCTION calculate_sales_subtotal()
RETURNS TRIGGER AS $$
DECLARE
    product_price DECIMAL(10,2);
BEGIN
    SELECT "hargaSatuan" INTO product_price FROM "Produk" WHERE "idProduk" = NEW."idProduk";
    NEW.subtotal := NEW.jumlah * product_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_sales_subtotal
BEFORE INSERT OR UPDATE ON "DetailPenjualan"
FOR EACH ROW
EXECUTE FUNCTION calculate_sales_subtotal();

-- Function to update total in TransaksiPenjualan
CREATE OR REPLACE FUNCTION update_sales_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "TransaksiPenjualan"
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM "DetailPenjualan" WHERE "idTransaksi" = NEW."idTransaksi")
    WHERE "idTransaksi" = NEW."idTransaksi";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sales_total
AFTER INSERT OR UPDATE OR DELETE ON "DetailPenjualan"
FOR EACH ROW
EXECUTE FUNCTION update_sales_total();

-- Function to decrease stock on sale
CREATE OR REPLACE FUNCTION decrease_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Produk"
    SET stok = stok - NEW.jumlah
    WHERE "idProduk" = NEW."idProduk";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrease_stock
AFTER INSERT ON "DetailPenjualan"
FOR EACH ROW
EXECUTE FUNCTION decrease_stock_on_sale();

-- Function to calculate subtotal for DetailPembelian (Assuming price is not in DetailPembelian, but usually purchase price differs from sales price. 
-- However, based on schema, we might need to fetch it or just trust input. 
-- PRD says "Calculated automatically", but doesn't have "hargaBeli" in Produk. 
-- We will assume for now it uses the current product price or needs to be passed. 
-- Given the schema doesn't have 'hargaBeli' in DetailPembelian, we'll use Produk.hargaSatuan for now, OR assume the user updates it manually if it differs.
-- BUT, usually Purchase Price is input. 
-- Let's assume for this MVP we use the Product's current price or 0 if not set, but really it should probably be input.
-- Since the PRD schema for DetailPembelian is: id, idProduk, jumlah, subtotal.
-- And it says "Calculated automatically".
-- Let's assume we use the current price in Produk for calculation to satisfy the requirement.)

CREATE OR REPLACE FUNCTION calculate_purchase_subtotal()
RETURNS TRIGGER AS $$
DECLARE
    product_price DECIMAL(10,2);
BEGIN
    -- Ideally this should come from input or a separate cost price field, but using sales price as fallback or placeholder
    SELECT "hargaSatuan" INTO product_price FROM "Produk" WHERE "idProduk" = NEW."idProduk";
    NEW.subtotal := NEW.jumlah * product_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_purchase_subtotal
BEFORE INSERT OR UPDATE ON "DetailPembelian"
FOR EACH ROW
EXECUTE FUNCTION calculate_purchase_subtotal();

-- Function to update total in Pembelian
CREATE OR REPLACE FUNCTION update_purchase_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Pembelian"
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM "DetailPembelian" WHERE "idPembelian" = NEW."idPembelian")
    WHERE "idPembelian" = NEW."idPembelian";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchase_total
AFTER INSERT OR UPDATE OR DELETE ON "DetailPembelian"
FOR EACH ROW
EXECUTE FUNCTION update_purchase_total();

-- Function to increase stock on purchase
CREATE OR REPLACE FUNCTION increase_stock_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Produk"
    SET stok = stok + NEW.jumlah
    WHERE "idProduk" = NEW."idProduk";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increase_stock
AFTER INSERT ON "DetailPembelian"
FOR EACH ROW
EXECUTE FUNCTION increase_stock_on_purchase();
