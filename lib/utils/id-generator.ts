import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"

export async function generateNextId(table: string, idColumn: string, prefix: string): Promise<string> {
    const supabase = await createClerkSupabaseClientSsr()

    const { data, error } = await supabase
        .from(table)
        .select(idColumn)
        .order(idColumn, { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        return `${prefix}001`
    }

    // @ts-ignore
    const lastId = data[idColumn] as string
    const numberPart = parseInt(lastId.replace(prefix, ""), 10)

    if (isNaN(numberPart)) {
        return `${prefix}001`
    }

    const nextNumber = numberPart + 1
    return `${prefix}${nextNumber.toString().padStart(3, "0")}`
}
