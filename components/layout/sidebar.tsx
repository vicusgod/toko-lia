"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Tags,
    Truck,
    Users,
    FileText,
    Archive,
    LucideIcon
} from "lucide-react"
import { UserRole, rolePermissions } from "@/lib/auth/roles"

interface MenuItem {
    title: string
    href: string
    icon: LucideIcon
}

interface MenuGroup {
    title: string
    items: MenuItem[]
}

type SidebarItem = MenuItem | MenuGroup

function isGroup(item: SidebarItem): item is MenuGroup {
    return 'items' in item
}

function canAccess(role: UserRole, path: string): boolean {
    const allowed = rolePermissions[role] || []
    return allowed.includes(path)
}

const allSidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Kasir (POS)",
        href: "/dashboard/pos",
        icon: ShoppingCart,
    },
    {
        title: "Inventory",
        items: [
            { title: "Data Produk", href: "/dashboard/products", icon: Package },
            { title: "Data Kategori", href: "/dashboard/categories", icon: Tags },
            { title: "Restock Barang", href: "/dashboard/restock", icon: Truck },
        ],
    },
    {
        title: "Mitra",
        items: [
            { title: "Data Supplier", href: "/dashboard/suppliers", icon: Users },
        ],
    },
    {
        title: "Laporan",
        items: [
            { title: "Riwayat Transaksi", href: "/dashboard/transactions", icon: Archive },
            { title: "Laporan Keuangan", href: "/dashboard/reports", icon: FileText },
        ],
    },
]

export function SidebarContent() {
    const pathname = usePathname()
    const { user } = useUser()

    const userRole = (user?.publicMetadata?.role as UserRole) || "kasir"

    // Build filtered menu
    const filteredItems: SidebarItem[] = []

    for (const item of allSidebarItems) {
        if (isGroup(item)) {
            const accessibleSubItems = item.items.filter(sub => canAccess(userRole, sub.href))
            if (accessibleSubItems.length > 0) {
                filteredItems.push({ title: item.title, items: accessibleSubItems })
            }
        } else {
            if (canAccess(userRole, item.href)) {
                filteredItems.push(item)
            }
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package className="h-6 w-6" />
                    <span>Toko LIA</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {filteredItems.map((item, index) => (
                        <div key={index} className="mb-4">
                            {isGroup(item) ? (
                                <>
                                    <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                                        {item.title}
                                    </h4>
                                    {item.items.map((subItem) => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === subItem.href ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <subItem.icon className="h-4 w-4" />
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
            <div className="p-4 text-xs text-muted-foreground border-t">
                Role: {userRole}
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden border-r bg-card text-card-foreground md:block w-64">
            <SidebarContent />
        </div>
    )
}
