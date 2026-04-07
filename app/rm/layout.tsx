"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/rm" },
    { name: "Kegiatan", href: "/rm/kegiatan" },
    { name: "Berita", href: "/rm/berita" },
    { name: "Profil", href: "/rm/profil" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-primary p-5">
        <h1 className="text-xl font-bold mb-6 text-black text-center">Anggota RM</h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded ${
                pathname === item.href
                  ? "bg-primary-dark text-white font-semibold"
                  : "hover:bg-primary-light hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}