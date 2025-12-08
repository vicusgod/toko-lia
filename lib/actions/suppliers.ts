"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { generateNextId } from "@/lib/utils/id-generator"
import { z } from "zod"

const SupplierSchema = z.object({
    namaSupplier: z.string().min(1, "Nama supplier wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    telephone: z.array(z.string().min(1, "Nomor telepon wajib diisi")).min(1, "Minimal satu nomor telepon wajib diisi"),
})

export async function getSuppliers() {
    const supabase = await createClerkSupabaseClientSsr()
    const { data, error } = await supabase
        .from("Supplier")
        .select(`*, SupplierTelepon (telephone)`)
        .order("idSupplier")

    if (error) {
        console.error("Error fetching suppliers:", error)
        return []
    }

    return data.map((supplier: any) => ({
        ...supplier,
        telephone: supplier.SupplierTelepon?.map((t: any) => t.telephone) || [],
    }))
}

export async function createSupplier(formData: z.infer<typeof SupplierSchema>) {
    const supabase = await createClerkSupabaseClientSsr()
    const idSupplier = await generateNextId("Supplier", "idSupplier", "SP")

    const { error: supplierError } = await supabase.from("Supplier").insert({
        idSupplier,
        namaSupplier: formData.namaSupplier,
        alamat: formData.alamat,
    })

    if (supplierError) {
        return { error: supplierError.message }
    }

    const phoneInserts = formData.telephone.map(phone => ({
        idSupplier,
        telephone: phone,
    }))

    const { error: phoneError } = await supabase.from("SupplierTelepon").insert(phoneInserts)

    if (phoneError) {
        return { error: "Supplier created but phone failed: " + phoneError.message }
    }

    revalidatePath("/dashboard/suppliers")
    return { success: true }
}

export async function updateSupplier(idSupplier: string, formData: z.infer<typeof SupplierSchema>) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error: supplierError } = await supabase
        .from("Supplier")
        .update({ namaSupplier: formData.namaSupplier, alamat: formData.alamat })
        .eq("idSupplier", idSupplier)

    if (supplierError) {
        return { error: supplierError.message }
    }

    // Delete existing phones
    await supabase.from("SupplierTelepon").delete().eq("idSupplier", idSupplier)

    // Insert new phones
    const phoneInserts = formData.telephone.map(phone => ({
        idSupplier,
        telephone: phone,
    }))

    const { error: phoneError } = await supabase.from("SupplierTelepon").insert(phoneInserts)

    if (phoneError) {
        return { error: "Supplier updated but phone update failed: " + phoneError.message }
    }

    revalidatePath("/dashboard/suppliers")
    return { success: true }
}

export async function deleteSupplier(idSupplier: string) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error } = await supabase.from("Supplier").delete().eq("idSupplier", idSupplier)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/suppliers")
    return { success: true }
}
