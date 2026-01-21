import Image from "next/image"
import { kegiatan } from "@/data/kegiatan"
import { CalendarDays } from "lucide-react"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function KegiatanDetailPage({ params }: PageProps) {
  // 🔑 WAJIB await
  const { id } = await params
  const numericId = Number(id)

  const data = kegiatan.find(
    (item) => item.id === numericId
  )

  if (!data) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="relative w-full h-[400px]">
        <Image
          src={data.image}
          alt={data.judul}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h1 className="text-3xl font-bold">
        {data.judul}
      </h1>

      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarDays className="w-4 h-4" />
        <span>{data.tanggal}</span>
      </div>

      <p className="text-base leading-relaxed">
        {data.deskripsi}
      </p>
    </div>
  )
}
