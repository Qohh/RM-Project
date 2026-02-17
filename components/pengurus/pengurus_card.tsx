"use client"

import Image from "next/image"
import Footer from "../footer"

type Anggota = {
  jabatan?: string
  nama: string
  angkatan?: string
  foto?: string
  riwayat?: string[]
}

type Bidang = {
  bidang: string
  anggota: Anggota[]
}

type Props = {
  data: Bidang[]
}

export default function PengurusSection({ data }: Props) {
  return (
    <div className="space-y-16">
    {data.map((item, index) => (
    <div
        key={index}
        className={`space-y-10 pb-20 ${
        index !== data.length - 1 ? "border-b border-gray-300" : ""
        }`}
    >

          {/* Judul Bidang */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-primary">
            {item.bidang}
          </h2>

          {/* Grid 2 per baris */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 max-w-5xl mx-auto">
            {item.anggota.map((anggota, i) => (
              <div
                key={i}
                className="group relative flex items-start gap-5 bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >

                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
        
                {/* FOTO (Persegi) */}
                <div className="relative w-28 h-28 shrink-0">
                  {anggota.foto ? (
                    <Image
                      src={anggota.foto}
                      alt={anggota.nama}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 flex items-center justify-center text-lg md:text-2xl font-bold text-primary rounded-md">
                      {anggota.nama.charAt(0)}
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex flex-col h-full">
                  <h3 className="text-lg md:text-2xl font-bold">
                    {anggota.nama}
                  </h3>

                    <p
                    className={`${
                        ["Ketua", "Ketua Umum", "Sekretaris Umum", "Bendahara Umum 1", "Bendahara Umum 2"].includes(anggota.jabatan || "")
                        ? "text-primary text-sm md:text-lg font-bold tracking-wide"
                        : "text-gray-600 text-sm md:text-base"
                    }`}
                    >
                    {anggota.jabatan || "Anggota"}
                    </p>

                    <div className="flex-grow" />

                    {anggota.angkatan && (
                    <div className="flex items-center gap-1 mt-2 text-base text-primary-dark">
                        <p>Angkatan</p>
                        <p className="font-bold">{anggota.angkatan}</p>
                    </div>
                    )}
                </div>

                {/* Hover Detail Card */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-full bg-white border rounded-xl shadow-xl p-5 
                opacity-0 invisible translate-y-4 
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
                transition-all duration-300 z-50">

                <h4 className="font-bold text-lg text-primary mb-2">
                    Riwayat Kepanitiaan
                </h4>

                {anggota.riwayat && anggota.riwayat.length > 0 ? (
                    <ul className="space-y-1 text-xs md:text-sm text-gray-700 list-disc list-inside">
                    {anggota.riwayat.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">
                    Belum ada riwayat kepanitiaan
                    </p>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
    
  )
}
