import { getProducts } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import { ProductTable } from "@/components/products/product-table"
import { ProductDialog } from "@/components/products/product-dialog"

export default async function ProductsPage() {
    const products = await getProducts()
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Produk</h2>
                    <p className="text-muted-foreground">
                        Kelola inventaris produk toko anda.
                    </p>
                </div>
                <ProductDialog categories={categories} />
            </div>
            <ProductTable data={products} categories={categories} />
        </div>
    )
}
