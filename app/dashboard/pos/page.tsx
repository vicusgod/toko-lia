import { getProducts } from "@/lib/actions/products"
import { POSClient } from "@/components/pos/pos-client"

export default async function POSPage() {
    const products = await getProducts()

    return (
        <div className="h-full flex flex-col space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Kasir (POS)</h2>
                <p className="text-muted-foreground">
                    Transaksi penjualan harian.
                </p>
            </div>
            <POSClient products={products} />
        </div>
    )
}
