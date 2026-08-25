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

async function migrate() {
  try {
    console.log("Mengambil data kategori dari Supabase...");

    const { data, error } = await supabase
      .from("kategori")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data kategori untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const kategori of data) {
      await pool.query(
        `
        INSERT INTO public.kategori
          (id, nama, created_at, updated_at)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT (id)
        DO UPDATE SET
          nama = EXCLUDED.nama,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          kategori.id,
          kategori.nama,
          kategori.created_at,
          kategori.updated_at,
        ]
      );
    }

    // =========================
    // SINKRONISASI SEQUENCE ID
    // =========================

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public.kategori', 'id'),
        COALESCE((SELECT MAX(id) FROM public.kategori), 1),
        true
      );
    `);

    console.log("✅ Migrasi kategori berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(
      "SELECT * FROM public.kategori ORDER BY id ASC"
    );

    console.log("\nData kategori di PostgreSQL:");
    console.table(result.rows);

  } catch (error) {
    console.error("❌ Migrasi gagal:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();