"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function KegiatanPage() {
  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 🔄 ambil data
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal", { ascending: false });

    if (!error) setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ tambah data
  const tambahKegiatan = async () => {
  if (!judul || !deskripsi || !image) {
    alert("Isi semua!");
    return;
  }

  // 🧾 buat nama file unik
  const fileName = `${Date.now()}-${image.name}`;

  // ⬆️ upload ke storage
  const { error: uploadError } = await supabase.storage
    .from("kegiatan")
    .upload(fileName, image);

  if (uploadError) {
    alert("Upload gagal!");
    return;
  }

  // 🔗 ambil URL public
  const { data: urlData } = supabase.storage
    .from("kegiatan")
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;

  // 💾 simpan ke database
  const { error } = await supabase.from("kegiatan").insert([
    {
      judul,
      deskripsi,
      tanggal,
      image: imageUrl,
    },
  ]);

  if (!error) {
    alert("Berhasil tambah!");
    setJudul("");
    setDeskripsi("");
    setTanggal("");
    setImage(null);
    fetchData();
  }
};
const hapusKegiatan = async (id: string) => {
  await supabase.from("kegiatan").delete().eq("id", id);
  fetchData();
};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Kegiatan</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <input
          type="text"
          placeholder="Judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
        />

        <button
          onClick={tambahKegiatan}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah
        </button>
      </div>

      {/* LIST DATA */}
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.judul}</h2>
              <p className="text-sm text-gray-500">{item.tanggal}</p>
            </div>

            <button
              onClick={() => hapusKegiatan(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}