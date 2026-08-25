
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kategori = await prisma.kategori.findMany({
      select: {
        nama: true,
      },
      orderBy: {
        nama: "asc",
      },
    });

    return NextResponse.json(kategori);
  } catch (error) {
    console.error("Error kategori:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

