import { z } from "zod"

export const PurchaseSchema = z.object({
    idSupplier: z.string().min(1, "Supplier wajib dipilih"),
    tanggalPembelian: z.string().min(1, "Tanggal wajib diisi"),
    items: z.array(z.object({
        idProduk: z.string().min(1, "Produk wajib dipilih"),
        jumlah: z.coerce.number().min(1, "Jumlah minimal 1"),
    })).min(1, "Minimal satu barang harus dibeli"),
})

export const ProductSchema = z.object({
    idKategori: z.string().min(1, "Kategori wajib dipilih"),
    namaProduk: z.string().min(1, "Nama produk wajib diisi"),
    merk: z.string().min(1, "Merk wajib diisi"),
    stok: z.coerce.number().min(0, "Stok tidak boleh negatif"),
    hargaSatuan: z.coerce.number().min(0, "Harga tidak boleh negatif"),
})

export const SupplierSchema = z.object({
    namaSupplier: z.string().min(1, "Nama supplier wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    telephone: z.array(z.string().min(1, "Nomor telepon wajib diisi")).min(1, "Minimal satu nomor telepon wajib diisi"),
})

export const CategorySchema = z.object({
    namaKategori: z.string().min(1, "Nama kategori wajib diisi"),
})

export const TransactionSchema = z.object({
    items: z.array(z.object({
        idProduk: z.string().min(1, "Produk wajib dipilih"),
        jumlah: z.coerce.number().min(1, "Jumlah minimal 1"),
    })).min(1, "Keranjang belanja kosong"),
    metodePembayaran: z.enum(["Tunai", "Transfer", "QRIS"]),
})
