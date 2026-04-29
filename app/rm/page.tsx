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


export default function Dashboard() {
  const [beritaCount, setBeritaCount] = useState(0)
  const [kegiatanCount, setKegiatanCount] = useState(0)
  const [pengurusCount, setPengurusCount] = useState(0)

  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"berita" | "kegiatan" | "pengunjung">("berita")
  const [timeFilter, setTimeFilter] = useState<"minggu" | "bulan" | "tahun">("bulan")

  const fetchChartData = async (type: string) => {
  if (type === "pengunjung") {
    setChartData([
      { name: "Sen", total: 0 },
      { name: "Sel", total: 0 },
      { name: "Rab", total: 0 },
      { name: "Kam", total: 0 },
      { name: "Jum", total: 0 },
      { name: "Sab", total: 0 },
      { name: "Min", total: 0 },
    ])
    return
  }

  const now = new Date()

  const { data, error } = await supabase
    .from(type)
    .select("tanggal")

  if (error) return console.error(error)

  let grouped: Record<string, number> = {}

  data.forEach((item: any) => {
    const date = new Date(item.tanggal)

    // 🔥 FILTER BERDASARKAN WAKTU
    if (timeFilter === "minggu") {
      // hanya minggu ini
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay() + 1)

      if (date < start) return

      const hari = date.toLocaleString("id-ID", { weekday: "short" })
      grouped[hari] = (grouped[hari] || 0) + 1
    }

    if (timeFilter === "bulan") {
  if (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    const day = date.getDate()

    let week = 1
    if (day <= 7) week = 1
    else if (day <= 14) week = 2
    else if (day <= 21) week = 3
    else if (day <= 28) week = 4
    else week = 5

    const label = `Pekan ${week}`
    grouped[label] = (grouped[label] || 0) + 1
  }
}

    if (timeFilter === "tahun") {
      // hanya tahun ini
      if (date.getFullYear() !== now.getFullYear()) return

      const bulan = date.toLocaleString("id-ID", { month: "short" })
      grouped[bulan] = (grouped[bulan] || 0) + 1
    }
  })

  let labels: string[] = []

  if (timeFilter === "minggu") {
    labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
  }

  if (timeFilter === "bulan") {
  labels = ["Pekan 1", "Pekan 2", "Pekan 3", "Pekan 4", "Pekan 5"]
}

  if (timeFilter === "tahun") {
    labels = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
  }

  const formatted = labels.map((label) => ({
    name: label,
    total: grouped[label] || 0, // 🔥 kalau kosong jadi 0
  }))

  setChartData(formatted)
}

  useEffect(() => {
    const fetchData = async () => {
      const { count: berita } = await supabase
        .from("berita")
        .select("*", { count: "exact", head: true })

      const { count: kegiatan } = await supabase
        .from("kegiatan")
        .select("*", { count: "exact", head: true })

      const { count: pengurus } = await supabase
        .from("pengurus")
        .select("*", { count: "exact", head: true })

      setBeritaCount(berita ?? 0)
      setKegiatanCount(kegiatan ?? 0)
      setPengurusCount(pengurus ?? 0)
    }

    fetchData()
  }, [])

useEffect(() => {
  fetchChartData(chartType)
}, [chartType, timeFilter])

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white border rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-blue-500">
        total: {payload[0].value}
      </p>
    </div>
  )
}

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Pantau data dan aktivitas organisasi untuk mendukung pengelolaan yang lebih baik.
        </p>
      </div>

      {/* Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Total Berita Dipublikasikan" 
          value={beritaCount}
          icon={<Newspaper className="w-5 h-5" />} 
          change="Data terbaru"
          color="blue"
        />
        <StatCard 
          title="Total Kegiatan Dipublikasikan" 
          value={kegiatanCount}
          icon={<Calendar className="w-5 h-5" />} 
          change="Data terbaru"
          color="green"
        />
        <StatCard 
          title="Total Pengurus Harian" 
          value={pengurusCount}
          icon={<Users className="w-5 h-5" />} 
          change="Data terbaru"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

{/* 🔥 KIRI (Grafik) */}
<div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">

  {/* efek background */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg flex items-center gap-2 capitalize">
      📊 Grafik {chartType} ({timeFilter})
    </h2>

    <div className="flex gap-2">
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value as any)}
        className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
      >
        <option value="berita">Berita</option>
        <option value="kegiatan">Kegiatan</option>
        <option value="pengunjung">Pengunjung</option>
      </select>

      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value as any)}
        className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-1 text-sm"
      >
        <option value="minggu">Minggu ini</option>
        <option value="bulan">Bulan ini</option>
        <option value="tahun">Tahun ini</option>
      </select>
    </div>
  </div>

  {/* Grafik */}
  <div className="h-48 flex justify-center">
    <div className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
  data={chartData} 
  margin={{ top: 30, right: 30, left: 10, bottom: 0 }}
>

  {/* 🔥 GRID (garis-garis) */}
  <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />

  {/* 🔥 X */}
  <XAxis 
    dataKey="name"
    tick={{ fontSize: 10 }}
    interval={0}
    tickMargin={10}
  />

  {/* 🔥 Y (angka samping) */}
  <YAxis 
    tick={{ fontSize: 10 }}
    tickCount={11}
    width={30}
    tickMargin={10}
    allowDecimals={false}
  />

  {/* 🔥 TOOLTIP */}
  <Tooltip content={<CustomTooltip />} />

  {/* 🔥 LINE */}
  <Line
  type="monotone"
  dataKey="total"
  stroke="#3b82f6"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 6 }}
  
/>
</LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Tahun */}
  <p className="text-center text-sm text-gray-400 mt-2">
    Tahun {new Date().getFullYear()}
  </p>
</div>

  {/* 🔥 KANAN */}
  <div className="bg-white p-5 rounded-2xl shadow-sm">
    <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>

    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span>Tambah berita baru</span>
        <span className="text-gray-400">2 menit lalu</span>
      </div>

      <div className="flex justify-between">
        <span>Edit kegiatan</span>
        <span className="text-gray-400">10 menit lalu</span>
      </div>

      <div className="flex justify-between">
        <span>Tambah pengurus</span>
        <span className="text-gray-400">1 jam lalu</span>
      </div>
    </div>
  </div>

</div>

    </div>
  )
}