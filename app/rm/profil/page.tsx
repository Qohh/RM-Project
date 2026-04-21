"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilPage() {
  const [mode, setMode] = useState<"sejarah" | "tujuan" | "visi">("sejarah");

  const [sejarah, setSejarah] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔄 ambil data profil
  const fetchProfil = async () => {
    const { data, error } = await supabase
      .from("profil")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setSejarah(data.sejarah || "");
      setTujuan(data.tujuan || "");
      setVisi(data.visi || "");
      setMisi(data.misi || "");
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  // 💾 simpan data
  const handleSave = async () => {
    const confirmSave = confirm("Yakin menyimpan perubahan?");
    if (!confirmSave) return;

    setLoading(true);

    let updateData: any = {};

    if (mode === "sejarah") {
      updateData = { sejarah };
    } else if (mode === "tujuan") {
      updateData = { tujuan };
    } else {
      updateData = { visi, misi };
    }

    const { error } = await supabase
      .from("profil")
      .update(updateData)
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert("Gagal menyimpan!");
      return;
    }

    alert("Berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profil</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("sejarah")}
            className={`px-3 py-1 rounded ${
              mode === "sejarah" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Sejarah
          </button>

          <button
            onClick={() => setMode("tujuan")}
            className={`px-3 py-1 rounded ${
              mode === "tujuan" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Tujuan
          </button>

          <button
            onClick={() => setMode("visi")}
            className={`px-3 py-1 rounded ${
              mode === "visi" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Visi & Misi
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        {mode === "sejarah" && (
          <textarea
            placeholder="Isi sejarah..."
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
            className="w-full border p-2 rounded h-40"
          />
        )}

        {mode === "tujuan" && (
          <textarea
            placeholder="Isi tujuan..."
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="w-full border p-2 rounded h-40"
          />
        )}

        {mode === "visi" && (
          <>
            <textarea
              placeholder="Visi..."
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              className="w-full border p-2 rounded h-24"
            />

            <textarea
              placeholder="Misi..."
              value={misi}
              onChange={(e) => setMisi(e.target.value)}
              className="w-full border p-2 rounded h-24"
            />
          </>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}