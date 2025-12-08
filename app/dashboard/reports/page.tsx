import { getDailyRevenue, getRevenueByCategory, getTopProducts } from "@/lib/actions/reports"
import { OverviewChart } from "@/components/reports/overview-chart"
import { CategoryPie } from "@/components/reports/category-pie"
import { ExportButton } from "@/components/reports/export-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReportsPage() {
    const dailyRevenue = await getDailyRevenue(7)
    const categoryRevenue = await getRevenueByCategory()
    const topProducts = await getTopProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h2>
                    <p className="text-muted-foreground">
                        Ringkasan performa penjualan.
                    </p>
                </div>
                <div className="flex gap-2">
                    <ExportButton data={dailyRevenue} filename="pendapatan_harian.xlsx" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart data={dailyRevenue} />
                <CategoryPie data={categoryRevenue} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Produk Terlaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {topProducts.map((product: any, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-muted-foreground">{product.sales} terjual</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
