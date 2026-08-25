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
    console.log("Mengambil data users dari Supabase...");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Data dari Supabase: ${data.length} baris`);

    if (data.length === 0) {
      console.log("Tidak ada data users untuk dipindahkan.");
      return;
    }

    console.log("Memasukkan data ke PostgreSQL...");

    for (const user of data) {
      await pool.query(
        `
        INSERT INTO public.users
          (
            id,
            name,
            email,
            email_verified_at,
            password,
            remember_token,
            created_at,
            updated_at
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          email_verified_at = EXCLUDED.email_verified_at,
          password = EXCLUDED.password,
          remember_token = EXCLUDED.remember_token,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
        `,
        [
          user.id,
          user.name,
          user.email,
          user.email_verified_at,
          user.password,
          user.remember_token,
          user.created_at,
          user.updated_at,
        ]
      );
    }

    // =========================
    // SINKRONISASI SEQUENCE ID
    // =========================

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public.users', 'id'),
        COALESCE((SELECT MAX(id) FROM public.users), 1),
        true
      );
    `);

    console.log("✅ Migrasi users berhasil!");

    // =========================
    // VERIFIKASI
    // =========================

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        email_verified_at,
        remember_token,
        created_at,
        updated_at
      FROM public.users
      ORDER BY id ASC
      `
    );

    console.log("\nData users di PostgreSQL:");
    console.table(result.rows);

  } catch (error) {
    console.error("❌ Migrasi gagal:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();