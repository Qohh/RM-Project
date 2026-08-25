
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const { Pool } = pg;

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// =========================
// POSTGRESQL LOCAL
// =========================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// =========================
// NORMALISASI JSON
// =========================

function normalizeJson(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(value);
    }
  }

  return JSON.stringify(value);
}

// =========================
// MIGRASI
// =========================

async function migrate() {
  try {
    console.log("Mengambil data kegiatan dari Supabase...");

    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data kegiatan untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const kegiatan of data) {
      await pool.query(
        `
        INSERT INTO public.kegiatan (
          id,
          judul,
          deskripsi,
          lokasi,
          gambar,
          status,
          tanggal_mulai,
          waktu_mulai,
          tanggal_selesai,
          waktu_selesai,
          created_at,
          updated_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12
        )
        ON CONFLICT (id)
        DO UPDATE SET
          judul = EXCLUDED.judul,
          deskripsi = EXCLUDED.deskripsi,
          lokasi = EXCLUDED.lokasi,
          gambar = EXCLUDED.gambar,
          status = EXCLUDED.status,
          tanggal_mulai = EXCLUDED.tanggal_mulai,
          waktu_mulai = EXCLUDED.waktu_mulai,
          tanggal_selesai = EXCLUDED.tanggal_selesai,
          waktu_selesai = EXCLUDED.waktu_selesai,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          kegiatan.id,
          kegiatan.judul,
          kegiatan.deskripsi,
          kegiatan.lokasi,
          normalizeJson(kegiatan.gambar),
          kegiatan.status,
          kegiatan.tanggal_mulai,
          kegiatan.waktu_mulai,
          kegiatan.tanggal_selesai,
          kegiatan.waktu_selesai,
          kegiatan.created_at,
          kegiatan.updated_at,
        ]
      );
    }

    console.log("✅ Migrasi kegiatan berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(`
      SELECT
        id,
        judul,
        deskripsi,
        lokasi,
        status,
        tanggal_mulai,
        waktu_mulai,
        tanggal_selesai,
        waktu_selesai,
        created_at,
        updated_at
      FROM public.kegiatan
      ORDER BY id ASC
    `);

    console.log("\nData kegiatan di PostgreSQL:");
    console.table(result.rows);

    console.log(
      `\nTotal data di PostgreSQL: ${result.rows.length} baris`
    );

  } catch (error) {
    console.error("❌ Migrasi gagal:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();

