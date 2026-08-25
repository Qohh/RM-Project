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
  // Jika kosong
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  // Jika sudah object atau array
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  // Jika string
  if (typeof value === "string") {
    try {
      // Cek apakah sudah JSON valid
      JSON.parse(value);

      return value;
    } catch {
      // Jika bukan JSON valid,
      // simpan sebagai JSON string
      return JSON.stringify(value);
    }
  }

  // Tipe data lainnya
  return JSON.stringify(value);
}

// =========================
// MIGRASI
// =========================

async function migrate() {
  try {
    console.log("Mengambil data berita dari Supabase...");

    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data berita untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const berita of data) {
      await pool.query(
        `
        INSERT INTO public.berita (
          id,
          kategori_id,
          judul,
          isi,
          gambar,
          status,
          tanggal,
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
          $9
        )
        ON CONFLICT (id)
        DO UPDATE SET
          kategori_id = EXCLUDED.kategori_id,
          judul = EXCLUDED.judul,
          isi = EXCLUDED.isi,
          gambar = EXCLUDED.gambar,
          status = EXCLUDED.status,
          tanggal = EXCLUDED.tanggal,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          berita.id,
          berita.kategori_id,
          berita.judul,
          berita.isi,

          // Normalisasi gambar JSON
          normalizeJson(berita.gambar),

          berita.status,
          berita.tanggal,
          berita.created_at,
          berita.updated_at,
        ]
      );
    }

    console.log("✅ Migrasi berita berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(`
      SELECT
        id,
        kategori_id,
        judul,
        status,
        tanggal,
        created_at,
        updated_at
      FROM public.berita
      ORDER BY id ASC
    `);

    console.log("\nData berita di PostgreSQL:");
    console.table(result.rows);

    console.log(`\nTotal data di PostgreSQL: ${result.rows.length} baris`);

  } catch (error) {
    console.error("❌ Migrasi gagal:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();
