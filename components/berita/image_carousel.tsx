"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  images: string[]
  alt: string
}

export default function ImageCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length)
  const next = () => setCurrent((i) => (i + 1) % images.length)

  return (
    <div className="relative h-[200px] md:h-[400px] select-none">
      <img
        src={images[current]}
        alt={`${alt} ${current + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />

      {images.length > 1 && (
        <>
          {/* Tombol kiri */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tombol kanan */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Gambar ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  )
}