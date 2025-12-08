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
import { createCategory, updateCategory } from "@/lib/actions/categories"

const formSchema = z.object({
    namaKategori: z.string().min(1, "Nama kategori wajib diisi"),
})

interface CategoryDialogProps {
    category?: {
        idKategori: string
        namaKategori: string
    }
    trigger?: React.ReactNode
}

export function CategoryDialog({ category, trigger }: CategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const isEditing = !!category

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaKategori: category?.namaKategori || "",
        },
    })

    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing) {
                const res = await updateCategory(category.idKategori, values)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Kategori berhasil diperbarui")
                    setOpen(false)
                }
            } else {
                const res = await createCategory(values)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Kategori berhasil ditambahkan")
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
                        <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Ubah detail kategori di sini."
                            : "Tambahkan kategori produk baru."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="namaKategori"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Kategori</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Bahan Kue" {...field} />
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
