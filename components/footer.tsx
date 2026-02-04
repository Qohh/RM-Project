import { MapPin, Phone, Mail } from "lucide-react"

export default function Footer(){
    return(
        <footer className="bg-primary text-white pb-5 pt-7">
  <div className=" bg-primary max-w-6xl mx-auto grid grid-cols-2 divide-x divide-white/30 pb-5">
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
    )
}