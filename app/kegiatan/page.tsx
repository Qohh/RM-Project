"use client"

import { useState } from "react"
import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import { Search, CalendarDays } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function KegiatanPage() {
  const [search, setSearch] = useState("")
  const [dataKegiatan, setDataKegiatan] = useState<any[]>([])

  const [filterStatus, setFilterStatus] = useState("all")

const filteredKegiatan = dataKegiatan.filter((item) => {
  const matchSearch = item.judul
    .toLowerCase()
    .includes(search.toLowerCase())

  const now = new Date()

  const start = new Date(`${item.tanggal_mulai}T${item.waktu_mulai}`)
  const end = new Date(`${item.tanggal_selesai}T${item.waktu_selesai}`)

  let matchStatus = true

  if (filterStatus === "upcoming") {
    matchStatus = now < start
  } else if (filterStatus === "ongoing") {
    matchStatus = now >= start && now <= end
  } else if (filterStatus === "selesai") {
    matchStatus = now > end
  }

  return matchSearch && matchStatus
})
  
  useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .eq("status", "publish") 
      .order("tanggal_mulai", { ascending: false })

    if (error) {
      console.error("Error:", error)
    } else {
      setDataKegiatan(data)
    }
  }

  fetchData()
}, [])

  return (
    <div className="max-w-7xl mx-auto mt-24 p-5 space-y-5 ml-5">
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex flex-col">
      <h1 className="text-2xl md:text-4xl font-bold text-primary text-left mb-1">
        SEMUA KEGIATAN
      </h1>
      <span className="flex flex-row gap-2 text-xs md:text-base text-muted-foreground items-center ">
        <CalendarDays className="w-3 md:w-5 h-3 md:h-5"/>
        {filteredKegiatan.length} kegiatan tersedia
      </span>
      </div>
      
      <div className="flex gap-3 w-full md:max-w-md md:pr-5">
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
        >
          <SelectTrigger className="h-10 w-[140px] md:w-[160px] border border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
  <input
    type="text"
    placeholder="Cari kegiatan..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      h-10
      border border-primary
      rounded-xl
      pl-4 pr-12
      py-1 md:p-3
      outline-none
      focus:ring-2 focus:ring-primary
    "
  />
  <Search
    className="
      absolute right-4 top-1/2 -translate-y-1/2
      w-5 h-5
      text-muted-foreground
    "
  />
</div>
      </div>
    </div>


<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredKegiatan.length > 0 ? (
          filteredKegiatan.map((item) => (
            <KegiatanCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              deskripsi={item.deskripsi}
                tanggalMulai={item.tanggal_mulai}
                waktuMulai={item.waktu_mulai}
                tanggalSelesai={item.tanggal_selesai}
                waktuSelesai={item.waktu_selesai}
              image={item.gambar?.[0]}
            />
          ))
        ) : (
          <p className="col-span-2 lg:col-span-4 text-center text-gray-500 italic">
            Tidak ada kegiatan ditemukan
          </p>
        )}
        </div>
    </div>
  )
}
