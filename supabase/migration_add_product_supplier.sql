-- Add idSupplier column to Produk table
ALTER TABLE "Produk" 
ADD COLUMN "idSupplier" text REFERENCES "Supplier"("idSupplier");

-- Optional: Create an index for faster filtering
CREATE INDEX "idx_produk_idsupplier" ON "Produk"("idSupplier");
