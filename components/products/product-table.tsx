"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ProductDialog } from "./product-dialog"
import { deleteProduct } from "@/lib/actions/products"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
    idProduk: string
    idKategori: string
    namaProduk: string
    merk: string
    stok: number
    hargaSatuan: number
    KategoriProduk?: {
        namaKategori: string
    } | null
}

interface Category {
    idKategori: string
    namaKategori: string
}

interface ProductTableProps {
    data: Product[]
    categories: Category[]
}

export function ProductTable({ data, categories }: ProductTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        const res = await deleteProduct(id)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Produk berhasil dihapus")
        }
        setDeletingId(null)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Merk</TableHead>
                        <TableHead className="text-right">Stok</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                                Tidak ada data produk.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((product) => (
                            <TableRow key={product.idProduk}>
                                <TableCell className="font-medium">{product.idProduk}</TableCell>
                                <TableCell>{product.namaProduk}</TableCell>
                                <TableCell>{product.KategoriProduk?.namaKategori || "-"}</TableCell>
                                <TableCell>{product.merk}</TableCell>
                                <TableCell className="text-right">{product.stok}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(product.hargaSatuan)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <ProductDialog
                                        product={product}
                                        categories={categories}
                                        trigger={
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Produk ini akan dihapus permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(product.idProduk)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    {deletingId === product.idProduk ? "Menghapus..." : "Hapus"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
