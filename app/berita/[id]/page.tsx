import Image from "next/image"
import { berita } from "@/data/berita"
import { CalendarDays, CircleChevronLeft, MapPin, Phone, Mail} from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import BeritaTerbaru from "@/components/berita/berita_terbaru"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { id } = await params
  const numericId = Number(id)

  const data = berita.find(item => item.id === numericId)

  if (!data) notFound()

  const latestBerita = berita
    .filter(item => item.id !== numericId)
    .slice(0, 3)

  return (
    <div>
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="w-full lg:w-3/4 space-y-6">
        <h1 className="flex gap-2 text-4xl font-bold items-center">
          {data.judul}
        </h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>{data.tanggal}</span>
          </div>

          <div className="relative h-[200px] md:h-[400px]">
            <Image
              src={data.image}
              alt={data.judul}
              fill
              className="object-contain object-left"
            />
          </div>
        </div>
        
        <aside className="w-full lg:w-1/4 space-y-4">
          <h2 className="text-lg font-semibold">
            Berita Terbaru
          </h2>

        {latestBerita.map(item => (
          <BeritaTerbaru
            key={item.id}
            item={item}
            variant="small"
            layout="row"
          />
        ))}
        </aside>

      </div>
    </div>
    </div>
  )
}
