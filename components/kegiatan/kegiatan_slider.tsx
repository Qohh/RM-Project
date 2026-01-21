"use client"

import { useState } from "react"
import KegiatanCard from "./kegiatan_card"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Kegiatan = {
  judul: string
  deskripsi: string
  tanggal: string
  image: string
}

type Props = {
  data: Kegiatan[]
}

export default function KegiatanSlider({ data }: Props) {
  const [index, setIndex] = useState(0)
  const total = data.length

  const prev = () => setIndex((i) => i - 1)
  const next = () => setIndex((i) => i + 1)

  const getItem = (i: number) => {
    return data[(i + total) % total]
  }

  return (
  <div className="relative flex items-center justify-center h-[420px] overflow-hidden">

  {[index - 1, index, index + 1].map((i, pos) => {
    const isCenter = pos === 1

    return (
      <div
        key={i}
        className={`
          absolute transition-all duration-500 ease-in-out
          ${isCenter ? "z-10" : "z-0"}
        `}
        style={{
          transform: `
            translateX(${(pos - 1) * 260}px)
            scale(${isCenter ? 1 : 0.9})
          `,
          opacity: isCenter ? 1 : 0.4,
          filter: isCenter ? "none" : "blur(1px)",
        }}
      >
      </div>
    )
  })}

  {/* navigasi */}
  <button
    onClick={prev}
    className="absolute left-4 z-20 bg-white shadow p-2 rounded-full"
  >
    <ChevronLeft />
  </button>

  <button
    onClick={next}
    className="absolute right-4 z-20 bg-white shadow p-2 rounded-full"
  >
    <ChevronRight />
  </button>

</div>

  )
}
