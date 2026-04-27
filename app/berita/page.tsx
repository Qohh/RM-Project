"use client"

import { useState } from "react"
import BeritaCard from "@/components/berita/berita_card"
import { Search, Newspaper } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Berita = {
  id: number
  judul: string
  tanggal: string
  gambar: string[]
  kategori?: {
    nama: string
  }
}

export default function BeritaPage() {
  const [search, setSearch] = useState("")
  const [dataBerita, setDataBerita] = useState<Berita[]>([])

  const [kategoriList, setKategoriList] = useState<string[]>([])
  const [selectedKategori, setSelectedKategori] = useState("all")

  const filteredBerita = dataBerita.filter((item) => {
    const matchSearch = item.judul
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchKategori =
      selectedKategori === "all" ||
      item.kategori?.nama === selectedKategori

    return matchSearch && matchKategori
  })
  
  useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
  .from("berita")
  .select(`
    *,
    kategori(nama)
  `)
  .eq("status", "publish") 
  .order("tanggal", { ascending: false })

    if (error) {
      console.error("Error:", error)
    } else {
      console.log("RAW DATA:", data)
      setDataBerita(data)

    const kategoriUnik = [
      "all",
      ...new Set(data.map((item: any) => item.kategori?.nama))
    ]

    setKategoriList(kategoriUnik)  
    }
  }

  fetchData()
}, [])



  return (
    <div className="max-w-7xl mx-auto mt-24 p-5 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex flex-col ml-5">
      <h1 className="text-2xl md:text-4xl font-bold text-primary text-left mb-1">
        SEMUA BERITA
      </h1>
      <span className="flex flex-row gap-2 text-xs md:text-base text-muted-foreground items-center ">
        <Newspaper className="w-3 md:w-5 h-3 md:h-5"/>
        {filteredBerita.length} berita tersedia
      </span>
      </div>
      
      <div className="flex gap-3 w-full md:max-w-md md:pr-5">
        <Select
          value={selectedKategori}
          onValueChange={(value) => setSelectedKategori(value)}
        >
          <SelectTrigger className="w-[180px] md:w-[220px] border-primary">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>

          <SelectContent>
            {kategoriList.map((kat) => (
              <SelectItem key={kat} value={kat}>
                {kat === "all" ? "Semua Kategori" : kat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
  <input
    type="text"
    placeholder="Cari berita..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      border border-primary
      rounded-xl md:rounded-2xl
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
        {filteredBerita.length > 0 ? (
          filteredBerita.map((item) => (
            <BeritaCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              tanggal={item.tanggal}
              kategori={item.kategori?.nama || "-"}
              image={item.gambar?.[0]}
            />
          ))
        ) : (
          <p className="col-span-2 lg:col-span-4 text-center text-gray-500 italic">
            Tidak ada berita ditemukan
          </p>
        )}
        </div>
    </div>
  )
}
