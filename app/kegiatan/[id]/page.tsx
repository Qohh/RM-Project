import Image from "next/image"
import { kegiatan } from "@/data/kegiatan"
import { CalendarDays, CircleChevronLeft, MapPin, Phone, Mail} from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function KegiatanDetailPage({ params }: PageProps) {
  const { id } = await params
  const numericId = Number(id)

  const data = kegiatan.find(item => item.id === numericId)

  if (!data) notFound()

  const latestKegiatan = kegiatan
    .filter(item => item.id !== numericId)
    .slice(0, 3)

  return (
    <div>
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* KIRI — DETAIL */}
        <div className="w-full lg:w-3/4 space-y-6">
        <h1 className="flex gap-2 text-4xl font-bold items-center">

          {data.judul}
        </h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>{data.tanggal}</span>
          </div>

          <div className="relative h-[400px]">
            <Image
              src={data.image}
              alt={data.judul}
              fill
              className="object-contain object-left"
            />
          </div>

          <p className="text-base leading-relaxed">
            {data.deskripsi}
          </p>
        </div>

        {/* KANAN — KEGIATAN TERBARU */}
        <aside className="w-full lg:w-1/4 space-y-4">
          <h2 className="text-lg font-semibold">
            Kegiatan Terbaru
          </h2>

        {latestKegiatan.map(item => (
          <KegiatanTerbaru
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
