"use client"

import { useEffect, useState } from "react"
import { Users, Newspaper, Calendar } from "lucide-react"
import StatCard from "@/components/StatCard"
import { supabase } from "@/lib/supabase"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]

function getYAxisTicks(max: number): number[] {
  if (max <= 10)  return [0,1,2,3,4,5,6,7,8,9,10]
  if (max <= 50)  return [0,5,10,15,20,25,30,35,40,45,50]
  if (max <= 100) return [0,10,20,30,40,50,60,70,80,90,100]
  return [0,50,100,150,200,250,300,350,400,450,500]
}

export default function Dashboard() {
  const [beritaCount, setBeritaCount]     = useState(0)
  const [kegiatanCount, setKegiatanCount] = useState(0)
  const [pengurusCount, setPengurusCount] = useState(0)

  const [chartData, setChartData]         = useState<any[]>([])
  const [dataType, setDataType]           = useState<"berita" | "kegiatan">("berita")
  const [viewMode, setViewMode]           = useState<"bulanan" | "tahunan">("bulanan")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear())

  const fetchChartData = async () => {
    let raw: any[] = []
    if (dataType === "berita") {
      const res = await supabase.from("berita").select("tanggal").eq("status", "publish")
      if (res.error) return console.error(res.error)
      raw = res.data || []
    } else {
      const res = await supabase.from("kegiatan").select("tanggal_mulai").eq("status", "publish")
      if (res.error) return console.error(res.error)
      raw = (res.data || []).map((item: any) => ({ tanggal: item.tanggal_mulai }))
    }

    if (viewMode === "bulanan") {
      const grouped: Record<string, number> = {}
      raw.forEach((item: any) => {
        const date = new Date(item.tanggal)
        if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
          const day = date.getDate()
          const week = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : day <= 28 ? 4 : 5
          const label = `Pekan ${week}`
          grouped[label] = (grouped[label] || 0) + 1
        }
      })
      const labels = ["Pekan 1", "Pekan 2", "Pekan 3", "Pekan 4", "Pekan 5"]
      setChartData(labels.map((label) => ({ name: label, total: grouped[label] || 0 })))
    } else {
      const grouped: Record<number, number> = {}
      raw.forEach((item: any) => {
        const date = new Date(item.tanggal)
        if (date.getFullYear() === selectedYear) {
          const month = date.getMonth()
          grouped[month] = (grouped[month] || 0) + 1
        }
      })
      setChartData(BULAN.map((label, i) => ({ name: label, total: grouped[i] || 0 })))
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      const { count: berita }   = await supabase.from("berita").select("*", { count: "exact", head: true }).eq("status", "publish")
      const { count: kegiatan } = await supabase.from("kegiatan").select("*", { count: "exact", head: true }).eq("status", "publish")
      const { count: pengurus } = await supabase.from("pengurus").select("*", { count: "exact", head: true })
      setBeritaCount(berita ?? 0)
      setKegiatanCount(kegiatan ?? 0)
      setPengurusCount(pengurus ?? 0)
    }
    fetchStats()
  }, [])

  useEffect(() => {
    fetchChartData()
  }, [dataType, viewMode, selectedMonth, selectedYear])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-blue-500">total: {payload[0].value}</p>
      </div>
    )
  }

  const maxVal = Math.ceil(Math.max(...chartData.map((d) => d.total), 0))
  const yTicks = getYAxisTicks(maxVal)

  const chartTitle = viewMode === "bulanan"
    ? `${dataType === "berita" ? "Berita" : "Kegiatan"} — ${BULAN[selectedMonth]} ${selectedYear}`
    : `${dataType === "berita" ? "Berita" : "Kegiatan"} — Tahun ${selectedYear}`

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Pantau data dan aktivitas organisasi untuk mendukung pengelolaan yang lebih baik.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Berita Dipublikasikan" value={beritaCount} icon={<Newspaper className="w-5 h-5" />} change="Data terbaru" color="blue" />
        <StatCard title="Total Kegiatan Dipublikasikan" value={kegiatanCount} icon={<Calendar className="w-5 h-5" />} change="Data terbaru" color="green" />
        <StatCard title="Total Pengurus Harian" value={pengurusCount} icon={<Users className="w-5 h-5" />} change="Data terbaru" color="purple" />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none" />

        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="font-semibold text-lg">📊 Grafik {chartTitle}</h2>

          <div className="flex flex-wrap gap-2">
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as any)}
              className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
            >
              <option value="berita">Berita</option>
              <option value="kegiatan">Kegiatan</option>
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
            >
              <option value="bulanan">Per Bulan</option>
              <option value="tahunan">Per Tahun</option>
            </select>

            {viewMode === "bulanan" && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
              >
                {BULAN.map((b, i) => (
                  <option key={i} value={i}>{b}</option>
                ))}
              </select>
            )}

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} tickMargin={10} />
              <YAxis
                tick={{ fontSize: 10 }}
                width={30}
                tickMargin={10}
                allowDecimals={false}
                domain={[0, yTicks[yTicks.length - 1]]}
                ticks={yTicks}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-sm text-gray-400 mt-2">
          Data berdasarkan tanggal publish
        </p>
      </div>
    </div>
  )
}