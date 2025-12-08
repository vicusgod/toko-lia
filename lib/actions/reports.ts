"use server"

import { createClerkSupabaseClientSsr } from "@/utils/supabase/server"
import { startOfDay, endOfDay } from "date-fns"

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
