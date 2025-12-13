"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#64748b", // Slate
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CategoryPie({ data }: { data: any[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="col-span-3 flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle>Penjualan per Kategori</CardTitle>
                <CardDescription>Distribusi pendapatan berdasarkan kategori produk.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="flex flex-col gap-4 py-6">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}
                                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {data.map((item: any, index: number) => {
                                const percentage = ((item.value / total) * 100).toFixed(1)
                                return (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full shrink-0"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="font-medium text-foreground">{item.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end text-right">
                                            <span className="font-semibold">
                                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.value)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{percentage}%</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
