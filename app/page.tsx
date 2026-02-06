import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/informasi_slider"
import Informasi_slider from "@/components/informasi_slider"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"
import BeritaTerbaru from "@/components/berita/berita_terbaru"
import Footer from "@/components/footer"
import { kegiatan } from "@/data/kegiatan"
import { berita } from "@/data/berita"
import { Users, CalendarDays, BarChart3, CalendarCheck, ClipboardList } from "lucide-react"

export default function BerandaPage() {
  const latestKegiatan = kegiatan
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 2)
  const latestBerita = berita
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 2)

  return (
    <div>
      <div>
      <div className="flex pb-10">
      <div className="flex flex-col w-2/3 relative pl-5 pt-5">
        <img
          src="/Foto-Pengurus-Akhwat.png"
          alt="Foto Pengurus RM"
          className="w-full h-full object-cover rounded-xl"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-24
                    bg-gradient-to-t
                    from-[#f0f9ff]
                    to-transparent"
        />

        <div className="absolute inset-0 flex items-end p-6">
          <h2 className="text-white text-4xl font-bold mb-6 ml-4">
            Ahlan Wa Sahlan!
          </h2>
        </div>
      </div>

      <div className="flex flex-col w-1/3">
      <h1 className="text-center text-2xl font-bold pt-5">Informasi Terbaru</h1>
      <div className="mx-auto mt-2 mb-4 w-56 h-[2px] bg-primary rounded-full" />
        <Informasi_slider/>
      </div>
      </div>

      <div className="flex gap-5 p-5">
        <div className="flex flex-col w-1/2 bg-white rounded-xl">
          <h1 className="text-center text-2xl font-bold pt-5">
            Kegiatan Terbaru
          </h1>

          <div className="mx-auto mt-2 mb-4 w-40 h-[2px] bg-primary rounded-full" />
          <div className="grid grid-cols-2 gap-4 px-4 pb-4 h-full">
            {latestKegiatan.map(item => (
              <KegiatanTerbaru
                key={item.id}
                item={item}
                variant="large"
                layout="col"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col w-1/2 bg-white rounded-xl">
          <h1 className="text-center text-2xl font-bold pt-5">
            Berita Terbaru
          </h1>
          <div className="mx-auto mt-2 mb-4 w-40 h-[2px] bg-primary rounded-full" />
          <div className="grid grid-cols-2 gap-4 px-4 pb-4 h-full">
            {latestBerita.map(item => (
              <BeritaTerbaru
                key={item.id}
                item={item}
                variant="large"
                layout="col"
              />
            ))}
          </div>
        </div>
      </div>

{/* STATISTIK PENGUNJUNG */}
<div className="px-5 pb-10">
  <div className="bg-white rounded-xl p-6">
    <h2 className="text-2xl font-bold text-center">
      Statistik Pengunjung
    </h2>

    <div className="mx-auto mt-2 mb-6 w-56 h-[2px] bg-primary rounded-full" />

    <div className="grid grid-cols-4 gap-6 text-center">
      
      {/* Hari ini */}
      <div className="rounded-xl border p-5 hover:shadow transition">
        <CalendarDays className="mx-auto mb-2 w-6 h-6 text-primary" />
        <p className="text-3xl font-bold">34</p>
        <p className="text-sm text-muted-foreground">
          Hari ini
        </p>
      </div>

      {/* Minggu ini */}
      <div className="rounded-xl border p-5 hover:shadow transition">
        <BarChart3 className="mx-auto mb-2 w-6 h-6 text-primary" />
        <p className="text-3xl font-bold">210</p>
        <p className="text-sm text-muted-foreground">
          Minggu ini
        </p>
      </div>

      {/* Bulan ini */}
      <div className="rounded-xl border p-5 hover:shadow transition">
        <BarChart3 className="mx-auto mb-2 w-6 h-6 text-primary" />
        <p className="text-3xl font-bold">890</p>
        <p className="text-sm text-muted-foreground">
          Bulan ini
        </p>
      </div>

      {/* Total */}
      <div className="rounded-xl border p-5 hover:shadow transition">
        <Users className="mx-auto mb-2 w-6 h-6 text-primary" />
        <p className="text-3xl font-bold">4.532</p>
        <p className="text-sm text-muted-foreground">
          Total Pengunjung
        </p>
      </div>

    </div>
  </div>
</div>

{/* HIGHLIGHT ANGKA */}
<div className="px-5 pb-14">
  <div className="bg-primary text-white rounded-xl p-8">
    <div className="grid grid-cols-3 gap-6 text-center">

      {/* Anggota */}
      <div>
        <Users className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">100+</p>
        <p className="text-sm opacity-90">
          Anggota Aktif
        </p>
      </div>

      {/* Kegiatan */}
      <div>
        <CalendarCheck className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">50+</p>
        <p className="text-sm opacity-90">
          Kegiatan
        </p>
      </div>

      {/* Program */}
      <div>
        <ClipboardList className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">20+</p>
        <p className="text-sm opacity-90">
          Program Kerja
        </p>
      </div>

    </div>
  </div>
</div>

      </div>
      <Footer/>
    </div>      
  )
}
