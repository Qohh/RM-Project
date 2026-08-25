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
    console.log("Mengambil data bidang dari Supabase...");

    const { data, error } = await supabase
      .from("bidang")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data bidang untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const bidang of data) {
      await pool.query(
        `
        INSERT INTO public.bidang
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
          bidang.id,
          bidang.nama,
          bidang.created_at,
          bidang.updated_at,
        ]
      );
    }

    // Sinkronisasi sequence ID PostgreSQL
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public.bidang', 'id'),
        COALESCE((SELECT MAX(id) FROM public.bidang), 1),
        true
      );
    `);

    console.log("✅ Migrasi bidang berhasil!");

    const result = await pool.query(
      "SELECT * FROM public.bidang ORDER BY id ASC"
    );

    console.log("\nData bidang di PostgreSQL:");
    console.table(result.rows);
  } catch (error) {
    console.error("❌ Migrasi gagal:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();