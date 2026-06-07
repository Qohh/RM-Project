import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

type KegiatanCardProps = {
  id: number
  judul: string
  deskripsi: string
  tanggalMulai: string
  waktuMulai: string
  tanggalSelesai: string
  waktuSelesai: string
  image: string
}

export default function KegiatanCard({
  id,
  judul,
  deskripsi,
  tanggalMulai,
  waktuMulai,
  tanggalSelesai,
  waktuSelesai,
  image,
}: KegiatanCardProps) {

const getStatus = (
  tanggalMulai: string,
  waktuMulai: string,
  tanggalSelesai: string,
  waktuSelesai: string
) => {
  const now = new Date()

  const start = new Date(`${tanggalMulai}T${waktuMulai}`)
  const end = new Date(`${tanggalSelesai}T${waktuSelesai}`)

  if (now < start) return "upcoming"
  if (now >= start && now <= end) return "ongoing"
  return "selesai"
}

const status = getStatus(
  tanggalMulai,
  waktuMulai,
  tanggalSelesai,
  waktuSelesai
)

  return (
    <Card className="flex flex-col shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* IMAGE */}
      <div className="p-2">
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={image || "/placeholder.png"}
            alt={judul}
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div
            className="
              absolute inset-0 
              bg-black/0 
              group-hover:bg-black/60 
              transition-all duration-300
              flex items-center justify-center
            "
          >
            <Link
              href={`/kegiatan/${id}`}
              className="
                opacity-0 translate-y-4
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300
                bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold
              "
            >
              Baca selengkapnya
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <CardHeader className="space-y-2">

      <div className="flex items-center justify-between">

        {/* TANGGAL */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          {new Date(tanggalMulai).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* STATUS BADGE */}
        <span
          className={`
            text-white text-xs px-2 py-1 rounded-full
            ${
              status === "upcoming"
                ? "bg-yellow-500"
                : status === "ongoing"
                ? "bg-blue-500"
                : "bg-gray-500"
            }
          `}
        >
          {status === "upcoming"
            ? "Upcoming"
            : status === "ongoing"
            ? "Ongoing"
            : "Selesai"}
        </span>

      </div>

        {/* JUDUL */}
        <CardTitle className="line-clamp-3 leading-relaxed">
          {judul}
        </CardTitle>

      </CardHeader>
    </Card>
  )
}