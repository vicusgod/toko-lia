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
import { SupplierDialog } from "./supplier-dialog"
import { deleteSupplier } from "@/lib/actions/suppliers"
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
import { Badge } from "@/components/ui/badge"

interface Supplier {
    idSupplier: string
    namaSupplier: string
    alamat: string
    telephone: string[]
}

interface SupplierTableProps {
    data: Supplier[]
}

export function SupplierTable({ data }: SupplierTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        const res = await deleteSupplier(id)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Supplier berhasil dihapus")
        }
        setDeletingId(null)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Nama Supplier</TableHead>
                        <TableHead>Telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                Tidak ada data supplier.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((supplier) => (
                            <TableRow key={supplier.idSupplier}>
                                <TableCell className="font-medium">{supplier.idSupplier}</TableCell>
                                <TableCell>{supplier.namaSupplier}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {supplier.telephone.length > 0 ? (
                                            supplier.telephone.map((phone, index) => (
                                                <Badge key={index} variant="secondary" className="font-normal">
                                                    {phone}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{supplier.alamat}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <SupplierDialog
                                        supplier={supplier}
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
                                                    Tindakan ini tidak dapat dibatalkan. Supplier ini akan dihapus permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(supplier.idSupplier)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    {deletingId === supplier.idSupplier ? "Menghapus..." : "Hapus"}
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
