
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
// NORMALISASI RIWAYAT
// =========================

function normalizeRiwayat(riwayat) {
  // Jika kosong
  if (
    riwayat === null ||
    riwayat === undefined ||
    riwayat === ""
  ) {
    return null;
  }

  // Jika sudah berupa object atau array
  if (typeof riwayat === "object") {
    return JSON.stringify(riwayat);
  }

  // Jika berupa string
  if (typeof riwayat === "string") {
    try {
      // Cek apakah string tersebut sudah merupakan JSON valid
      JSON.parse(riwayat);

      return riwayat;
    } catch {
      // Jika bukan JSON valid,
      // simpan sebagai JSON string yang valid
      return JSON.stringify(riwayat);
    }
  }

  // Tipe data lainnya
  return JSON.stringify(riwayat);
}

// =========================
// MIGRASI
// =========================

async function migrate() {
  try {
    console.log("Mengambil data pengurus dari Supabase...");

    const { data, error } = await supabase
      .from("pengurus")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data pengurus untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const pengurus of data) {
      await pool.query(
        `
        INSERT INTO public.pengurus (
          id,
          users_id,
          jabatan_id,
          bidang_id,
          nama,
          angkatan,
          gambar,
          tanggal_lahir,
          riwayat,
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
          $11
        )
        ON CONFLICT (id)
        DO UPDATE SET
          users_id = EXCLUDED.users_id,
          jabatan_id = EXCLUDED.jabatan_id,
          bidang_id = EXCLUDED.bidang_id,
          nama = EXCLUDED.nama,
          angkatan = EXCLUDED.angkatan,
          gambar = EXCLUDED.gambar,
          tanggal_lahir = EXCLUDED.tanggal_lahir,
          riwayat = EXCLUDED.riwayat,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          pengurus.id,

          // users belum dimigrasikan
          null,

          pengurus.jabatan_id,
          pengurus.bidang_id,
          pengurus.nama,
          pengurus.angkatan,
          pengurus.gambar,
          pengurus.tanggal_lahir,

          // Normalisasi data JSON
          normalizeRiwayat(pengurus.riwayat),

          pengurus.created_at,
          pengurus.updated_at,
        ]
      );
    }

    // =========================
    // SINKRONISASI SEQUENCE ID
    // =========================

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public.pengurus', 'id'),
        COALESCE((SELECT MAX(id) FROM public.pengurus), 1),
        true
      );
    `);

    console.log("✅ Migrasi pengurus berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(`
      SELECT
        id,
        users_id,
        jabatan_id,
        bidang_id,
        nama,
        angkatan,
        gambar,
        tanggal_lahir,
        riwayat,
        created_at,
        updated_at
      FROM public.pengurus
      ORDER BY id ASC
    `);

    console.log("\nData pengurus di PostgreSQL:");
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
