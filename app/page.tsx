"use client"

import Image from "next/image"
import { useEffect, useState, useCallback } from "react"
import BeritaTerbaru from "@/components/berita/berita_terbaru"
import Footer from "@/components/footer"
import LiveClock from "@/components/LiveClock"
import { supabase } from "@/lib/supabase"
import { Users, CalendarCheck, ClipboardList } from "lucide-react"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"

const IMAGES = [
  "/Foto-Pengurus-Full.png",
  "/Foto-Pengurus-Akhwat.png",
  "/Foto-Pengurus-Ikhwan.png",
]

const PRAYER_LIST = [
  { label: "Subuh",   key: "Fajr"    },
  { label: "Dzuhur",  key: "Dhuhr"   },
  { label: "Ashar",   key: "Asr"     },
  { label: "Maghrib", key: "Maghrib" },
  { label: "Isya",    key: "Isha"    },
]

const TODAY = new Date().toLocaleDateString("en-CA")
const CACHE_KEY = `prayer_${TODAY}`

function getTimeToday(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number)
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
}

function formatMinutes(minutes: number): string {
  if (minutes < 0) return "sudah lewat"
  const jam = Math.floor(minutes / 60)
  const sisa = minutes % 60
  if (jam > 0 && sisa > 0) return `${jam} jam ${sisa} menit lagi`
  if (jam > 0) return `${jam} jam lagi`
  return `${sisa} menit lagi`
}

function CardSkeleton() {
  return <div className="animate-pulse rounded-xl bg-gray-100 h-48 w-full" />
}

