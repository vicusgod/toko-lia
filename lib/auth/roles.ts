export type UserRole = "owner" | "kasir" | "gudang"

// Route permission mapping
export const rolePermissions: Record<UserRole, string[]> = {
    owner: [
        "/dashboard",
        "/dashboard/pos",
        "/dashboard/products",
        "/dashboard/categories",
        "/dashboard/suppliers",
        "/dashboard/restock",
        "/dashboard/transactions",
        "/dashboard/reports",
    ],
    kasir: [
        "/dashboard",
        "/dashboard/pos",
        "/dashboard/transactions",
    ],
    gudang: [
        "/dashboard",
        "/dashboard/products",
        "/dashboard/categories",
        "/dashboard/suppliers",
        "/dashboard/restock",
    ],
}

export function hasAccess(role: UserRole | undefined, path: string): boolean {
    if (!role) return false
    const allowedRoutes = rolePermissions[role] || []
    return allowedRoutes.some(route => path === route || path.startsWith(route + "/"))
}

export function getAccessibleRoutes(role: UserRole | undefined): string[] {
    if (!role) return []
    return rolePermissions[role] || []
}

export function getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
        owner: "Owner",
        kasir: "Admin Kasir",
        gudang: "Bagian Gudang",
    }
    return labels[role] || role
}
