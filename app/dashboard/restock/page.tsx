import { getSuppliers } from "@/lib/actions/suppliers"
import { getProducts } from "@/lib/actions/products"
import { RestockForm } from "@/components/procurement/restock-form"

export default async function RestockPage() {
    const suppliers = await getSuppliers()
    const products = await getProducts()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Restock Barang</h2>
                <p className="text-muted-foreground">
                    Catat pembelian barang masuk dari supplier.
                </p>
            </div>
            <RestockForm suppliers={suppliers} products={products} />
        </div>
    )
}