export default function BerandaPage() {
  const [currentIndex, setCurrentIndex]     = useState(0)
  const [prayerTimes, setPrayerTimes]       = useState<Record<string, string> | null>(null)
  const [nextPrayer, setNextPrayer]         = useState<{ name: string; time: string }>({ name: "-", time: "-" })
  const [nextMinutes, setNextMinutes]       = useState(0)
  const [beritaData, setBeritaData]         = useState<any[]>([])
  const [kegiatanData, setKegiatanData]     = useState<any[]>([])
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchContent() {
      const [beritaRes, kegiatanRes] = await Promise.all([
        supabase.from("berita").select("*").eq("status", "publish").order("tanggal", { ascending: false }).limit(2),
        supabase.from("kegiatan").select("*").eq("status", "publish").order("tanggal_mulai", { ascending: false }).limit(2),
      ])
      if (beritaRes.data)   setBeritaData(beritaRes.data)
      if (kegiatanRes.data) setKegiatanData(kegiatanRes.data)
      setContentLoading(false)
    }
    fetchContent()
  }, [])

  const updateNextPrayer = useCallback((times: Record<string, string>) => {
    const now = new Date()
    const list = PRAYER_LIST.map((p) => ({
      name: p.label,
      time: times[p.key],
      date: getTimeToday(times[p.key]),
    }))
    const next = list.find((p) => p.date > now)
    if (next) {
      setNextPrayer({ name: next.name, time: next.time })
      setNextMinutes(Math.floor((next.date.getTime() - now.getTime()) / 60000))
    } else {
      const subuhBesok = new Date(list[0].date)
      subuhBesok.setDate(subuhBesok.getDate() + 1)
      setNextPrayer({ name: "Subuh", time: times["Fajr"] })
      setNextMinutes(Math.floor((subuhBesok.getTime() - now.getTime()) / 60000))
    }
  }, [])

  useEffect(() => {
    async function fetchPrayerTime() {
      let times: Record<string, string>
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        times = JSON.parse(cached)
      } else {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Pontianak&country=Indonesia&method=20"
        )
        const json = await res.json()
        times = json.data.timings
        localStorage.setItem(CACHE_KEY, JSON.stringify(times))
        Object.keys(localStorage)
          .filter((k) => k.startsWith("prayer_") && k !== CACHE_KEY)
          .forEach((k) => localStorage.removeItem(k))
      }
      setPrayerTimes(times)
      updateNextPrayer(times)
    }

    fetchPrayerTime()

    const interval = setInterval(() => {
      setPrayerTimes((prev) => {
        if (prev) updateNextPrayer(prev)
        return prev
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [updateNextPrayer])

  return (
    <div className="mt-28">

      {/* ── HERO + PRAYER ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 px-5 pt-5 pb-10">

        {/* HERO */}
        <div className="md:col-span-9 relative aspect-[2/1] md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden bg-gray-100">
          {IMAGES.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`Foto pengurus ${i + 1}`}
              fill
              priority={i === 0}
              unoptimized
              className={`transition-opacity duration-700 object-cover object-center
                ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          <div className="absolute inset-x-0 bottom-0 h-24 md:h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

          <div className="absolute inset-0 flex items-end p-4 md:p-6 z-10">
            <div>
              <h2 className="text-lg md:text-4xl font-bold text-white drop-shadow">
                Ahlan Wa Sahlan!
              </h2>
              <p className="hidden md:block text-white/80 text-sm mt-0.5 drop-shadow">
                📸 Pengurus Remaja Mujahidin Kalimantan Barat Periode 2025–2027
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-white w-5" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PRAYER */}
        <div className="md:col-span-3 flex flex-col md:h-[400px]">
          <h3 className="text-base md:text-2xl text-center font-bold text-primary mb-3 tracking-tight drop-shadow-sm">
            🕌 Waktu Adzan
          </h3>
          <div className="bg-white rounded-2xl border shadow-sm p-3 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <p className="text-[10px] text-gray-500 mb-1">Sekarang</p>
                <LiveClock />
              </div>
              <div className="bg-primary/10 rounded-xl p-2 text-center">
                <p className="text-[10px] text-gray-600">Selanjutnya</p>
                <p className="font-semibold text-primary text-sm">{nextPrayer.name}</p>
                <p className="text-[10px] text-gray-500">{formatMinutes(nextMinutes)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-0 flex-1">
              {PRAYER_LIST.map((item) => {
                const active = nextPrayer.name === item.label
                return (
                  <div
                    key={item.key}
                    className={`flex justify-between items-center px-3 md:px-4 rounded-xl text-xs md:text-sm transition-colors flex-1 min-h-[50px] md:min-h-0 ${
                      active
                        ? "bg-primary text-white font-semibold shadow"
                        : "bg-gray-50 odd:bg-gray-100/60"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono tracking-wide">{prayerTimes?.[item.key] ?? "--:--"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── KEGIATAN + BERITA ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl px-5 py-8">

        {/* Header desktop — tersembunyi di mobile */}
        <div className="hidden sm:grid grid-cols-4 gap-5 mb-2">
          <h2 className="col-span-2 text-center text-2xl font-bold">Kegiatan Terbaru</h2>
          <h2 className="col-span-2 text-center text-2xl font-bold">Berita Terbaru</h2>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-5 mb-6">
          <div className="col-span-2 flex justify-center">
            <div className="w-40 h-[2px] bg-primary rounded-full" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="w-40 h-[2px] bg-primary rounded-full" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {contentLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              {/* Kegiatan — judul mobile only */}
              <div className="sm:hidden text-center mb-1">
                <h2 className="text-xl font-bold">Kegiatan Terbaru</h2>
                <div className="w-40 h-[2px] bg-primary rounded-full mx-auto mt-2" />
              </div>

              {kegiatanData.length > 0
                ? kegiatanData.map((item) => (
                    <KegiatanTerbaru
                      key={item.id}
                      item={{ ...item, tanggal: item.tanggal_mulai }}
                      variant="large"
                    />
                  ))
                : Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 h-48 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Belum ada kegiatan</p>
                    </div>
                  ))
              }

              {/* Berita — judul mobile only */}
              <div className="sm:hidden text-center mt-4 mb-1">
                <h2 className="text-xl font-bold">Berita Terbaru</h2>
                <div className="w-40 h-[2px] bg-primary rounded-full mx-auto mt-2" />
              </div>

              {beritaData.length > 0
                ? beritaData.map((item) => (
                    <BeritaTerbaru key={item.id} item={item} variant="large" />
                  ))
                : Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 h-48 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Belum ada berita</p>
                    </div>
                  ))
              }
            </>
          )}
        </div>
      </div>

      {/* ── HIGHLIGHT ANGKA ────────────────────────────────────────────────── */}
      <div className="px-5 py-14">
        <div className="bg-primary text-white rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Users className="mx-auto mb-2 w-7 h-7 opacity-90" />
              <p className="text-4xl font-extrabold">100+</p>
              <p className="text-sm opacity-90">Anggota Aktif</p>
            </div>
            <div>
              <Users className="mx-auto mb-2 w-7 h-7 opacity-90" />
              <p className="text-4xl font-extrabold">50+</p>
              <p className="text-sm opacity-90">Pengurus Harian</p>
            </div>
            <div>
              <CalendarCheck className="mx-auto mb-2 w-7 h-7 opacity-90" />
              <p className="text-4xl font-extrabold">50+</p>
              <p className="text-sm opacity-90">Kegiatan</p>
            </div>
            <div>
              <ClipboardList className="mx-auto mb-2 w-7 h-7 opacity-90" />
              <p className="text-4xl font-extrabold">20+</p>
              <p className="text-sm opacity-90">Program Kerja</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}