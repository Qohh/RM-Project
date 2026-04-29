import { MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-7 pb-5">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x md:divide-white/30 pb-8">

        {/* Tentang Kami */}
        <section className="md:pr-10">
          <div className="flex flex-col gap-3 text-center md:text-right md:items-end">

            <h1 className="text-2xl font-bold">Tentang Kami</h1>
            <hr className="border-white/40 w-20 mx-auto md:ml-auto md:mx-0" />

            <img
              src="/logo-rm.png"
              alt="Logo-RM"
              width={60}
              height={60}
              className="py-2 mx-auto md:mx-0"
            />

            <h2 className="text-base font-semibold">
              Remaja Mujahidin Kalimantan Barat
            </h2>

            <p className="text-white/80 text-sm max-w-xs mx-auto md:mx-0">
              Organisasi Pengembangan Potensi dan Pembinaan Remaja Islam.
            </p>

          </div>
        </section>

        {/* Kontak */}
        <section className="md:pl-10">
          <div className="flex flex-col gap-3 text-center md:text-left">

            <h1 className="text-2xl font-bold">Kontak</h1>
            <hr className="border-white/40 w-20 mx-auto md:mx-0" />

            <p className="flex gap-2 items-start justify-center md:justify-start text-sm">
              <MapPin className="w-5 h-5 shrink-0 mt-1" />
              <span>
                Sekretariat : Komplek Masjid Raya Mujahidin,
                Jl. Mujahidin/Ahmad Yani, Pontianak,
                Kalimantan Barat.
              </span>
            </p>

            <p className="flex gap-2 items-center justify-center md:justify-start text-sm">
              <Phone className="w-5 h-5 shrink-0" />
              0851-1721-2479
            </p>

            <p className="flex gap-2 items-center justify-center md:justify-start text-sm">
              <Mail className="w-5 h-5 shrink-0" />
              remajamujahidin.kalbar@gmail.com
            </p>

           <div className="flex justify-center md:justify-start items-center gap-4 pt-3">

  {[
    { href: "https://www.instagram.com/remajamujahidin_kalbar/", icon: "/icons/instagram.png", label: "Instagram" },
    { href: "https://www.facebook.com/remajamujahidinkalbar79", icon: "/icons/facebook.png", label: "Facebook" },
    { href: "https://www.youtube.com/@remajamujahidinkalbar9696", icon: "/icons/youtube.png", label: "YouTube" },
    { href: "https://wa.me/6285117212479?text=Halo%20saya%20ingin%20bertanya", icon: "/icons/whatsapp.png", label: "WhatsApp" },
    { href: "https://www.tiktok.com/@remajamujahidinkalbar", icon: "/icons/tiktok.png", label: "TikTok" },
  ].map((item, i) => (
    <a
      key={i}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      className="w-9 h-9 flex items-center justify-center bg-white rounded-full transition"
    >
      <Image
        src={item.icon}
        alt={item.label}
        width={20}
        height={20}
        className="object-contain"
      />
    </a>
  ))}

</div>

          </div>
        </section>

      </div>

      <hr className="border-white/30" />

      <div className="pt-5 text-center text-sm text-white px-4">
        © {new Date().getFullYear()} Remaja Mujahidin Kalimantan Barat
      </div>
    </footer>
  )
}
