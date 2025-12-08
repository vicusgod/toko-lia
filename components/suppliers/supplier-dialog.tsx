"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
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
import { createSupplier, updateSupplier } from "@/lib/actions/suppliers"

const formSchema = z.object({
    namaSupplier: z.string().min(1, "Nama supplier wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    telephone: z.array(z.object({
        value: z.string().min(1, "Nomor telepon wajib diisi")
    })).min(1, "Minimal satu nomor telepon wajib diisi"),
})

interface SupplierDialogProps {
    supplier?: {
        idSupplier: string
        namaSupplier: string
        alamat: string
        telephone: string[]
    }
    trigger?: React.ReactNode
}

export function SupplierDialog({ supplier, trigger }: SupplierDialogProps) {
    const [open, setOpen] = useState(false)
    const isEditing = !!supplier

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaSupplier: supplier?.namaSupplier || "",
            alamat: supplier?.alamat || "",
            telephone: supplier?.telephone?.map(t => ({ value: t })) || [{ value: "" }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "telephone",
    })

    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formattedValues = {
                ...values,
                telephone: values.telephone.map(t => t.value),
            }

            if (isEditing) {
                const res = await updateSupplier(supplier!.idSupplier, formattedValues)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Supplier berhasil diperbarui")
                    setOpen(false)
                }
            } else {
                const res = await createSupplier(formattedValues)
                if (res.error) {
                    toast.error(res.error)
                } else {
                    toast.success("Supplier berhasil ditambahkan")
                    setOpen(false)
                    form.reset({
                        namaSupplier: "",
                        alamat: "",
                        telephone: [{ value: "" }],
                    })
                }
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Supplier
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Supplier" : "Tambah Supplier"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Ubah detail supplier di sini."
                            : "Tambahkan supplier baru."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="namaSupplier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Supplier</FormLabel>
                                    <FormControl>
                                        <Input placeholder="PT. Maju Jaya" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Telepon</FormLabel>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`telephone.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="08123456789" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ value: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Nomor
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="alamat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jl. Sudirman No. 1" {...field} />
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
