
import Link from "next/link"
import { CalendarDays } from "lucide-react"

type Kegiatan = {
  id: string
  judul: string
  gambar: string[]
  tanggal: string
}

type Props = {
  item: Kegiatan
  variant?: "small" | "large"
}

export default function KegiatanTerbaru({ item, variant = "small" }: Props) {

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

  // Parse gambar
  let gambar: string[] = []
  try {
    gambar = Array.isArray(item.gambar)
      ? item.gambar
      : JSON.parse(item.gambar as any)
  } catch {
    gambar = item.gambar ? [item.gambar as any] : []
  }

return (
    <Link href={`/kegiatan/${item.id}`} className="block group">
      <div className={`border rounded-xl p-3 transition hover:bg-muted
        ${variant === "large" ? "flex flex-col h-full" : "space-y-3"}`}>

        {/* GAMBAR + OVERLAY HOVER */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={gambar[0] || "/placeholder.png"}
            alt={item.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {/* Overlay "Lihat selengkapnya" */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-primary text-white text-xs px-3 py-1.5 rounded-md font-medium">
              Lihat selengkapnya
            </span>
          </div>
        </div>

        {/* TANGGAL + STATUS */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
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
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            status === "upcoming"
              ? "bg-yellow-100 text-yellow-700"
              : status === "ongoing"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {status === "upcoming" ? "Upcoming" : status === "ongoing" ? "Ongoing" : "Selesai"}
          </span>
        </div>

        {/* JUDUL */}
        <div className={variant === "large" ? "flex-1 mt-2" : "mt-2"}>
          <p className="font-semibold text-sm line-clamp-3 leading-snug group-hover:text-primary transition">
            {item.judul}
          </p>
        </div>

        {/* CTA — hanya variant large */}
        {variant === "large" && (
          <span className="text-primary text-sm font-medium hover:underline mt-3 block">
            Lihat detail →
          </span>
        )}

      </div>
    </Link>
  )
}