import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Kegiatan = {
  id: number
  judul: string
  image: string
  tanggal: string
}

type Props = {
  item: Kegiatan
  variant?: "small" | "large"
  layout?: "row" | "col"
}

export default function KegiatanTerbaru({
  item,
  variant = "small",
  layout = "row",
}: Props) {
  return (
    <Link
      href={`/kegiatan/${item.id}`}
      className="block group"
    >
      <div
        className={`
          border rounded-xl hover:bg-muted transition
          ${layout === "row" ? "flex gap-3" : "flex flex-col"}
          ${variant === "large" ? "p-4 gap-4": "p-3"}
        `}
      >
        {/* GAMBAR */}
        <div
          className={`relative shrink-0 rounded-lg overflow-hidden aspect-square
            ${layout === "col"
              ? "w-full"
              : variant === "large"
                ? "w-32"
                : "w-20"}
          `}
        >
          <Image
            src={item.image}
            alt={item.judul}
            fill
            className="object-cover"
          />
        </div>

        {/* TEKS */}
        <div className={`text-sm ${layout === "col" ? "space-y-1" : ""}`}>
          <p className="font-semibold line-clamp-2">
            {item.judul}
          </p>
          
          
          <p className="flex text-xs text-muted-foreground items-center gap-1">
            <Calendar className="w-4 h-4"/>
            {item.tanggal}
          </p>

          <Link href={`/kegiatan/${item.id}`}>
          {variant === "large" && (
            <span className="inline-block text-primary text-sm font-medium mt-1 cursor-pointer hover:underline">
              Lihat detail →
            </span>
          )}
          </Link>
      </div>
      </div>
      </Link>
  )
}
