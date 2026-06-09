"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import BeritaCard from "@/components/berita/berita_card"
import { Search, Newspaper, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Berita = {
  id: number
  judul: string
  tanggal: string
  gambar: string[]
  kategori?: {
    nama: string
  }
}

const PAGE_SIZE = 8

export default function BeritaPage() {
  const [search, setSearch] = useState("")
  const [dataBerita, setDataBerita] = useState<Berita[]>([])
  const [kategoriList, setKategoriList] = useState<string[]>([])
  const [selectedKategori, setSelectedKategori] = useState("all")
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const filterRef = useRef({ search, selectedKategori })

  useEffect(() => {
    filterRef.current = { search, selectedKategori }
  }, [search, selectedKategori])

  // Fetch kategori sekali saja
  useEffect(() => {
    const fetchKategori = async () => {
      const { data, error } = await supabase
        .from("kategori")
        .select("nama")
        .order("nama", { ascending: true })

      if (!error && data) {
        setKategoriList(["all", ...data.map((k: any) => k.nama)])
      }
    }
    fetchKategori()
  }, [])

  const fetchPage = useCallback(async (pageIndex: number) => {
    setLoading(true)
    const { search, selectedKategori } = filterRef.current

    let query = supabase
      .from("berita")
      .select(`*, kategori(nama)`, { count: "exact" })
      .eq("status", "publish")
      .order("tanggal", { ascending: false })
      .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1)

    if (search) {
      query = query.ilike("judul", `%${search}%`)
    }

    if (selectedKategori !== "all") {
      query = query.eq("kategori.nama", selectedKategori)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error berita:", error)
      setLoading(false)
      return
    }

    const filtered = (data ?? []).filter((item: Berita) =>
      selectedKategori === "all" ? true : item.kategori?.nama === selectedKategori
    )

    setDataBerita((prev) =>
      pageIndex === 0 ? filtered : [...prev, ...filtered]
    )
    setTotalCount(count ?? 0)
    setHasMore((pageIndex + 1) * PAGE_SIZE < (count ?? 0))
    setLoading(false)
  }, [])

  // Reset saat filter/search berubah
  useEffect(() => {
    setDataBerita([])
    setPage(0)
    setHasMore(true)
    fetchPage(0)
  }, [search, selectedKategori, fetchPage])

  // Fetch saat page bertambah
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
      { rootMargin: "200px" }
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
            SEMUA BERITA
          </h1>
          <span className="flex flex-row gap-2 text-xs md:text-base text-muted-foreground items-center">
            <Newspaper className="w-3 md:w-5 h-3 md:h-5" />
            {totalCount} berita tersedia
          </span>
        </div>

        <div className="flex gap-3 w-full md:max-w-md md:pr-5">
          <Select
            value={selectedKategori}
            onValueChange={(value) => setSelectedKategori(value)}
          >
            <SelectTrigger className="h-10 w-[140px] md:w-[160px] border border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((kat) => (
                <SelectItem key={kat} value={kat}>
                  {kat === "all" ? "Semua Kategori" : kat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full h-10
                border border-primary
                rounded-xl
                pl-4 pr-12
                py-1 md:p-3
                outline-none
                focus:ring-2 focus:ring-primary
              "
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dataBerita.length > 0 ? (
          dataBerita.map((item) => (
            <BeritaCard
              key={item.id}
              id={item.id}
              judul={item.judul}
              tanggal={item.tanggal}
              kategori={item.kategori?.nama || "-"}
              image={item.gambar?.[0]}
            />
          ))
        ) : !loading ? (
          <p className="col-span-2 lg:col-span-4 text-center text-gray-500 italic">
            {selectedKategori !== "all"
              ? `Tidak ada berita untuk kategori "${selectedKategori}"`
              : "Tidak ada berita ditemukan"}
          </p>
        ) : null}
      </div>

      {/* Sentinel + loading indicator */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {loading && (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        )}
        {!hasMore && dataBerita.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Semua berita sudah ditampilkan
          </p>
        )}
      </div>
    </div>
  )
}