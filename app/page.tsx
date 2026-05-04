"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import KegiatanSlider from "@/components/informasi_slider"
import Informasi_slider from "@/components/informasi_slider"
import KegiatanTerbaru from "@/components/kegiatan/kegiatan_terbaru"
import BeritaTerbaru from "@/components/berita/berita_terbaru"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { Users, CalendarDays, BarChart3, CalendarCheck, ClipboardList } from "lucide-react"

export default function BerandaPage() {
    const images = [
    "/Foto-Pengurus-Full.png",
    "/Foto-Pengurus-Akhwat.png",
    "/Foto-Pengurus-Ikhwan.png",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

useEffect(() => {
  images.forEach((src) => {
    const img = new window.Image()
    img.src = src
  })
}, [])


const [prayerTimes, setPrayerTimes] = useState<any>(null)
const [currentTime, setCurrentTime] = useState("--:--")
const [nextPrayer, setNextPrayer] = useState<any>({ name: "-", time: "-" })
const [nextMinutes, setNextMinutes] = useState(0)
const getToday = () => {
  const d = new Date()
  return d.toLocaleDateString("en-CA") // format: YYYY-MM-DD
}

const [beritaData, setBeritaData] = useState<any[]>([])

useEffect(() => {
  async function fetchBerita() {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("tanggal", { ascending: false })
      .limit(4)

    if (error) {
      console.error(error)
    } else {
      setBeritaData(data)
    }
  }

  fetchBerita()
}, [])

// helper
function getTimeToday(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number)
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
}

// fetch + logic
useEffect(() => {
  async function fetchPrayerTime() {
    const res = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Pontianak&country=Indonesia&method=20"
    )
    const json = await res.json()

    const times = json.data.timings

    setPrayerTimes(times)

    const now = new Date()

    const list = [
      { name: "Subuh", time: times.Fajr },
      { name: "Dzuhur", time: times.Dhuhr },
      { name: "Ashar", time: times.Asr },
      { name: "Maghrib", time: times.Maghrib },
      { name: "Isya", time: times.Isha },
    ]

    const next =
      list.find((p) => getTimeToday(p.time) > now) || list[0]

    setNextPrayer(next)

    const diff =
      getTimeToday(next.time).getTime() - now.getTime()

    setNextMinutes(Math.floor(diff / (1000 * 60)))
  }

  fetchPrayerTime()

  const interval = setInterval(() => {
    const now = new Date()
    setCurrentTime(
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }, 1000)

  return () => clearInterval(interval)
}, [])  

const formatMinutes = (minutes: number) => {
  const jam = Math.floor(minutes / 60)
  const sisaMenit = minutes % 60

  if (jam > 0 && sisaMenit > 0) {
    return `${jam} jam ${sisaMenit} menit`
  }
  if (jam > 0) {
    return `${jam} jam`
  }
  return `${sisaMenit} menit`
}

const formatDate = (d: Date) => {
  return d.toLocaleDateString("en-CA")
}

  return (
    <div className="mt-28">
     <div className="flex flex-col md:flex-row items-stretch gap-5 px-5 pt-5 pb-10">

  {/* KIRI (HERO) */}
  <div className="w-full md:w-2/3 relative h-[400px]">
    <Image
      src={images[currentIndex]}
      alt="Foto"
      fill
      priority={currentIndex === 0}
      unoptimized
      className="object-cover rounded-2xl"
    />

    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f0f9ff] to-transparent" />

    <div className="absolute inset-0 flex items-end p-6">
      <h2 className="text-white text-2xl md:text-4xl font-bold">
        Ahlan Wa Sahlan!
      </h2>
    </div>
  </div>

  {/* KANAN (PRAYER) */}
  <div className="w-full md:w-1/3 flex flex-col h-[400px]">

    {/* 🔥 JUDUL DI LUAR CARD */}
    <h3 className="text-3xl text-center font-bold text-primary mb-3">
      🕌 Waktu Adzan
    </h3>

    {/* CARD */}
    <div className="bg-white rounded-2xl border shadow-sm p-4 flex-1 flex flex-col">

      {/* TOP INFO */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Sekarang</p>
          <h1 className="text-2xl font-bold text-primary">
            {currentTime}
          </h1>
        </div>

        <div className="bg-primary/10 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-600">Selanjutnya</p>
          <p className="font-semibold text-primary">
            {nextPrayer.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatMinutes(nextMinutes)}
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2.5 overflow-auto">
        {[
          { label: "Subuh", key: "Fajr" },
          { label: "Dzuhur", key: "Dhuhr" },
          { label: "Ashar", key: "Asr" },
          { label: "Maghrib", key: "Maghrib" },
          { label: "Isya", key: "Isha" },
        ].map((item) => {
          const active = nextPrayer.name === item.label

          return (
            <div
              key={item.key}
              className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm transition
              ${
                active
                  ? "bg-primary text-white font-semibold shadow"
                  : "bg-gray-50"
              }`}
            >
              <span>{item.label}</span>
              <span>{prayerTimes?.[item.key] || "--:--"}</span>
            </div>
          )
        })}
      </div>

    </div>
  </div>

</div>

<div className="bg-white rounded-xl p-5">

  <h1 className="text-center text-2xl font-bold">
    Berita Terbaru
  </h1>

  <div className="mx-auto mt-2 mb-6 w-40 h-[2px] bg-primary rounded-full" />

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
    {beritaData.map(item => (
      <BeritaTerbaru
        key={item.id}
        item={item}
        variant="large"
      />
    ))}
  </div>

</div>

{/* HIGHLIGHT ANGKA */}
<div className="px-5 py-14">
  <div className="bg-primary text-white rounded-xl p-8">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">


      {/* Anggota */}
      <div>
        <Users className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">100+</p>
        <p className="text-sm opacity-90">
          Anggota Aktif
        </p>
      </div>

      <div>
        <Users className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">50+</p>
        <p className="text-sm opacity-90">
          Pengurus Harian
        </p>
      </div>

      {/* Kegiatan */}
      <div>
        <CalendarCheck className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">50+</p>
        <p className="text-sm opacity-90">
          Kegiatan
        </p>
      </div>

      {/* Program */}
      <div>
        <ClipboardList className="mx-auto mb-2 w-7 h-7 opacity-90" />
        <p className="text-4xl font-extrabold">20+</p>
        <p className="text-sm opacity-90">
          Program Kerja
        </p>
      </div>

    </div>
  </div>
</div>
      <Footer/>
    </div>      
  )
}
