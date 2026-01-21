import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { CalendarDays } from "lucide-react"
import Link from "next/link"


type KegiatanCardProps = {
    id: number
    judul: string
    deskripsi: string
    tanggal: string
    image: string
}

export default function KegiatanCard({ id, judul, deskripsi, tanggal, image }: KegiatanCardProps) {
  return (
    
    <Card className="aspect-square flex flex-col shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="p-2">
            <div className="relative h-56 group">
                <Image
                src={image}
                alt={judul}
                fill
                className="object-contain rounded-none"
                />

                <div className="
                    absolute inset-0 
                    bg-black/0 
                    group-hover:bg-black/60 
                    transition-all duration-300
                    flex items-center justify-center
                    ">
                    <Link
                     href={`/kegiatan/${id}`}
                     className="
                        opacity-0 translate-y-4
                        group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300
                        bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold
                    ">
                        Baca selengkapnya
                    </Link>
                </div>
            </div>
        </div>
      <CardHeader>
        <CardTitle>{judul}</CardTitle>
        <CardDescription className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4"/> {tanggal}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 text-sm">
        {deskripsi}
      </CardContent>
    </Card>
  )
}
