import Image from "next/image"
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

  const { data: latestKegiatan } = await supabase
    .from("kegiatan")
    .select("*")
    .neq("id", id)
    .eq("status", "publish")
    .order("tanggal_mulai", { ascending: false })
    .limit(3)

  const getStatus = (tanggal: string) => {
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
                  {new Date(data.tanggal_mulai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <span
                className={`text-white text-xs px-3 py-1 rounded-full w-fit ${
                  status === "upcoming"
                    ? "bg-yellow-500"
                    : status === "ongoing"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              >
                {status === "upcoming" ? "Upcoming" : status === "ongoing" ? "Ongoing" : "Selesai"}
              </span>
            </div>

            {/* GAMBAR */}
            <div className="relative h-[200px] md:h-[400px]">
              <img
                src={data.gambar?.[0]}
                alt={data.judul}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* DESKRIPSI */}
            <div className="text-base text-gray-700 text-justify leading-relaxed space-y-4">
              {data.deskripsi.split("\n").map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
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
                    ...item,
                    tanggal: item.tanggal_mulai,
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