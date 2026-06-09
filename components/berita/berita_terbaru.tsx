
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

export default function BeritaTerbaru({ item, variant = "small" }: Props) {
  return (
    <Link href={`/berita/${item.id}`} className="block group">
      <div className={`border rounded-xl p-3 transition hover:bg-muted
        ${variant === "large" ? "flex flex-col h-full" : "space-y-3"}`}>

        {/* GAMBAR */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={item.gambar[0] || "/placeholder.png"}
            alt={item.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* TANGGAL + KATEGORI */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <span>
              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {item.kategori?.nama || "Umum"}
          </span>
        </div>

        {/* JUDUL */}
        <div className={variant === "large" ? "flex-1 mt-2" : "mt-2"}>
          <p className="font-semibold text-sm line-clamp-3 leading-snug group-hover:text-primary transition">
            {item.judul}
          </p>
        </div>

        {/* CTA — hanya large */}
        {variant === "large" && (
          <span className="text-primary text-sm font-medium hover:underline mt-3 block">
            Lihat detail →
          </span>
        )}

      </div>
    </Link>
  )
}