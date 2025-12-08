import { getTransactions } from "@/lib/actions/reports"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default async function TransactionsPage() {
    const transactions = await getTransactions()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h2>
                <p className="text-muted-foreground">
                    Daftar 50 transaksi terakhir.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Metode</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    Belum ada transaksi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            transactions.map((t: any) => (
                                <TableRow key={t.idTransaksi}>
                                    <TableCell className="font-medium">{t.idTransaksi}</TableCell>
                                    <TableCell>{format(new Date(t.tanggalTransaksi), "dd/MM/yyyy HH:mm")}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {t.DetailPenjualan.map((detail: any, idx: number) => (
                                                <div key={idx} className="text-sm">
                                                    {detail.Produk.namaProduk} x {detail.jumlah}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{t.Pembayaran?.[0]?.metode || "-"}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(t.total)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
