import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/kegiatan/kegiatan_slider"
import { kegiatan } from "@/data/kegiatan"

export default function KegiatanPage() {
  return (
    <div className="max-w-7xl mx-auto px-10 py-10 space-y-14">

      {/* Kegiatan Terbaru */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Kegiatan Terbaru
        </h2>

        {/* ambil 3 kegiatan TERAKHIR */}
        <KegiatanSlider data={kegiatan.slice(-3)} />
      </section>

      {/* Semua Kegiatan */}
      <section>
        <h1 className="text-2xl font-bold mb-6">
          Semua Kegiatan
        </h1>

        <div className="grid grid-cols-4 gap-6">
          {kegiatan.map((item) => (
            <KegiatanCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              deskripsi={item.deskripsi}
              tanggal={item.tanggal}
              image={item.image}
            />
          ))}
        </div>
      </section>

    </div>
  )
}
