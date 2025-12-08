import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Clock, Mail, Package } from "lucide-react"
import Link from "next/link"

export default async function PendingPage() {
    const user = await currentUser()

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-white font-semibold">
                    <Package className="h-6 w-6" />
                    <span>Toko LIA</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                            <Clock className="h-8 w-8 text-amber-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-3">
                            Menunggu Persetujuan
                        </h1>
                        <p className="text-slate-400 text-sm mb-6">
                            Akun Anda telah terdaftar. Silakan tunggu Owner untuk memberikan akses ke sistem.
                        </p>

                        <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-slate-500" />
                                <span className="text-slate-300">{user?.emailAddresses[0]?.emailAddress}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">
                            Hubungi pemilik toko jika Anda memerlukan akses segera.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
