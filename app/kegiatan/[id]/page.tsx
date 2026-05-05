import { CalendarDays, CircleChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"
import { supabase } from "@/lib/supabase"

type PageProps = {
  params: {
    id: string
  }
}

export default async function KegiatanDetailPage({ params }: PageProps) {
  const { id } = await params
  const numericId = Number(id)

  const { data, error } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) notFound()

  // 🔥 ambil kegiatan terbaru
  const { data: latestKegiatan } = await supabase
    .from("kegiatan")
    .select("*")
    .neq("id", numericId)
    .eq("status", "publish")
    .order("tanggal", { ascending: false })
    .limit(3)

  // 🔥 status kegiatan
  const getStatus = (tanggal: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tgl = new Date(tanggal)
    tgl.setHours(0, 0, 0, 0)

    if (tgl > today) return "upcoming"
    if (tgl.getTime() === today.getTime()) return "ongoing"
    return "selesai"
  }

  const status = getStatus(data.tanggal)

  return (
    <div className="mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 🔥 KONTEN UTAMA */}
          <div className="w-full lg:w-3/4 space-y-6">

            {/* 🔙 BACK */}
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

            {/* 📅 + STATUS */}
            <div className="flex flex-col gap-2 text-muted-foreground">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{data.tanggal}</span>
              </div>

              {/* 🔥 STATUS BADGE */}
              <span
                className={`
                  text-white text-xs px-3 py-1 rounded-full w-fit
                  ${
                    status === "upcoming"
                      ? "bg-yellow-500"
                      : status === "ongoing"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }
                `}
              >
                {status === "upcoming"
                  ? "Upcoming"
                  : status === "ongoing"
                  ? "Ongoing"
                  : "Selesai"}
              </span>

            </div>

            {/* 🖼️ GAMBAR */}
            <div className="relative h-[200px] md:h-[400px]">
              <img
                src={data.gambar?.[0]}
                alt={data.judul}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* 📝 DESKRIPSI */}
        <div className="text-base text-gray-700 text-justify leading-relaxed space-y-4">
          {data.deskripsi.split("\n").map((para: string, i: number) => (
            <p key={i} className="indent-8">{para}</p>
          ))}
        </div>

          </div>

          {/* 🔥 SIDEBAR */}
          <aside className="w-full lg:w-1/4 space-y-4">
            <h2 className="text-lg font-semibold">
              Kegiatan Terbaru
            </h2>

            {latestKegiatan && latestKegiatan.length > 0 ? (
            latestKegiatan.map((item) => (
              <KegiatanTerbaru
                key={item.id}
                item={item}
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