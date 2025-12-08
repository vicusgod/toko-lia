import { getSuppliers } from "@/lib/actions/suppliers"
import { SupplierTable } from "@/components/suppliers/supplier-table"
import { SupplierDialog } from "@/components/suppliers/supplier-dialog"

export default async function SuppliersPage() {
    const suppliers = await getSuppliers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Supplier</h2>
                    <p className="text-muted-foreground">
                        Kelola data supplier dan kontak mereka.
                    </p>
                </div>
                <SupplierDialog />
            </div>
            <SupplierTable data={suppliers} />
        </div>
    )
}
