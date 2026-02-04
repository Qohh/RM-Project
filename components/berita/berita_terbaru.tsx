import Image from "next/image"
import Link from "next/link"

type Berita = {
  id: number
  judul: string
  image: string
  tanggal: string
}

type Props = {
  item: Berita
  variant?: "small" | "large"
  layout?: "row" | "col"
}

export default function BeritaTerbaru({
  item,
  variant = "small",
  layout = "row",
}: Props) {
  return (
    <Link href={`/berita/${item.id}`}>
      <div
        className={`
          border rounded-xl hover:bg-muted transition cursor-pointer
          ${layout === "row" ? "flex gap-3" : "flex flex-col"}
          ${variant === "large" ? "p-4 gap-4" : "p-3"}
        `}
      >
        {/* GAMBAR */}
        <div
          className={`relative shrink-0 rounded-lg overflow-hidden
            ${layout === "col"
              ? "w-full h-40"
              : variant === "large"
                ? "w-32 h-24"
                : "w-20 h-16"}
          `}
        >
          <Image
            src={item.image}
            alt={item.judul}
            fill
            className="object-contain"
          />
        </div>

        {/* TEKS */}
        <div className={`text-sm ${layout === "col" ? "space-y-1" : ""}`}>
          <p className="font-semibold line-clamp-2">
            {item.judul}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.tanggal}
          </p>

          {variant === "large" && (
            <span className="inline-block text-primary text-sm font-medium mt-1">
              Lihat detail →
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
