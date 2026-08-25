"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import PengurusSection from "@/components/pengurus/pengurus_card"
import Footer from "@/components/footer"

export default function StrukturKepengurusan() {
  const [pengurus, setPengurus] = useState<any[]>([])

useEffect(() => {
  const fetchPengurus = async () => {
    try {
      const response = await fetch("/api/pengurus")

      if (!response.ok) {
        throw new Error("Gagal mengambil data pengurus")
      }

      const data = await response.json()
      setPengurus(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  fetchPengurus()
}, [])

 // 🔥 1. DATA INTI
const pengurusInti = pengurus.filter((d) => !d.bidang);

// 🔥 2. URUTAN INTI
const urutanInti: Record<string, number> = {
  "Ketua Umum": 1,
  "Sekretaris Umum": 2,
  "Bendahara Umum 1": 3,
  "Bendahara Umum 2": 4,
};

// 🔥 3. SORT INTI
const sortedInti = [...pengurusInti].sort((a, b) => {
  const aRank = urutanInti[a.jabatan?.nama || ""];
  const bRank = urutanInti[b.jabatan?.nama || ""];
  return aRank - bRank;
});

// 🔥 4. SORT BIDANG
const sortedBidang = pengurus
  .filter((d) => d.bidang)
  .sort((a, b) => {
    const aIsKepala = a.jabatan?.nama === "Kepala Bidang";
    const bIsKepala = b.jabatan?.nama === "Kepala Bidang";

    if (aIsKepala && !bIsKepala) return -1;
    if (!aIsKepala && bIsKepala) return 1;

    return a.nama.localeCompare(b.nama);
  });

// 🔥 5. GROUPING (BARU DI SINI PAKE sortedInti)
const grouped = [
  {
    bidang: "PENGURUS INTI",
    anggota: sortedInti,
  },
  ...[
    "Kaderisasi",
    "PPA",
    "Keputrian",
    "Kesekretariatan",
    "Syiar",
    "Kominfo",
    "Kewirausahaan",
  ].map((b) => ({
    bidang: b,
    anggota: sortedBidang.filter((d) => d.bidang?.nama === b),
  })),
];

  return (
    <div className="flex flex-col min-h-screen mt-24">
      <main className="flex-1 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-6 sm:py-8 md:py-10">
        <Card className="w-full">
          <CardHeader className="border-b px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary">
              STRUKTUR KEPENGURUSAN
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-center text-gray-600">
              Struktur Pengurus Periode 2026-2027
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6 sm:mt-8 md:mt-10 px-2 sm:px-4">
            {pengurus.length > 0 ? (
              <PengurusSection data={grouped} />
            ) : (
              <p className="text-center text-gray-400 italic">
                Belum ada data pengurus
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}