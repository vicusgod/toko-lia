"use client"


import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
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
import { createPurchase } from "@/lib/actions/procurement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    idSupplier: z.string().min(1, "Supplier wajib dipilih"),
    tanggalPembelian: z.string().min(1, "Tanggal wajib diisi"),
    items: z.array(z.object({
        idProduk: z.string().min(1, "Produk wajib dipilih"),
        jumlah: z.coerce.number().min(1, "Jumlah minimal 1"),
    })).min(1, "Minimal satu barang harus dibeli"),
})

interface RestockFormProps {
    suppliers: { idSupplier: string, namaSupplier: string }[]
    products: { idProduk: string, namaProduk: string, merk: string }[]
}

export function RestockForm({ suppliers, products }: RestockFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idSupplier: "",
            tanggalPembelian: format(new Date(), "yyyy-MM-dd"),
            items: [{ idProduk: "", jumlah: 1 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await createPurchase(values)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Restock berhasil dicatat")
                form.reset({
                    idSupplier: "",
                    tanggalPembelian: format(new Date(), "yyyy-MM-dd"),
                    items: [{ idProduk: "", jumlah: 1 }],
                })
            }
        } catch {
            toast.error("Terjadi kesalahan")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="idSupplier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supplier</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih supplier" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {suppliers.map((s) => (
                                            <SelectItem key={s.idSupplier} value={s.idSupplier}>
                                                {s.namaSupplier}
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
                        name="tanggalPembelian"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tanggal Pembelian</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Daftar Barang</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ idProduk: "", jumlah: 1 })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Barang
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-4">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.idProduk`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Produk</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih produk" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.idProduk} value={p.idProduk}>
                                                            {p.namaProduk} ({p.merk})
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
                                    name={`items.${index}.jumlah`}
                                    render={({ field }) => (
                                        <FormItem className="w-[100px]">
                                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Jumlah</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive mb-0.5"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <FormMessage>{form.formState.errors.items?.root?.message}</FormMessage>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Pembelian (Restock)
                </Button>
            </form>
        </Form>
    )
}
