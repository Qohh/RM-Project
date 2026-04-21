"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BeritaPage() {
  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [kategoriId, setKategoriId] = useState("");

  const [mode, setMode] = useState<"upload" | "draft">("upload");
  const [filter, setFilter] = useState<"all" | "publish" | "draft">("all");
  const [search, setSearch] = useState("");

  // 🔄 ambil data
const fetchData = async () => {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .order("tanggal", { ascending: false });

  if (!error) setData(data);
};

  useEffect(() => {
  fetchData();
  fetchKategori();
}, [mode]); //

const fetchKategori = async () => {
  const { data, error } = await supabase
    .from("kategori")
    .select("*")
    .order("id", { ascending: true });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error(error);
    return;
  }

  setKategoriList(data);
};

  // ➕ tambah data
  const tambahBerita = async (status: "publish" | "draft") => {
  if (!judul || !isi || !image || !kategoriId) {
    alert("Isi semua!");
    return;
  }

  const fileName = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("berita")
    .upload(fileName, image);

  if (uploadError) {
    alert("Upload gagal!");
    return;
  }

  const { data: urlData } = supabase.storage
    .from("berita")
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;

  const { error: insertError } = await supabase
    .from("berita")
    .insert([
      {
        judul,
        isi,
        tanggal,
        gambar: imageUrl,
        kategori_id: Number(kategoriId),
        status,
      },
    ]);

  if (insertError) {
    console.error(insertError);
    alert("Gagal simpan!");
    return;
  }

  alert("Berhasil tambah!");

  setJudul("");
  setIsi("");
  setTanggal("");
  setKategoriId("");
  setImage(null);
  fetchData();
};

const hapusBerita = async (id: string) => {
  await supabase.from("berita").delete().eq("id", id);
  fetchData();
};

const [editId, setEditId] = useState<number | null>(null);
const [editStatus, setEditStatus] = useState<"publish" | "draft" | null>(null);

const handleEdit = (item: any) => {
  setEditId(item.id);
  setEditStatus(item.status); // 🔥 penting
  setJudul(item.judul);
  setIsi(item.isi);
  setTanggal(item.tanggal);
  setKategoriId(String(item.kategori_id));
};

const handleSubmit = async (status: "publish" | "draft") => {
  if (editId) {
    const finalStatus =
      editStatus === "publish" ? "publish" : status; 
      // 🔥 publish tetap publish, draft bisa berubah

    const { error } = await supabase
      .from("berita")
      .update({
        judul,
        isi,
        tanggal,
        kategori_id: Number(kategoriId),
        status: finalStatus,
      })
      .eq("id", editId);

    if (error) {
      alert("Gagal update!");
      return;
    }

    alert("Berhasil update!");
    setEditId(null);
    setEditStatus(null);
  } else {
    await tambahBerita(status);
    return;
  }

  setJudul("");
  setIsi("");
  setTanggal("");
  setKategoriId("");
  setImage(null);
  fetchData();
};

const filteredData = data.filter((item) => {
  const matchStatus =
    filter === "all" ? true : item.status === filter;

  const matchSearch = item.judul
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchStatus && matchSearch;
});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload Berita</h1>

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
          placeholder="Isi"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-full border p-2 rounded"
        />

                <select
          value={kategoriId}
          onChange={(e) => setKategoriId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>Pilih Kategori</option>
          {kategoriList.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.nama}
            </option>
          ))}
        </select>

        <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
        />

       <div className="flex gap-2">
  <button
    onClick={() => handleSubmit("publish")}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    {editStatus === "publish" ? "Update" : "Publish"}
  </button>

  {editStatus !== "publish" && (
    <button
      onClick={() => handleSubmit("draft")}
      className="bg-gray-500 text-white px-4 py-2 rounded"
    >
      Simpan Draft
    </button>
  )}
</div>
      </div>


<div className="flex justify-between items-center">
  <div className="flex gap-2">
    <button onClick={() => setFilter("all")} className="px-3 py-1 bg-gray-300 rounded">All</button>
    <button onClick={() => setFilter("publish")} className="px-3 py-1 bg-green-500 text-white rounded">Publish</button>
    <button onClick={() => setFilter("draft")} className="px-3 py-1 bg-gray-500 text-white rounded">Draft</button>
  </div>

  <input
    type="text"
    placeholder="Search judul..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded"
  />
</div>

      {/* LIST DATA */}
      <div className="space-y-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.judul}</h2>
              <p className="text-sm text-gray-500">{item.tanggal}</p>
            </div>

           <div className="flex gap-2">
  <button
    onClick={() => handleEdit(item)}
    className="bg-yellow-500 text-white px-3 py-1 rounded"
  >
    Edit
  </button>

  <button
    onClick={() => hapusBerita(item.id)}
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Hapus
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}