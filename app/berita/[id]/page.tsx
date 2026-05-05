import Image from "next/image"
import { CalendarDays, CircleChevronLeft, MapPin, Phone, Mail} from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import BeritaTerbaru from "@/components/berita/berita_terbaru"
import { supabase } from "@/lib/supabase"

type PageProps = {
  params: {
    id: string
  }
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { id } = await params
  const numericId = Number(id)

  const { data, error } = await supabase
    .from("berita")
    .select(`
      *,
      kategori(nama)
    `)
    .eq("id", id)
    .single()

  if (error || !data) notFound()

  const { data: latestBerita } = await supabase
  .from("berita")
  .select("*")
  .neq("id", id)
  .eq("status", "publish")
  .order("tanggal", { ascending: false })
  .limit(3)

  return (
    <div className="mt-24">
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="w-full lg:w-3/4 space-y-6">
        
        <div className="space-y-2">

  {/* 🔙 BACK BUTTON */}
  <Link
    href="/berita"
    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
  >
    <CircleChevronLeft className="w-6 h-6" />
    Kembali
  </Link>

  {/* JUDUL */}
  <h1 className="text-4xl font-bold leading-tight">
    {data.judul}
  </h1>

</div>

<div className="flex flex-col gap-2 text-muted-foreground">

  {/* TANGGAL */}
  <div className="flex items-center gap-2">
    <CalendarDays className="w-4 h-4" />
    <span>{data.tanggal}</span>
  </div>

            {/* KATEGORI */}
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full w-fit">
              {data.kategori?.nama || "Tanpa Kategori"}
            </span>

          </div>

          <div className="relative h-[200px] md:h-[400px]">
            <img
              src={data.gambar?.[0]}
              alt={data.judul}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

        <div className="text-base text-gray-700 text-justify leading-relaxed space-y-4">
          {data.isi.split("\n").map((para: string, i: number) => (
            <p key={i} className="indent-8">{para}</p>
          ))}
        </div>

        </div>
        
        <aside className="w-full lg:w-1/4 space-y-4">
          <h2 className="text-lg font-semibold">
            Berita Terbaru
          </h2>

        {latestBerita?.map(item => (
            <BeritaTerbaru
              key={item.id}
              item={item}
              variant="small"
            />
          ))}
        </aside>

      </div>
    </div>
    </div>
  )
}
