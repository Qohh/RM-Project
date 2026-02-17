"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/anggota/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profil Saya",
    href: "/anggota/profil",
    icon: User,
  },
  {
    name: "Kegiatan",
    href: "/anggota/kegiatan",
    icon: CalendarDays,
  },
  {
    name: "Pengaturan",
    href: "/anggota/pengaturan",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-primary">
          Area Anggota
        </h2>
        <p className="text-sm text-gray-500">
          Remaja Mujahidin
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

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

      {/* Footer */}
      <div className="border-t p-3">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                     text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
