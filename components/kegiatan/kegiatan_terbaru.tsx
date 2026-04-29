import Image from "next/image"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

type Kegiatan = {
  id: string
  judul: string
  gambar: string[]
  tanggal: string
  deskripsi: string
}

type Props = {
  item: Kegiatan
  variant?: "small" | "large"
}

export default function KegiatanTerbaru({
  item,
  variant = "small",
}: Props) {

  // 🔥 STATUS OTOMATIS
  const getStatus = (tanggal: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tgl = new Date(tanggal)
    tgl.setHours(0, 0, 0, 0)

    if (tgl > today) return "upcoming"
    if (tgl.getTime() === today.getTime()) return "ongoing"
    return "selesai"
  }

  const status = getStatus(item.tanggal)

  return (
    <Link href={`/kegiatan/${item.id}`} className="block group">
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

        {/* 📅 + STATUS */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">

          {/* tanggal */}
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <span>
              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* status */}
          <span
            className={`
              px-2 py-0.5 rounded-full text-xs
              ${
                status === "upcoming"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "ongoing"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            {status === "upcoming"
              ? "Upcoming"
              : status === "ongoing"
              ? "Ongoing"
              : "Selesai"}
          </span>
        </div>

        {/* 📰 JUDUL */}
        <p className="font-semibold text-sm line-clamp-3 leading-snug group-hover:text-primary transition">
          {item.judul}
        </p>

        {/* 📄 DESKRIPSI (optional) */}
        {variant === "large" && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.deskripsi}
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