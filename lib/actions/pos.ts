"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { generateNextId } from "@/lib/utils/id-generator"
import { z } from "zod"

import { TransactionSchema } from "@/lib/schemas"

export async function createTransaction(formData: z.infer<typeof TransactionSchema>) {
    const supabase = await createClerkSupabaseClientSsr()
    const idTransaksi = await generateNextId("TransaksiPenjualan", "idTransaksi", "TR")
    const idPembayaran = await generateNextId("Pembayaran", "idPembayaran", "PY")

    const { error: headerError } = await supabase.from("TransaksiPenjualan").insert({
        idTransaksi,
    })

    if (headerError) {
        return { error: "Gagal membuat transaksi: " + headerError.message }
    }

    const details = formData.items.map(item => ({
        idTransaksi,
        idProduk: item.idProduk,
        jumlah: item.jumlah,
    }))

    const { error: detailsError } = await supabase.from("DetailPenjualan").insert(details)

    if (detailsError) {
        return { error: "Gagal menyimpan detail transaksi: " + detailsError.message }
    }

    const { error: paymentError } = await supabase.from("Pembayaran").insert({
        idPembayaran,
        idTransaksi,
        metode: formData.metodePembayaran,
        status: "Lunas",
    })

    if (paymentError) {
        return { error: "Gagal menyimpan pembayaran: " + paymentError.message }
    }

    revalidatePath("/dashboard/pos")
    revalidatePath("/dashboard/products")
    return { success: true }
}
