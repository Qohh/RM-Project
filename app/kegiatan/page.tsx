import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/kegiatan/kegiatan_slider"
import { kegiatan } from "@/data/kegiatan"

export default function KegiatanPage() {
  return (
    <div className="max-w-7xl mx-auto px-10 py-5 space-y-14">

      {/* Semua Kegiatan */}
      <section>
        <h1 className="text-2xl font-bold mb-5 text-center text-primary">
          SEMUA KEGIATAN
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
