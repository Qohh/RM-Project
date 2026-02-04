import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/informasi_slider"
import { kegiatan } from "@/data/kegiatan"
import { berita } from "@/data/berita"
import Footer from "@/components/footer"
import Informasi_slider from "@/components/informasi_slider"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"
import BeritaTerbaru from "@/components/berita/berita_terbaru"

export default function BerandaPage() {
  const latestKegiatan = kegiatan.slice(0, 2)
  const latestBerita = berita.slice(0,2)

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
          <div className="grid grid-cols-2 gap-4 px-4 pb-4">
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
          <div className="grid grid-cols-2 gap-4 px-4 pb-4">
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



      </div>
      <Footer/>
    </div>      
  )
}
