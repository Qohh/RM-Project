"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

type PrayerTimes = {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

function getTimeToday(timeStr: string) {
  if (!timeStr) throw new Error("Invalid prayer time")

  const [hours, minutes] = timeStr.split(":").map(Number)
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
}

function fixHijriMonth(text: string) {
  return text.replace("Syakban", "Sya'ban")
}

function getRamadhanInfo() {
  const RAMADHAN_START = new Date("2026-02-18")

  const today = new Date()

  RAMADHAN_START.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - RAMADHAN_START.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

   //Masehi
  const masehi = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  //Hijriyah
  let hijriyah = today.toLocaleDateString("id-ID-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

   hijriyah = fixHijriMonth(hijriyah)

  if (diffDays < 0) {
    return {
      type: "before",
      value: Math.abs(diffDays),
      title: `H-${Math.abs(diffDays)} Menuju Ramadhan🌙`,
      masehi,
      hijriyah
    }
  }

  if (diffDays >= 0 && diffDays < 30) {
    return {
      type: "ramadhan",
      value: diffDays + 1,
      title: `Ramadhan Day ${diffDays + 1}`,
      masehi,
      hijriyah
    }
  }

  return {
    type: "after",
    value: diffDays - 29,
    title: "Ramadhan telah berakhir",
  }
}

function useRamadhanCountdown() {
 const [now, setNow] = useState(new Date())
 const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
 const [testHour, setTestHour] = useState<number | null>(null)

useEffect(() => {
  const interval = setInterval(() => {
    const realNow = new Date()

    // Kalau test mode aktif
    if (testHour !== null) {
      const simulated = new Date(realNow)
      simulated.setHours(testHour, realNow.getMinutes(), realNow.getSeconds())
      setNow(simulated)
    } 
    // Kalau tidak test mode → realtime normal
    else {
      setNow(realNow)
    }
  }, 1000)

  return () => clearInterval(interval)
}, [testHour])

  // FETCH API JADWAL SHOLAT
  useEffect(() => {
    async function fetchPrayerTime() {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Pontianak&country=Indonesia&method=20"
        )
        const json = await res.json()
        setPrayerTimes({
          Fajr: json.data.timings.Fajr,
          Sunrise: json.data.timings.Sunrise,
          Dhuhr: json.data.timings.Dhuhr,
          Asr: json.data.timings.Asr,
          Maghrib: json.data.timings.Maghrib,
          Isha: json.data.timings.Isha,
        })
      } catch (err) {
        console.error("Failed to load prayer times", err)
      }
    }

    fetchPrayerTime()
  }, [])

if (!prayerTimes) {
  return {
    mode: "quote",
    hours: 0,
    minutes: 0,
    seconds: 0,
    prayerTimes: {
      Fajr: "--:--",
      Sunrise: "--:--",
      Dhuhr: "--:--",
      Asr: "--:--",
      Maghrib: "--:--",
      Isha: "--:--",
    },
    currentTime: "--:--",
    nextPrayer: { key: "-", name: "-", time: "--:--" },
    nextMinutes: 0,
    testHour,
    setTestHour,
  }
}

  const prayerList = [
    { name: "Subuh", time: prayerTimes.Fajr },
    { name: "Terbit", time: prayerTimes.Sunrise },
    { name: "Zuhur", time: prayerTimes.Dhuhr },
    { name: "Asar", time: prayerTimes.Asr },
    { name: "Maghrib", time: prayerTimes.Maghrib },
    { name: "Isya", time: prayerTimes.Isha },
  ]

  const nextPrayer =
    prayerList.find((p) => getTimeToday(p.time) > now) || prayerList[0]

  const nextPrayerTime = getTimeToday(nextPrayer.time)

  const diffNext = nextPrayerTime.getTime() - now.getTime()
  const nextMinutes = Math.max(0, Math.floor(diffNext / (1000 * 60)))

  const currentTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const maghrib = getTimeToday(prayerTimes.Maghrib)
  const isha = getTimeToday(prayerTimes.Isha)

  const noon = new Date()
  noon.setHours(12, 0, 0, 0)

  let mode: "quote" | "countdown" | "iftar" = "quote"

  if (now >= noon && now < maghrib) mode = "countdown"
  else if (now >= maghrib && now < isha) mode = "iftar"

  const diff = maghrib.getTime() - now.getTime()
  const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60))
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60))

  return { mode, hours, minutes, seconds, testHour, setTestHour, prayerTimes, currentTime, nextPrayer, nextMinutes }
}


