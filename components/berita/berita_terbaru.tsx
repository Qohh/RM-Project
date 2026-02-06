import Image from "next/image"
import Link from "next/link"

type Berita = {
  id: number
  judul: string
  image: string
  tanggal: string
  konten: string
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

      <div
        className={`
          border rounded-xl hover:bg-muted transition 
          ${layout === "row" ? "flex gap-3" : "flex flex-col"}
          ${variant === "large" ? "p-4 gap-4" : "p-3"}
        `}
      >
        {/* GAMBAR */}
        <div
          className={`relative shrink-0 rounded-lg overflow-hidden aspect-video
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
<div className={`text-sm ${layout === "col" ? "space-y-2" : "space-y-1"}`}>

  
  <p className="text-xs text-muted-foreground">
    {item.tanggal}
  </p>
  <p className="font-semibold line-clamp-4">
    {item.judul}
  </p>
  
  {variant === "large" && (
    <p className="text-sm text-muted-foreground line-clamp-4">
      {item.konten}
    </p>
  )}

  <Link href={`/berita/${item.id}`}>
    {variant === "large" && (
      <span className="inline-block text-primary text-sm font-medium cursor-pointer hover:underline">
        Lihat detail →
      </span>
    )}
  </Link>
</div>

      </div>

  )
}
