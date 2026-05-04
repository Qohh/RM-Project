"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/supabase-js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
const pathname = usePathname();
const isProfilPage = pathname.startsWith("/profil");
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  // ambil session saat pertama load
  const getSession = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
  };

  getSession();

  // listen perubahan login/logout
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  const navItems = [
    { name: "Beranda", href: "/" },
    //{ name: "Info Ramadhan", href: "/ramadhan" },
    { name: "Kegiatan", href: "/kegiatan" },
    { name: "Berita", href: "/berita" },
  ];

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const name =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <>
    <header className="w-full fixed top-0 left-0 z-50 border-b bg-gradient-to-br from-primary-light via-primary to-primary-dark">
     <nav className="w-full px-4 md:px-6 py-3">

<div className="flex items-center justify-between w-full">

      
        <div className="flex items-center gap-2">
          <Image
            src="/logo-rm.png"
            alt="Logo Organisasi"
            width={45}
            height={45}
          />

          
<span className="text-sm md:text-2xl font-semibold text-white ">

            Remaja Mujahidin Kalimantan Barat
          </span>

          
        </div> 
        <button
  className="md:hidden text-white"
  onClick={() => setIsMobileOpen(!isMobileOpen)}
>
  {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
</button>


<div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white font-semibold relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:transition-all after:duration-300 ${
                pathname === item.href ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="relative group">
            <button className="flex items-center gap-1 text-white font-semibold hover:underline">
              Profil
              <ChevronDown className="w-4 h-4" />
            </button>

       <div className="absolute top-full mt-2 w-24 md:w-32 rounded-lg bg-white shadow-lg border
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

{user ? (
        // =============================
        // ✅ SUDAH LOGIN → DROPDOWN
        // =============================
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 overflow-hidden rounded-full border cursor-pointer">
              <Image src="/profile.png" alt="Profile" width={36} height={36} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 p-3 rounded-xl shadow-lg"
          >
            {/* HEADER */}
            <div className="flex flex-col items-center text-center p-5 rounded-lg bg-muted">
              <Image
                src="/profile.png"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full mb-2"
              />
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            {/* MENU */}
<div className="mt-2">
  {/* Dashboard */}
  <DropdownMenuItem asChild>
    <Link href="/rm" className="cursor-pointer">
    <LayoutDashboard className="w-4 h-4" />
      Dashboard
    </Link>
  </DropdownMenuItem>

  {/* Logout */}
  <DropdownMenuItem
    onClick={async () => {
      await supabase.auth.signOut()
      location.reload()
    }}
    className="text-red-500 cursor-pointer"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </DropdownMenuItem>
</div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // =============================
        // ❌ BELUM LOGIN → TOOLTIP LOGIN
        // =============================
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login">
                <div className="h-9 w-9 overflow-hidden rounded-full border cursor-pointer flex items-center justify-center">
                  <Image
                    src="/profile.png"
                    alt="Login"
                    width={36}
                    height={36}
                  />
                </div>
              </Link>
            </TooltipTrigger>

            <TooltipContent>
              Login
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

  </div>
  </div>
</nav>

      <div className="w-full bg-primary-dark overflow-hidden">
        <p className="animate-marquee whitespace-nowrap text-white px-4 py-1 text-sm">
            Selamat datang di website Remaja Mujahidin Kalimantan Barat &nbsp; • &nbsp; Organisasi Pengembangan Potensi & Pembinaan Remaja Islam
        </p>
      </div>
    </header>

<div
  className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
    isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
  onClick={() => setIsMobileOpen(false)}
/>


<div
  className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
    isMobileOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="p-5 flex justify-between items-center border-b">
    <span className="font-semibold text-lg">Menu</span>
    <button onClick={() => setIsMobileOpen(false)}>
      <X />
    </button>
  </div>

<div className="flex flex-col gap-1 p-5">
  {navItems.map((item) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`px-3 py-2 rounded-md font-medium transition border-l-4 ${
          isActive
            ? "bg-primary/10 text-primary border-primary"
            : "text-gray-700 border-transparent hover:bg-gray-100"
        }`}
      >
        {item.name}
      </Link>
    );
  })}


{/* PROFIL ACCORDION */}
<div className="border-b border-gray-200">
<button
  onClick={() =>
    setOpenSubmenu(openSubmenu === "profil" ? null : "profil")
  }
  className={`w-full flex justify-between items-center py-3 font-semibold transition ${
    isProfilPage ? "text-primary" : "text-gray-800"
  }`}
>

    Profil
    <ChevronDown
      className={`w-4 h-4 transition-transform duration-300 ease-out ${
        openSubmenu === "profil" ? "rotate-180 text-primary" : "text-gray-500"
      }`}
    />
  </button>

  {/* Submenu */}
  <div
    className={`overflow-hidden transition-all duration-300 ease-in-out ${
      openSubmenu === "profil" || isProfilPage

        ? "max-h-60 opacity-100"
        : "max-h-0 opacity-0"
    }`}
  >
    <div className="flex flex-col pl-4 pb-3 gap-1 text-sm">
      {[
  { label: "Sejarah", href: "/profil/sejarah" },
  { label: "Tujuan", href: "/profil/tujuan" },
  { label: "Visi Misi", href: "/profil/visi-misi" },
  { label: "Struktur Kepengurusan", href: "/profil/struktur" },
].map((item) => {
  const isActive = pathname === item.href;

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setIsMobileOpen(false)}
      className={`py-2 px-2 rounded-md transition ${
        isActive
          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary "
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {item.label}
    </Link>
  );
})}

    </div>
  </div>
</div>


    {/* KONTAK ACCORDION */}
<div className="border-b border-gray-200">
  <button
    onClick={() =>
      setOpenSubmenu(openSubmenu === "kontak" ? null : "kontak")
    }
    className="w-full flex justify-between items-center py-3 text-gray-800 font-semibold"
  >
    Kontak
    <ChevronDown
      className={`w-4 h-4 transition-transform duration-300 ease-out ${
        openSubmenu === "kontak" ? "rotate-180 text-primary" : "text-gray-500"
      }`}
    />
  </button>

  {/* Submenu */}
  <div
    className={`overflow-hidden transition-all duration-300 ease-in-out ${
      openSubmenu === "kontak"
        ? "max-h-72 opacity-100"
        : "max-h-0 opacity-0"
    }`}
  >
    <div className="flex flex-col pl-4 pb-4 gap-1 text-sm">
      {[
        {
          label: "Instagram",
          icon: "/icons/instagram.png",
          href: "https://www.instagram.com/remajamujahidin_kalbar/",
        },
        {
          label: "Facebook",
          icon: "/icons/facebook.png",
          href: "https://www.facebook.com/remajamujahidinkalbar79",
        },
        {
          label: "Youtube",
          icon: "/icons/youtube.png",
          href: "https://www.youtube.com/@remajamujahidinkalbar9696",
        },
        {
          label: "WhatsApp",
          icon: "/icons/whatsapp.png",
          href: "https://wa.me/6285117212479",
        },
        {
          label: "TikTok",
          icon: "/icons/tiktok.png",
          href: "https://www.tiktok.com/@remajamujahidinkalbar",
        },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 px-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
        >
          <img src={item.icon} alt={item.label} width={18} height={18} />
          {item.label}
        </a>
      ))}
    </div>
  </div>
</div>

<Link
  href="/login"
  onClick={() => setIsMobileOpen(false)}
  className={`px-3 py-2 rounded-md font-medium transition border-l-4 ${
    pathname === "/login"
      ? "bg-primary/10 text-primary border-primary"
      : "text-gray-700 border-transparent hover:bg-gray-100"
  }`}
>
  Login
</Link>

  </div>
</div>
</>

  );
}
