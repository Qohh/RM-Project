"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  Newspaper,
  LayoutPanelTop,
} from "lucide-react";


const sidebarItems = [
  {
    name: "Dashboard",
    href: "/rm",
    icon: LayoutDashboard,
  },
  {
    name: "Kegiatan",
    href: "/rm/kegiatan",
    icon: CalendarDays,
  },
    {
    name: "Berita",
    href: "/rm/berita",
    icon: Newspaper,
  },
  {
    name: "Data Pengurus",
    href: "/rm/pengurus",
    icon: LayoutPanelTop,
  },
  {
    name: "Profil RM",
    href: "/rm/profil",
    icon: User,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-96px)] fixed top-24 left-0 bg-white border-r flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-primary">
          Anggota
        </h2>
        <p className="text-sm text-gray-500">
          Remaja Mujahidin
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive =
          item.href === "/rm"
            ? pathname === "/rm"
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
