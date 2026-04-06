-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "pembuat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);
