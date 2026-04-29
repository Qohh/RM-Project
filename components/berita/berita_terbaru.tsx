import Image from "next/image"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

type Berita = {
  id: number
  judul: string
  gambar: string[]
  tanggal: string
  konten: string
  kategori?: {
    nama: string
  }
}

type Props = {
  item: Berita
  variant?: "small" | "large"
}

export default function BeritaTerbaru({
  item,
  variant = "small",
}: Props) {
  return (
    <Link href={`/berita/${item.id}`} className="block group">
      <div className="border rounded-xl p-3 space-y-3 transition hover:bg-muted">

        {/* 🖼️ GAMBAR */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.gambar?.[0] || "/placeholder.png"}
            alt={item.judul}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        </div>

        {/* 📅 + 🏷️ */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">

          {/* tanggal */}
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <span>{item.tanggal}</span>
          </div>

          {/* kategori */}
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {item.kategori?.nama || "Umum"}
          </span>
        </div>

        {/* 📰 JUDUL */}
        <p className="font-semibold text-sm line-clamp-3 leading-snug group-hover:text-primary transition">
          {item.judul}
        </p>

        {/* 📄 KONTEN (optional untuk large) */}
        {variant === "large" && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.konten}
          </p>
        )}

        {/* 👉 CTA */}
        {variant === "large" && (
          <span className="text-primary text-sm font-medium hover:underline">
            Lihat detail →
          </span>
        )}

      </div>
    </Link>
  )
}