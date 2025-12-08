export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      KategoriProduk: {
        Row: {
          idKategori: string
          namaKategori: string
        }
        Insert: {
          idKategori: string
          namaKategori: string
        }
        Update: {
          idKategori?: string
          namaKategori?: string
        }
        Relationships: []
      }
      Supplier: {
        Row: {
          idSupplier: string
          namaSupplier: string
          alamat: string
        }
        Insert: {
          idSupplier: string
          namaSupplier: string
          alamat: string
        }
        Update: {
          idSupplier?: string
          namaSupplier?: string
          alamat?: string
        }
        Relationships: []
      }
      SupplierTelepon: {
        Row: {
          idSupplier: string
          telephone: string
        }
        Insert: {
          idSupplier: string
          telephone: string
        }
        Update: {
          idSupplier?: string
          telephone?: string
        }
        Relationships: [
          {
            foreignKeyName: "SupplierTelepon_idSupplier_fkey"
            columns: ["idSupplier"]
            isOneToOne: false
            referencedRelation: "Supplier"
            referencedColumns: ["idSupplier"]
          }
        ]
      }
      Produk: {
        Row: {
          idProduk: string
          idKategori: string
          namaProduk: string
          merk: string
          stok: number
          hargaSatuan: number
        }
        Insert: {
          idProduk: string
          idKategori: string
          namaProduk: string
          merk: string
          stok?: number
          hargaSatuan: number
        }
        Update: {
          idProduk?: string
          idKategori?: string
          namaProduk?: string
          merk?: string
          stok?: number
          hargaSatuan?: number
        }
        Relationships: [
          {
            foreignKeyName: "Produk_idKategori_fkey"
            columns: ["idKategori"]
            isOneToOne: false
            referencedRelation: "KategoriProduk"
            referencedColumns: ["idKategori"]
          }
        ]
      }
      Pembelian: {
        Row: {
          idPembelian: string
          idSupplier: string
          tanggalPembelian: string
          total: number
        }
        Insert: {
          idPembelian: string
          idSupplier: string
          tanggalPembelian?: string
          total?: number
        }
        Update: {
          idPembelian?: string
          idSupplier?: string
          tanggalPembelian?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "Pembelian_idSupplier_fkey"
            columns: ["idSupplier"]
            isOneToOne: false
            referencedRelation: "Supplier"
            referencedColumns: ["idSupplier"]
          }
        ]
      }
      DetailPembelian: {
        Row: {
          idPembelian: string
          idProduk: string
          jumlah: number
          subtotal: number
        }
        Insert: {
          idPembelian: string
          idProduk: string
          jumlah: number
          subtotal?: number
        }
        Update: {
          idPembelian?: string
          idProduk?: string
          jumlah?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "DetailPembelian_idPembelian_fkey"
            columns: ["idPembelian"]
            isOneToOne: false
            referencedRelation: "Pembelian"
            referencedColumns: ["idPembelian"]
          },
          {
            foreignKeyName: "DetailPembelian_idProduk_fkey"
            columns: ["idProduk"]
            isOneToOne: false
            referencedRelation: "Produk"
            referencedColumns: ["idProduk"]
          }
        ]
      }
      TransaksiPenjualan: {
        Row: {
          idTransaksi: string
          tanggalTransaksi: string
          total: number
        }
        Insert: {
          idTransaksi: string
          tanggalTransaksi?: string
          total?: number
        }
        Update: {
          idTransaksi?: string
          tanggalTransaksi?: string
          total?: number
        }
        Relationships: []
      }
      DetailPenjualan: {
        Row: {
          idTransaksi: string
          idProduk: string
          jumlah: number
          subtotal: number
        }
        Insert: {
          idTransaksi: string
          idProduk: string
          jumlah: number
          subtotal?: number
        }
        Update: {
          idTransaksi?: string
          idProduk?: string
          jumlah?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "DetailPenjualan_idTransaksi_fkey"
            columns: ["idTransaksi"]
            isOneToOne: false
            referencedRelation: "TransaksiPenjualan"
            referencedColumns: ["idTransaksi"]
          },
          {
            foreignKeyName: "DetailPenjualan_idProduk_fkey"
            columns: ["idProduk"]
            isOneToOne: false
            referencedRelation: "Produk"
            referencedColumns: ["idProduk"]
          }
        ]
      }
      Pembayaran: {
        Row: {
          idPembayaran: string
          idTransaksi: string
          metode: "Tunai" | "Transfer" | "QRIS"
          status: "Lunas" | "Pending"
        }
        Insert: {
          idPembayaran: string
          idTransaksi: string
          metode: "Tunai" | "Transfer" | "QRIS"
          status: "Lunas" | "Pending"
        }
        Update: {
          idPembayaran?: string
          idTransaksi?: string
          metode?: "Tunai" | "Transfer" | "QRIS"
          status?: "Lunas" | "Pending"
        }
        Relationships: [
          {
            foreignKeyName: "Pembayaran_idTransaksi_fkey"
            columns: ["idTransaksi"]
            isOneToOne: false
            referencedRelation: "TransaksiPenjualan"
            referencedColumns: ["idTransaksi"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
