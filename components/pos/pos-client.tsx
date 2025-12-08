"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createTransaction } from "@/lib/actions/pos"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface Product {
    idProduk: string
    namaProduk: string
    merk: string
    hargaSatuan: number
    stok: number
}

interface CartItem extends Product {
    qty: number
}

interface POSClientProps {
    products: Product[]
}

export function POSClient({ products }: POSClientProps) {
    const [search, setSearch] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "Transfer" | "QRIS">("Tunai")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.namaProduk.toLowerCase().includes(search.toLowerCase()) ||
            p.idProduk.toLowerCase().includes(search.toLowerCase())
        )
    }, [products, search])

    const addToCart = (product: Product) => {
        if (product.stok <= 0) {
            toast.error("Stok habis!")
            return
        }

        setCart(prev => {
            const existing = prev.find(item => item.idProduk === product.idProduk)
            if (existing) {
                if (existing.qty >= product.stok) {
                    toast.error("Stok tidak mencukupi!")
                    return prev
                }
                return prev.map(item =>
                    item.idProduk === product.idProduk
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const removeFromCart = (idProduk: string) => {
        setCart(prev => prev.filter(item => item.idProduk !== idProduk))
    }

    const updateQty = (idProduk: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.idProduk === idProduk) {
                    const newQty = item.qty + delta
                    if (newQty <= 0) return item
                    if (newQty > item.stok) {
                        toast.error("Stok tidak mencukupi!")
                        return item
                    }
                    return { ...item, qty: newQty }
                }
                return item
            })
        })
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.hargaSatuan * item.qty), 0)
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

    const handleCheckout = async () => {
        if (cart.length === 0) return

        setIsSubmitting(true)
        try {
            const res = await createTransaction({
                items: cart.map(item => ({ idProduk: item.idProduk, jumlah: item.qty })),
                metodePembayaran: paymentMethod
            })

            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Transaksi berhasil!")
                setCart([])
                setPaymentMethod("Tunai")
                setIsCartOpen(false)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
        } finally {
            setIsSubmitting(false)
        }
    }

    const CartContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang Belanja
            </div>
            <ScrollArea className="flex-1 p-4">
                {cart.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Keranjang kosong
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.idProduk} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{item.namaProduk}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.hargaSatuan)} x {item.qty}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.idProduk, -1)}>
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm">{item.qty}</span>
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.idProduk, 1)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="font-semibold text-sm w-[80px] text-right">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.hargaSatuan * item.qty)}
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.idProduk)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
            <div className="p-4 border-t bg-muted/10 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalAmount)}</span>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Metode Pembayaran</label>
                    <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tunai">Tunai</SelectItem>
                            <SelectItem value="Transfer">Transfer</SelectItem>
                            <SelectItem value="QRIS">QRIS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0 || isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Bayar & Cetak Struk
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-4 relative">
            {/* Product List (Left) */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari produk..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="flex-1 border rounded-md p-4 bg-muted/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-0">
                        {filteredProducts.map(product => (
                            <Card
                                key={product.idProduk}
                                className="cursor-pointer hover:border-primary transition-colors active:scale-95 transition-transform"
                                onClick={() => addToCart(product)}
                            >
                                <CardContent className="p-4">
                                    <div className="font-semibold truncate">{product.namaProduk}</div>
                                    <div className="text-xs text-muted-foreground mb-2">{product.merk}</div>
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-sm">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.hargaSatuan)}
                                        </div>
                                        <div className={`text-xs ${product.stok === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                                            Stok: {product.stok}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Desktop Cart (Right) - Hidden on Mobile */}
            <div className="hidden lg:flex w-[400px] flex-col border rounded-md bg-card">
                <CartContent />
            </div>

            {/* Mobile Cart Floating Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <SheetTrigger asChild>
                        <Button size="lg" className="rounded-full h-14 px-6 shadow-xl relative">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {totalItems > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 bg-red-500">
                                    {totalItems}
                                </Badge>
                            )}
                            <span className="font-bold">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalAmount)}
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Keranjang Belanja</SheetTitle>
                        </SheetHeader>
                        <CartContent />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
