import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const profil = await prisma.profil.findUnique({
      where: {
        id: 1,
      },
    })

    if (!profil) {
      return NextResponse.json(
        { error: "Data profil tidak ditemukan" },
        { status: 404 }
      )
    }

    const safeProfil = JSON.parse(
      JSON.stringify(profil, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )

    return NextResponse.json(safeProfil)
  } catch (error) {
    console.error("Gagal mengambil data profil:", error)

    return NextResponse.json(
      { error: "Gagal mengambil data profil" },
      { status: 500 }
    )
  }
}