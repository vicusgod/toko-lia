"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/actions/products"

const formSchema = z.object({
    idKategori: z.string().min(1, "Kategori wajib dipilih"),
    idSupplier: z.string().optional(),
    namaProduk: z.string().min(1, "Nama produk wajib diisi"),
    merk: z.string().min(1, "Merk wajib diisi"),
    stok: z.coerce.number().min(0, "Stok tidak boleh negatif"),
    hargaSatuan: z.coerce.number().min(0, "Harga tidak boleh negatif"),
})

interface Category {
    idKategori: string
    namaKategori: string
}

interface Supplier {
    idSupplier: string
    namaSupplier: string
}

interface ProductDialogProps {
    product?: {
        idProduk: string
        idKategori: string
        idSupplier?: string | null
        namaProduk: string
        merk: string
        stok: number
        hargaSatuan: number
    }
    categories: Category[]
    suppliers: Supplier[]
    trigger?: React.ReactNode
}

export function ProductDialog({ product, categories, suppliers, trigger }: ProductDialogProps) {
    const [open, setOpen] = useState(false)
    const isEditing = !!product

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idKategori: product?.idKategori || "",
            idSupplier: product?.idSupplier || "",
            namaProduk: product?.namaProduk || "",
            merk: product?.merk || "",
            stok: product?.stok || 0,
            hargaSatuan: product?.hargaSatuan || 0,
        },
    })

    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing) {
                const res = await updateProduct(product.idProduk, values)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Produk berhasil diperbarui")
                    setOpen(false)
                }
            } else {
                const res = await createProduct(values)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Produk berhasil ditambahkan")
                    setOpen(false)
                    form.reset()
                }
            }
        } catch {
            toast.error("Terjadi kesalahan")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Produk
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Ubah detail produk di sini."
                            : "Tambahkan produk baru ke inventaris."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="idKategori"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.idKategori} value={category.idKategori}>
                                                    {category.namaKategori}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="idSupplier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih supplier (Opsional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {suppliers.map((supplier) => (
                                                <SelectItem key={supplier.idSupplier} value={supplier.idSupplier}>
                                                    {supplier.namaSupplier}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="namaProduk"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Produk</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Tepung Terigu" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="merk"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Merk</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Segitiga Biru" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stok"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stok Awal</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="hargaSatuan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga Satuan (Rp)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
