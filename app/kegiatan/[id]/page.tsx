import Image from "next/image"
import { kegiatan } from "@/data/kegiatan"
import { CalendarDays, CircleChevronLeft, MapPin, Phone, Mail} from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"

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
      <div className="flex gap-8">

        {/* KIRI — DETAIL */}
        <div className="w-3/4 space-y-6">
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
        <aside className="w-1/4 space-y-4">
          <h2 className="text-lg font-semibold">
            Kegiatan Terbaru
          </h2>

          {latestKegiatan.map(item => (
            <div
              key={item.id}
              className="flex gap-3 border rounded-lg p-3 hover:bg-muted transition"
            >
              <div className="relative w-20 h-16 shrink-0">
                <Image
                  src={item.image}
                  alt={item.judul}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="text-sm">
                <p className="font-medium line-clamp-2">
                  {item.judul}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.tanggal}
                </p>
              </div>
            </div>
          ))}
        </aside>

      </div>
    </div>
          <footer className="bg-primary text-white pb-5 pt-7">
  <div className="max-w-6xl mx-auto grid grid-cols-2 divide-x divide-white/30 pb-5">
    <section className="flex justify-end pr-10">
      <div className="flex flex-col gap-2 text-right items-end">

        <h1 className="text-2xl font-bold">Tentang Kami</h1>
        <hr className="border-white/40 w-20 ml-auto" />

        <img
          src="/logo-rm.png" 
          alt="Logo-RM"
          width={60}
          height={60}
          className="py-2"
        />

        <h2 className="text-base font-semibold">
          Remaja Mujahidin Kalimantan Barat
        </h2>

        <p className="text-white/80 text-sm max-w-xs">
          Organisasi Pengembangan Potensi dan Pembinaan Remaja Islam.
        </p>

      </div>
    </section>

    <section className="flex justify-start pl-10">
      <div className="flex flex-col gap-2 text-left">

        <h1 className="text-2xl font-bold">Kontak</h1>
        <hr className="border-white/40 w-20" />

        <p className="flex gap-2 items-center py-2">
          <MapPin className="w-5 h-5 shrink-0"/> Sekretariat : Komplek Masjid Raya Mujahidin, Jl.Mujahidin/Ahmad Yani, Pontianak, Kalimantan Barat.</p>
        <p className="flex gap-2 items-center pb-2">
          <Phone className="w-5 h-5 shrink-0"/> 0851-1721-2479</p>
        <p className="flex gap-2 items-center pb-2">
          <Mail className="w-5 h-5 shrink-0"/> remajamujahidn.kalbar@gmail.com</p>

      </div>
    </section>
  </div>
      <hr className="border-white/30" />
      <div className="container mx-auto px-4 md:px-6 pt-5 text-center text-muted-foreground text-sm text-white">
        © {new Date().getFullYear()} Remaja Mujahidin Kalimantan Barat
      </div> 
</footer>
    </div>
  )
}
