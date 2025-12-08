"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { generateNextId } from "@/lib/utils/id-generator"
import { z } from "zod"

import { CategorySchema } from "@/lib/schemas"

export async function getCategories() {
    const supabase = await createClerkSupabaseClientSsr()
    const { data, error } = await supabase.from("KategoriProduk").select("*").order("idKategori")

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }

    return data
}

export async function createCategory(formData: z.infer<typeof CategorySchema>) {
    const supabase = await createClerkSupabaseClientSsr()
    const idKategori = await generateNextId("KategoriProduk", "idKategori", "KT")

    const { error } = await supabase.from("KategoriProduk").insert({
        idKategori,
        namaKategori: formData.namaKategori,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/categories")
    return { success: true }
}

export async function updateCategory(idKategori: string, formData: z.infer<typeof CategorySchema>) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error } = await supabase
        .from("KategoriProduk")
        .update({ namaKategori: formData.namaKategori })
        .eq("idKategori", idKategori)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/categories")
    return { success: true }
}

export async function deleteCategory(idKategori: string) {
    const supabase = await createClerkSupabaseClientSsr()

    const { error } = await supabase
        .from("KategoriProduk")
        .delete()
        .eq("idKategori", idKategori)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/categories")
    return { success: true }
}
