"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { generateNextId } from "@/lib/utils/id-generator"
import { z } from "zod"

import { ProductSchema } from "@/lib/schemas"

// Updated getProducts to accept optional supplier filter
export async function getProducts(supplierId?: string) {
    const supabase = await createClerkSupabaseClientSsr()
    let query = supabase
        .from("Produk")
        .select(`*, KategoriProduk (namaKategori)`)
        .order("idProduk")

    if (supplierId) {
        query = query.eq("idSupplier", supplierId)
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching products:", error)
        return []
    }

    return data
}

export async function createProduct(formData: z.infer<typeof ProductSchema>) {
    const supabase = await createClerkSupabaseClientSsr()
    const idProduk = await generateNextId("Produk", "idProduk", "PR")

    const { error } = await supabase.from("Produk").insert({
        idProduk,
        idKategori: formData.idKategori,
        idSupplier: formData.idSupplier || null,
        namaProduk: formData.namaProduk,
        merk: formData.merk,
        stok: formData.stok,
        hargaSatuan: formData.hargaSatuan,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/products")
    return { success: true }
}

export async function updateProduct(idProduk: string, formData: z.infer<typeof ProductSchema>) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error } = await supabase
        .from("Produk")
        .update({
            idKategori: formData.idKategori,
            idSupplier: formData.idSupplier || null,
            namaProduk: formData.namaProduk,
            merk: formData.merk,
            stok: formData.stok,
            hargaSatuan: formData.hargaSatuan,
        })
        .eq("idProduk", idProduk)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/products")
    return { success: true }
}

export async function deleteProduct(idProduk: string) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error } = await supabase.from("Produk").delete().eq("idProduk", idProduk)

    if (error) {
        if (error.code === "23503") {
            return { error: "Produk tidak bisa dihapus karena sudah ada transaksi." }
        }
        return { error: error.message }
    }

    revalidatePath("/dashboard/products")
    return { success: true }
}
