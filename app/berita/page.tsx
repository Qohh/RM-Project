"use client"

import { useState } from "react"
import BeritaCard from "@/components/berita/berita_card"
import { Search, Newspaper } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

export default function BeritaPage() {
  const [search, setSearch] = useState("")
  const [dataBerita, setDataBerita] = useState<any[]>([])

  const filteredBerita = dataBerita.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  )
  
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
      setDataBerita(data)
    }
  }

  fetchData()
}, [])

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-5">
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
      
      <div className="relative w-2/3 md:w-full md:max-w-md md:mx-0 pl-5 md:pl-0 md:pr-5">
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
            absolute right-4 md:right-8 top-1/2 -translate-y-1/2
            w-5 h-5
            text-muted-foreground
            pointer-events-none
          "
        />
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
              kategori={item.kategori?.nama}
              image={item.gambar}
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
