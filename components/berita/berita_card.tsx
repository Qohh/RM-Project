import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

type BeritaCardProps = {
  id: number
  judul: string
  tanggal: string
  image: string
  kategori: string
}

export default function BeritaCard({
  id,
  judul,
  tanggal,
  image,
  kategori
}: BeritaCardProps) {
  return (
    <Card className="flex flex-col shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="p-2">
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={image || "/placeholder.png"}
            alt={judul}
            
          />

          <div
            className="
              absolute inset-0 
              bg-black/0 
              group-hover:bg-black/60 
              transition-all duration-300
              flex items-center justify-center
            "
          >
            <Link
              href={`/berita/${id}`}
              className="
                opacity-0 translate-y-4
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300
                bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold
              "
            >
              Baca selengkapnya
            </Link>
          </div>
        </div>
      </div>

<CardHeader className="space-y-2">

  <div className="flex items-center justify-between">
    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
      {kategori}
    </span>

    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <CalendarDays className="w-5 h-5" />
      {tanggal}
    </div>
  </div>

  <CardTitle className="line-clamp-4 leading-relaxed">
    {judul}
  </CardTitle>

</CardHeader>
    </Card>
  )
}
