"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExportButton({ data, filename = "laporan.xlsx" }: { data: any[], filename?: string }) {
    const handleExport = () => {
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, ws, "Laporan")
        XLSX.writeFile(wb, filename)
    }

    return (
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
        </Button>
    )
}
