import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/logo.jpg"
                alt="Toko LIA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Toko LIA</h1>
          <p className="text-slate-400">Internal Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-white">Selamat Datang</h2>
              <p className="text-sm text-slate-400">
                Silakan masuk untuk mengakses dashboard operasional.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/dashboard" className="block">
                <Button className="w-full h-11 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Masuk ke Sistem <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">Akses Terbatas</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-300/80 leading-relaxed">
                  Sistem ini hanya untuk penggunaan internal karyawan Toko LIA. Segala aktivitas akan tercatat.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            &copy; 2024 Toko LIA. v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
