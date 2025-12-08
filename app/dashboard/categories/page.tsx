import { getCategories } from "@/lib/actions/categories"
import { CategoryTable } from "@/components/categories/category-table"
import { CategoryDialog } from "@/components/categories/category-dialog"

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Kategori</h2>
                    <p className="text-muted-foreground">
                        Kelola kategori produk untuk toko anda.
                    </p>
                </div>
                <CategoryDialog />
            </div>
            <CategoryTable data={categories} />
        </div>
    )
}
