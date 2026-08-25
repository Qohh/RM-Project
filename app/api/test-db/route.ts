import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kegiatan = await prisma.kegiatan.findMany({
      take: 5,
    });

    return NextResponse.json(kegiatan);
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data dari PostgreSQL" },
      { status: 500 }
    );
  }
}