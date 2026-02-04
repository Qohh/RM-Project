"use client"

import { useState } from "react"
import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import { kegiatan } from "@/data/kegiatan"
import { Search, Newspaper } from "lucide-react"

export default function KegiatanPage() {
  const [search, setSearch] = useState("")

  const filteredKegiatan = kegiatan.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-5">
      <div className="flex items-center justify-between">
      <div className="flex flex-col ml-5">
      <h1 className="text-4xl font-bold text-primary text-left mb-1">
        SEMUA KEGIATAN
      </h1>
      <span className="flex flex-row gap-2 text-base text-muted-foreground items-center">
        <Newspaper className="w-5 h-5"/>
        {filteredKegiatan.length} berita tersedia
      </span>
      </div>
      
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Cari berita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            border border-primary
            rounded-2xl
            pl-4 pr-12
            py-2
            outline-none
            focus:ring-2 focus:ring-primary
          "
        />
        <Search
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            w-5 h-5
            text-muted-foreground
            pointer-events-none
          "
        />
      </div>
    </div>


        <div className="grid grid-cols-4 gap-6">
        {filteredKegiatan.length > 0 ? (
          filteredKegiatan.map((item) => (
            <KegiatanCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              deskripsi={item.deskripsi}
              tanggal={item.tanggal}
              image={item.image}
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500 italic">
            Tidak ada kegiatan ditemukan
          </p>
        )}
        </div>
    </div>
  )
}
