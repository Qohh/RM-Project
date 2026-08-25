import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pengurus = await prisma.pengurus.findMany({
      include: {
        jabatan: {
          select: {
            nama: true,
          },
        },
        bidang: {
          select: {
            nama: true,
          },
        },
      },
    })

    const safePengurus = JSON.parse(
      JSON.stringify(pengurus, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )

    return NextResponse.json(safePengurus)
  } catch (error) {
    console.error("Gagal mengambil data pengurus:", error)

    return NextResponse.json(
      { error: "Gagal mengambil data pengurus" },
      { status: 500 }
    )
  }
}