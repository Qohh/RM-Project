
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
// MIGRASI
// =========================

async function migrate() {
  try {
    console.log("Mengambil data profil dari Supabase...");

    const { data, error } = await supabase
      .from("profil")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data profil untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const profil of data) {
      await pool.query(
        `
        INSERT INTO public.profil (
          id,
          sejarah,
          visi,
          misi,
          tujuan,
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
          $7
        )
        ON CONFLICT (id)
        DO UPDATE SET
          sejarah = EXCLUDED.sejarah,
          visi = EXCLUDED.visi,
          misi = EXCLUDED.misi,
          tujuan = EXCLUDED.tujuan,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          profil.id,
          profil.sejarah,
          profil.visi,
          profil.misi,
          profil.tujuan,
          profil.created_at,
          profil.updated_at,
        ]
      );
    }

    // =========================
    // SINKRONISASI SEQUENCE ID
    // =========================

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public.profil', 'id'),
        COALESCE((SELECT MAX(id) FROM public.profil), 1),
        true
      );
    `);

    console.log("✅ Migrasi profil berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(`
      SELECT
        id,
        sejarah,
        visi,
        misi,
        tujuan,
        created_at,
        updated_at
      FROM public.profil
      ORDER BY id ASC
    `);

    console.log("\nData profil di PostgreSQL:");
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
