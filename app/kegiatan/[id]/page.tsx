import { prisma } from "@/lib/prisma"
import { CalendarDays, CircleChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"
import ImageCarousel from "@/components/berita/image_carousel"

type PageProps = {
  params: {
    id: string
  }
}

export default async function KegiatanDetailPage({ params }: PageProps) {
  const { id } = await params

const data = await prisma.kegiatan.findUnique({
  where: {
    id,
  },
})

if (!data) notFound()

const latestKegiatan = await prisma.kegiatan.findMany({
  where: {
    id: {
      not: id,
    },
    status: "publish",
  },
  orderBy: {
    tanggal_mulai: "desc",
  },
  take: 3,
})

const getStatus = (tanggal: Date | null) => {
  if (!tanggal) return "selesai"

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tgl = new Date(tanggal)
  tgl.setHours(0, 0, 0, 0)

  if (tgl > today) return "upcoming"
  if (tgl.getTime() === today.getTime()) return "ongoing"

  return "selesai"
}

  const status = getStatus(data.tanggal_mulai)

  return (
    <div className="mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* KONTEN UTAMA */}
          <div className="w-full lg:w-3/4 space-y-6">

            {/* BACK + JUDUL */}
            <div className="space-y-2">
              <Link
                href="/kegiatan"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
              >
                <CircleChevronLeft className="w-6 h-6" />
                Kembali
              </Link>
              <h1 className="text-4xl font-bold leading-tight">
                {data.judul}
              </h1>
            </div>

            {/* TANGGAL + STATUS */}
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>
{data.tanggal_mulai
  ? new Date(data.tanggal_mulai).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "-"}
                </span>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full w-fit font-medium ${
                  status === "upcoming"
                    ? "bg-[#FAEEDA] text-[#854F0B]"
                    : status === "ongoing"
                    ? "bg-[#E6F1FB] text-[#185FA5]"
                    : "bg-[#E1F5EE] text-[#0F6E56]"
                }`}
              >
                {status === "upcoming" ? "Upcoming" : status === "ongoing" ? "Ongoing" : "Selesai"}
              </span>
            </div>

<ImageCarousel
  images={
    Array.isArray(data.gambar)
      ? data.gambar.filter(
          (item): item is string => typeof item === "string"
        )
      : []
  }
  alt={data.judul}
/>

            {/* DESKRIPSI */}
            <div className="text-base text-gray-700 text-justify leading-relaxed space-y-4">
              {data.deskripsi ? (
  data.deskripsi.split("\n").map((para: string, i: number) => (
    <p key={i}>{para}</p>
  ))
) : (
  <p className="text-gray-400 italic">
    Belum ada deskripsi kegiatan
  </p>
)}
            </div>

          </div>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-1/4 space-y-4">
            <div className="mb-2">
              <h2 className="text-xl font-bold">Kegiatan Terbaru</h2>
              <div className="mt-2 w-full h-[2px] bg-primary rounded-full" />
            </div>

            {latestKegiatan && latestKegiatan.length > 0 ? (
              latestKegiatan.map((item) => (
                <KegiatanTerbaru
  key={item.id}
  item={{
    id: item.id,
    judul: item.judul,
    gambar: Array.isArray(item.gambar)
      ? item.gambar.filter(
          (gambar): gambar is string => typeof gambar === "string"
        )
      : [],
    tanggal: item.tanggal_mulai
      ? item.tanggal_mulai.toISOString()
      : "",
  }}
  variant="small"
/>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                Tidak ada kegiatan terbaru
              </p>
            )}
          </aside>

        </div>
      </div>
    </div>
  )
}