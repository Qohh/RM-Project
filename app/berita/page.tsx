"use client"

import { useState } from "react"
import BeritaCard from "@/components/berita/berita_card"
import { berita } from "@/data/berita"
import { Search, Newspaper } from "lucide-react"

export default function BeritaPage() {
  const [search, setSearch] = useState("")

  const filteredBerita = berita.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  )

  return (
  <div className="max-w-7xl mx-auto px-5 py-5 space-y-5">
    <div className="flex items-center justify-between">
      <div className="flex flex-col ml-5">
      <h1 className="text-4xl font-bold text-primary text-left mb-1">
        SEMUA BERITA
      </h1>
      <span className="flex flex-row gap-2 text-base text-muted-foreground items-center">
        <Newspaper className="w-5 h-5"/>
        {filteredBerita.length} berita tersedia
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

    <div className="grid grid-cols-3 gap-6">
      {filteredBerita.length > 0 ? (
        filteredBerita.map((item) => (
          <BeritaCard
            key={item.id}
            id={item.id}
            judul={item.judul}
            tanggal={item.tanggal}
            image={item.image}
          />
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500 italic">
          Tidak ada berita ditemukan
        </p>
      )}
    </div>

  </div>
)
}
