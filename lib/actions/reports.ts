"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { startOfDay, endOfDay, format } from "date-fns"

export async function getTransactions() {
  const supabase = await createClerkSupabaseClientSsr()
  const { data, error } = await supabase
    .from("TransaksiPenjualan")
    .select(`
      *,
      Pembayaran (
        metode,
        status
      ),
      DetailPenjualan (
        jumlah,
        subtotal,
        Produk (
          namaProduk
        )
      )
    `)
    .order("tanggalTransaksi", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data
}

export async function getDashboardStats() {
  const supabase = await createClerkSupabaseClientSsr()
  const todayStart = startOfDay(new Date()).toISOString()
  const todayEnd = endOfDay(new Date()).toISOString()

  // 1. Total Sales Today
  const { data: salesToday } = await supabase
    .from("TransaksiPenjualan")
    .select("total")
    .gte("tanggalTransaksi", todayStart)
    .lte("tanggalTransaksi", todayEnd)

  const totalSalesToday = salesToday?.reduce((sum, t) => sum + t.total, 0) || 0
  const totalTransToday = salesToday?.length || 0

  // 2. Low Stock Products (< 10)
  const { data: lowStock } = await supabase
    .from("Produk")
    .select("idProduk, namaProduk, stok")
    .lt("stok", 10)
    .limit(5)

  return {
    totalSalesToday,
    totalTransToday,
    lowStock: lowStock || []
  }
}

export async function getDailyRevenue(days: number = 7) {
  const supabase = await createClerkSupabaseClientSsr()
  const startDate = startOfDay(new Date(new Date().setDate(new Date().getDate() - days))).toISOString()

  const { data } = await supabase
    .from("TransaksiPenjualan")
    .select("tanggalTransaksi, total")
    .gte("tanggalTransaksi", startDate)
    .order("tanggalTransaksi", { ascending: true })

  if (!data) return []

  // Aggregate by day
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = data.reduce((acc: any, curr) => {
    const date = format(new Date(curr.tanggalTransaksi), "dd MMM")
    if (!acc[date]) acc[date] = 0
    acc[date] += curr.total
    return acc
  }, {})

  return Object.keys(grouped).map(date => ({
    date,
    total: grouped[date]
  }))
}

export async function getRevenueByCategory() {
  const supabase = await createClerkSupabaseClientSsr()

  // Custom query to join DetaiPenjualan -> Produk -> Kategori
  // Note: Supabase JS simpler approach is fetching details and aggregating in JS for small-medium datasets

  const { data } = await supabase
    .from("DetailPenjualan")
    .select(`
      subtotal,
      Produk (
        KategoriProduk (
          namaKategori
        )
      )
    `)

  if (!data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = data.reduce((acc: any, curr: any) => {
    const category = curr.Produk?.KategoriProduk?.namaKategori || "Lainnya"
    if (!acc[category]) acc[category] = 0
    acc[category] += curr.subtotal
    return acc
  }, {})

  return Object.keys(grouped).map(name => ({
    name,
    value: grouped[name]
  }))
}

export async function getTopProducts() {
  const supabase = await createClerkSupabaseClientSsr()

  const { data } = await supabase
    .from("DetailPenjualan")
    .select(`
      jumlah,
      Produk (
        namaProduk
      )
    `)

  if (!data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = data.reduce((acc: any, curr: any) => {
    const product = curr.Produk?.namaProduk || "Unknown"
    if (!acc[product]) acc[product] = 0
    acc[product] += curr.jumlah
    return acc
  }, {})

  return Object.keys(grouped)
    .map(name => ({
      name,
      sales: grouped[name]
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
}
