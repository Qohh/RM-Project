import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-gradient-to-br from-primary-light via-primary to-primary-dark sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        
        {/* KIRI: LOGO + NAMA */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-rm.png"
            alt="Logo Organisasi"
            width={45}
            height={45}
          />
          <span className="text-2xl font-semibold text-white">
            Remaja Mujahidin Kalimantan Barat
          </span>
        </Link>

        {/* KANAN: MENU + AVATAR */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white font-semibold hover:underline">
            Beranda
          </Link> 
          <Link href="/ramadhan" className="text-white font-semibold hover:underline">
            Info Ramadhan
          </Link>
          <Link href="/kegiatan" className="text-white font-semibold hover:underline">
            Kegiatan
          </Link>
          <Link href="/berita" className="text-white font-semibold hover:underline">
            Berita
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-1 text-white font-semibold hover:underline">
              Profil
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 w-48 rounded-lg bg-white shadow-lg border
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 z-50">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link href="/profil/sejarah" className="block px-4 py-2 hover:bg-gray-100">
                  Sejarah
                  </Link>
                </li>
                <li>
                  <Link href="/profil/tujuan" className="block px-4 py-2 hover:bg-gray-100">
                  Tujuan
                  </Link>
                </li>
                <li>
                  <Link href="/profil/visi-misi" className="block px-4 py-2 hover:bg-gray-100">
                  Visi-Misi
                  </Link>
                </li>
                <li>
                  <Link href="/profil/struktur" className="block px-4 py-2 hover:bg-gray-100">
                  Struktur Kepengurusan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

           <div className="relative group">
            <button className="flex items-center gap-1 text-white font-semibold hover:underline">
              Kontak
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full mt-2 w-32 rounded-lg bg-white shadow-lg border
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 z-50">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <a
                    href="https://www.instagram.com/remajamujahidin_kalbar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  > <Image
                      src="/icons/logo-instagram.png"
                      alt="Instagram"
                      width={20}
                      height={20}
                    />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/remajamujahidinkalbar79"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  > <Image
                      src="/icons/logo-facebook.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                    />
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@remajamujahidinkalbar9696"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  > <Image
                      src="/icons/logo-youtube.png"
                      alt="Youtube"
                      width={20}
                      height={20}
                    />
                    Youtube
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6285117212479?text=Halo%20saya%20ingin%20bertanya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  > <Image
                      src="/icons/logo-whatsapp.png"
                      alt="Whatsapp"
                      width={20}
                      height={20}
                    />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                  href="https://www.tiktok.com/@remajamujahidinkalbar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  ><Image
                      src="/icons/logo-tiktok.png"
                      alt="Tiktok"
                      width={22}
                      height={22}
                    />
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-9 w-9 overflow-hidden rounded-full border">
            <Image
              src="/profile.png"
              alt="User"
              width={36}
              height={36}
            />
          </div>
        </div>
      </nav>

      <div className="w-full bg-primary-dark overflow-hidden">
        <p className="animate-marquee whitespace-nowrap text-white px-4 py-1 text-sm">
            Selamat datang di website Remaja Mujahidin Kalimantan Barat &nbsp; • &nbsp; Organisasi Pengembangan Potensi & Pembinaan Remaja Islam
        </p>
      </div>
    </header>

  );
}
