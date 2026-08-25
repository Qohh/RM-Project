
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 8;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "0");
    const search = searchParams.get("search") ?? "";
    const kategori = searchParams.get("kategori") ?? "all";

    const skip = page * PAGE_SIZE;

    const where = {
      status: "publish",

      ...(search
        ? {
            judul: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(kategori !== "all"
        ? {
            kategori: {
              nama: kategori,
            },
          }
        : {}),
    };

    const [berita, totalCount] = await Promise.all([
      prisma.berita.findMany({
        where,
        select: {
          id: true,
          judul: true,
          tanggal: true,
          gambar: true,
          kategori: {
            select: {
              nama: true,
            },
          },
        },
        orderBy: {
          tanggal: "desc",
        },
        skip,
        take: PAGE_SIZE,
      }),

      prisma.berita.count({
        where,
      }),
    ]);

    return NextResponse.json({
      data: berita,
      count: totalCount,
    });
  } catch (error) {
    console.error("Error berita:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data berita" },
      { status: 500 }
    );
  }
}

