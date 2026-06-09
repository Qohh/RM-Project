"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import KegiatanCard from "@/components/kegiatan/kegiatan_card"
import { Search, CalendarDays, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE = 8

export default function KegiatanPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dataKegiatan, setDataKegiatan] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  // Simpan nilai filter terbaru agar fetchPage bisa akses tanpa stale closure
  const filterRef = useRef({ search, filterStatus })

  useEffect(() => {
    filterRef.current = { search, filterStatus }
  }, [search, filterStatus])

  const fetchPage = useCallback(async (pageIndex: number) => {
    setLoading(true)
    const { search, filterStatus } = filterRef.current

    const now = new Date().toISOString()
    let query = supabase
      .from("kegiatan")
      .select("*", { count: "exact" })
      .eq("status", "publish")
      .order("tanggal_mulai", { ascending: false })
      .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1)

    if (search) {
      query = query.ilike("judul", `%${search}%`)
    }

    // Filter status dilakukan di Supabase langsung
    if (filterStatus === "upcoming") {
      query = query.gt("tanggal_mulai", now.split("T")[0])
    } else if (filterStatus === "selesai") {
      query = query.lt("tanggal_selesai", now.split("T")[0])
    }
    // "ongoing" tetap filter di client karena butuh gabungan tanggal+waktu

    const { data, error, count } = await query

    if (error) {
      console.error("Error:", error)
      setLoading(false)
      return
    }

    let filtered = data ?? []

    // Filter ongoing lebih presisi di client
    if (filterStatus === "ongoing") {
      const nowDate = new Date()
      filtered = filtered.filter((item) => {
        const start = new Date(`${item.tanggal_mulai}T${item.waktu_mulai}`)
        const end = new Date(`${item.tanggal_selesai}T${item.waktu_selesai}`)
        return nowDate >= start && nowDate <= end
      })
    }

    setDataKegiatan((prev) =>
      pageIndex === 0 ? filtered : [...prev, ...filtered]
    )
    setTotalCount(count ?? 0)
    setHasMore((pageIndex + 1) * PAGE_SIZE < (count ?? 0))
    setLoading(false)
  }, [])

  // Reset saat filter/search berubah
  useEffect(() => {
    setDataKegiatan([])
    setPage(0)
    setHasMore(true)
    fetchPage(0)
  }, [search, filterStatus, fetchPage])

  // Fetch saat page bertambah (kecuali page 0 sudah ditangani di atas)
  useEffect(() => {
    if (page === 0) return
    fetchPage(page)
  }, [page, fetchPage])

  // Setup IntersectionObserver
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: "200px" } // mulai fetch 200px sebelum sentinel kelihatan
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loading])

  return (
    <div className="max-w-7xl mx-auto mt-24 p-5 space-y-5 ml-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-bold text-primary text-left mb-1">
            SEMUA KEGIATAN
          </h1>
          <span className="flex flex-row gap-2 text-xs md:text-base text-muted-foreground items-center">
            <CalendarDays className="w-3 md:w-5 h-3 md:h-5" />
            {totalCount} kegiatan tersedia
          </span>
        </div>

        <div className="flex gap-3 w-full md:max-w-md md:pr-5">
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="h-10 w-[140px] md:w-[160px] border border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border border-primary rounded-xl pl-4 pr-12 py-1 md:p-3 outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dataKegiatan.length > 0 ? (
          dataKegiatan.map((item) => (
            <KegiatanCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              deskripsi={item.deskripsi}
              tanggalMulai={item.tanggal_mulai}
              waktuMulai={item.waktu_mulai}
              tanggalSelesai={item.tanggal_selesai}
              waktuSelesai={item.waktu_selesai}
              image={item.gambar?.[0]}
            />
          ))
        ) : !loading ? (
          <p className="col-span-2 lg:col-span-4 text-center text-gray-500 italic">
            Tidak ada kegiatan ditemukan
          </p>
        ) : null}
      </div>

      {/* Sentinel + loading indicator */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {loading && (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        )}
        {!hasMore && dataKegiatan.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Semua kegiatan sudah ditampilkan
          </p>
        )}
      </div>
    </div>
  )
}