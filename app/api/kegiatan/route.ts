import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const PAGE_SIZE = 8

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const exclude = searchParams.get("exclude")
    const page = Number(searchParams.get("page") || 0)
    const limit = Number(searchParams.get("limit") || PAGE_SIZE)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const where: any = {
      status: "publish",
    }

    if (search) {
      where.judul = {
        contains: search,
        mode: "insensitive",
      }
    }

    if (status === "upcoming") {
      where.tanggal_mulai = {
        gt: today,
      }
    } else if (status === "selesai") {
      where.tanggal_selesai = {
        lt: today,
      }
    }

    if (exclude) {
  where.id = {
    not: exclude,
  }
}

    if (id) {
  const kegiatan = await prisma.kegiatan.findUnique({
    where: {
      id: id,
    },
  })

  if (!kegiatan) {
    return NextResponse.json(
      { error: "Kegiatan tidak ditemukan" },
      { status: 404 }
    )
  }

  const safeKegiatan = JSON.parse(
    JSON.stringify(kegiatan, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )

  return NextResponse.json(safeKegiatan)
}

    const [kegiatan, totalCount] = await Promise.all([
      prisma.kegiatan.findMany({
        where,
        orderBy: {
          tanggal_mulai: "desc",
        },
        skip: page * limit,
        take: limit,
      }),
      prisma.kegiatan.count({
        where,
      }),
    ])

    const safeKegiatan = JSON.parse(
      JSON.stringify(kegiatan, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )

    return NextResponse.json({
      data: safeKegiatan,
      totalCount,
    })
  } catch (error) {
    console.error("Gagal mengambil data kegiatan:", error)

    return NextResponse.json(
      { error: "Gagal mengambil data kegiatan" },
      { status: 500 }
    )
  }
}