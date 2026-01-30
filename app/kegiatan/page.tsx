"use client"

import { useState } from "react"
import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/kegiatan/kegiatan_slider"
import { kegiatan } from "@/data/kegiatan"

export default function KegiatanPage() {
  const [search, setSearch] = useState("")

  const filteredKegiatan = kegiatan.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-10 py-5 space-y-14">

      {/* Semua Kegiatan */}
      <section>
        <h1 className="text-2xl font-bold mb-5 text-center text-primary">
          SEMUA KEGIATAN
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Cari kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-primary rounded-3xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
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
      </section>

    </div>
  )
}
