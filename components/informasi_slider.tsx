"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  "/kegiatan/isra-miraj.jpeg",
  "/kegiatan/OLT1.jpeg",
  "/kegiatan/RM-GTS-SMAN3.jpeg",
]

export default function InformasiSlider() {
  // index gambar yg jadi TENGAH
  const [active, setActive] = useState(1)

  const next = () => {
    setActive((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setActive((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  // nentuin posisi tiap gambar
  const getPositionClass = (index: number) => {
    const pos = (index - active + images.length) % images.length

    switch (pos) {
      case 0: // KIRI
        return "translate-x-[-35%] scale-90 z-10 opacity-80"
      case 1: // TENGAH
        return "translate-x-0 scale-100 z-20 opacity-100"
      case 2: // KANAN
        return "translate-x-[35%] scale-90 z-10 opacity-80"
      default:
        return "opacity-0"
    }
  }

  return (
    <div className="relative h-80 flex items-center justify-center overflow-hidden">
      {/* SLIDES */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-700 ease-in-out
                      ${getPositionClass(i)}`}
        >
          <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={src}
              alt={`info-${i}`}
              fill
              className="object-cover"
            />
              {((i - active + images.length) % images.length !== 1) && (
              <div className="absolute inset-0 bg-black/40" />
            )}
          </div>
        </div>
      ))}

      {/* TOMBOL KIRI */}
      <button
        onClick={prev}
        className="absolute left-[22%] z-30
                   bg-white/80 hover:bg-white
                   rounded-full p-2 shadow"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* TOMBOL KANAN */}
      <button
        onClick={next}
        className="absolute right-[22%] z-30
                   bg-white/80 hover:bg-white
                   rounded-full p-2 shadow"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