export default function RamadhanPage() {
  const ramadhan = getRamadhanInfo()
  const { mode, hours, minutes, seconds, testHour, setTestHour, prayerTimes, currentTime, nextPrayer, nextMinutes } = useRamadhanCountdown()
  const [showImage, setShowImage] = useState<string | null>(null)
  useEffect(() => {
    if (showImage) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [showImage])

  const availableDays = [1] // cuma hari 1 yang terbuka

  return (
    <div>
    <div className="flex gap-7 items-stretch px-7 py-7">
      <div className="flex flex-col gap-4 flex-1">
        <section className="bg-primary p-5 rounded-xl">
          <h1 className="text-center font-bold text-3xl text-white">
            {ramadhan.title}
          </h1>
          <h2 className="text-white/90 text-base text-center mt-2">
            {ramadhan.masehi} • {ramadhan.hijriyah}
          </h2>
        </section>

        <section className="flex flex-col items-center justify-center bg-white border-2 border-primary rounded-xl text-center h-24 ">
          {mode === "countdown" && (
            <>
              <h2 className="text-xl font-semibold">Menuju Waktu Berbuka</h2>
              <p className="text-4xl font-bold tracking-wider text-primary">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </p>
            </>
          )}

          {mode === "iftar" && (
            <h2 className="text-3xl font-bold">
              🌙 Selamat Berbuka Puasa 🌙
            </h2>
          )}

          {mode === "quote" && (
            //bisa tambah komponen khusus ayat al-qur'an
            <p className="italic text-sm px-5">
              يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ كَمَا كُتِبَ عَلَى ٱلَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ
              <br></br>
              "Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa."
            </p>
          )}
        </section>

    {/* DEV TEST PANEL */}
    {/*
    <div className=" bg-black/10 p-2 rounded-md w-48">
      <p className="text-sm font-semibold">Panel Testing Waktu</p>

      <input
        type="range"
        min={0}
        max={23}
        value={testHour ?? new Date().getHours()}
        onChange={(e) => setTestHour(Number(e.target.value))}
        className="w-full"
      />

      <p className="text-sm">
        Jam simulasi:{" "}
        <span className="font-bold">
          {testHour !== null ? `${testHour}:00` : "Realtime"}
        </span>
      </p>

      <button
        onClick={() => setTestHour(null)}
        className="text-xs underline text-muted-foreground"
      >
        Reset ke waktu asli
      </button>
    </div> 
    */}
    </div>

    <section className="bg-white rounded-xl border-2 border-primary p-5 h-46 flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-2">Jadwal Sholat</h2>
      <p className="text-sm text-gray-600">
        Waktu sholat selanjutnya:
        <span className="font-semibold text-black"> {nextPrayer.name} </span>
        dalam <span className="font-semibold">{nextMinutes} menit</span>
      </p>

      {/* CURRENT TIME */}
      <h1 className="text-4xl font-bold text-primary tracking-wide">
        {currentTime}
      </h1>

      {/* GRID PRAYER */}
      <div className="grid grid-cols-6 text-center gap-3 pt-2">
        {[
          { label: "Subuh", key: "Fajr" },
          { label: "Terbit", key: "Sunrise" },
          { label: "Zuhur", key: "Dhuhr" },
          { label: "Asar", key: "Asr" },
          { label: "Maghrib", key: "Maghrib" },
          { label: "Isya", key: "Isha" },
        ].map((item) => (
          <div
            key={item.key}
            className={
              nextPrayer.name === item.label
                ? "text-primary font-bold"
                : ""
            }
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-semibold">
              {prayerTimes[item.key as keyof PrayerTimes]}
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>

  <div className="pb-5">
    <div className="flex flex-wrap justify-center gap-2 px-6">
      {Array.from({ length: 30 }).map((_, i) => {
        const day = i + 1
        const unlocked = availableDays.includes(day)

        return (
          <button
            key={day}
            disabled={!unlocked}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all
              ${unlocked 
                ? "bg-primary text-white shadow-md hover:scale-110 cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {day}
          </button>
        )
      })}
    </div>
  </div>

  <div className="bg-white h-auto pb-10">
    <div className="flex gap-2">

      <div className="flex flex-1 items-center justify-center p-10">
        <img 
          src="/ramadhan/dokumentasi-iftar.jpeg" 
          alt="Dokumentasi Iftar" 
          className="rounded-xl aspect-square object-cover border-primary border-2 shadow-lg"
        />
      </div>

      <div className="flex flex-col gap-2 py-14">
        <div className="flex flex-col items-center">
          <div>
            <p className=" font-bold text-3xl py-5">Total Jama'ah Iftar</p>
          </div>
          <div className="bg-primary/10 border-2 border-primary rounded-xl p-3 text-center w-48 shadow-lg">
            <p className="text-4xl font-bold text-black tracking-wider">
              0275
            </p>
            <p className="text-xs text-gray-500">
              Jamaah
            </p>
          </div>
        </div> 

        <section className="flex">
          <div className="flex flex-col gap-2 flex-1 items-center">
            <h1 className="text-center text-xl font-bold">Akhwat</h1>
            <div className="border-2 border-primary rounded-xl p-3 text-center w-48 shadow-lg">
            <p className="text-4xl font-bold text-black tracking-wider">
              0114
            </p>
            <p className="text-xs text-gray-500">
              Jamaah
            </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 items-center pl-5">
            <h1 className="text-center text-xl font-bold">Ikhwan</h1>
            <div className="border-2 border-primary rounded-xl p-3 text-center w-48 shadow-lg">
            <p className="text-4xl font-bold text-black tracking-wider">
              0161
            </p>
            <p className="text-xs text-gray-500">
              Jamaah
            </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex-1 flex items-center justify-center p-14">
        <img 
          src="/ramadhan/total-jamaah-iftar.jpeg" 
          alt="Dokumentasi Iftar" 
          className="rounded-xl aspect-square object-cover border-primary border-2 shadow-lg"
        />
      </div>

    </div>  
    <h2 className="text-center text-base font-normal text-gray-500 italic">
      "Selamat menunaikan ibadah puasa Ramadhan, semoga Allah menerima ibadah kita di bulan yang penuh berkah ini✨."
    </h2>
  </div>

  <div className="flex gap-16 p-10">
    <section className="flex flex-row bg-white border-primary border-2 w-1/2 rounded-xl justify-center items-center px-10">
      <div className="flex flex-col">
        <h2 className="text-center font-bold text-3xl py-6">
          Info Kajian Besok
        </h2>
     
        <img 
          src="/KJB.jpeg" 
          alt="Info-Kajian-Besok" 
          onClick={() => setShowImage("/KJB.jpeg")}
          className="rounded-xl aspect-square object-contain pb-10 cursor-pointer hover:opacity-80"
        />
      </div>
    </section>

<section className="flex flex-row bg-white border-primary border-2 w-1/2 rounded-xl justify-center items-center px-10">
      <div className="flex flex-col">
        <h2 className="text-center font-bold text-3xl py-6">
          Info Donasi Iftar
        </h2>
     
        <img 
          src="/ramadhan/info-donasi.jpeg" 
          alt="Info-Donasi-Iftar" 
          onClick={() => setShowImage("/ramadhan/info-donasi.jpeg")}
          className="rounded-xl aspect-square object-contain pb-10 cursor-pointer hover:opacity-80"
        />
      </div>
    </section>
  </div>

<footer className="bg-primary text-white pb-5 pt-7">
  <div className="max-w-6xl mx-auto grid grid-cols-2 divide-x divide-white/30 pb-5">
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

 {showImage && (
  <div 
    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] overscroll-none"
    onClick={() => setShowImage(null)}
  >
    <img 
      src={showImage}
      onClick={(e) => e.stopPropagation()}
      className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain transition-transform duration-300 hover:scale-105"
    />
  </div>
)}

  </div>
    
  )
}
