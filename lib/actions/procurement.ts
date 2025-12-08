"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { generateNextId } from "@/lib/utils/id-generator"
import { z } from "zod"

import { PurchaseSchema } from "@/lib/schemas"

export async function createPurchase(formData: z.infer<typeof PurchaseSchema>) {
    const supabase = await createClerkSupabaseClientSsr()
    const idPembelian = await generateNextId("Pembelian", "idPembelian", "PB")

    const { error: headerError } = await supabase.from("Pembelian").insert({
        idPembelian,
        idSupplier: formData.idSupplier,
        tanggalPembelian: formData.tanggalPembelian,
    })

    if (headerError) {
        return { error: "Gagal membuat nota pembelian: " + headerError.message }
    }

    const details = formData.items.map(item => ({
        idPembelian,
        idProduk: item.idProduk,
        jumlah: item.jumlah,
    }))

    const { error: detailsError } = await supabase.from("DetailPembelian").insert(details)

    if (detailsError) {
        return { error: "Gagal menyimpan detail barang: " + detailsError.message }
    }

    revalidatePath("/dashboard/restock")
    revalidatePath("/dashboard/products")
    return { success: true }
}
