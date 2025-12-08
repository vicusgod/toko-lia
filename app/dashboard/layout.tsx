import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/auth/roles"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    const userRole = user.publicMetadata?.role as UserRole | undefined

    // If no role assigned, redirect to pending page
    if (!userRole) {
        redirect("/pending")
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
