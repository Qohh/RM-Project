"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Search, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

export default function KegiatanPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [tanggalMulai, setTanggalMulai] = useState("")
  const [waktuMulai, setWaktuMulai] = useState("")
  const [tanggalSelesai, setTanggalSelesai] = useState("")
  const [waktuSelesai, setWaktuSelesai] = useState("")

  const [filter, setFilter] = useState<"all" | "publish" | "draft">("all");
  const [search, setSearch] = useState("");

  const [errors, setErrors] = useState({
    judul: false,
    deskripsi: false,
    lokasi: false,
    gambar: false,
  });

  // 🔄 ambil data
const fetchData = async (mode: "admin" | "publik" = "admin") => {
  const orderBy = mode === "admin" ? "created_at" : "tanggal_mulai";

  const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order(orderBy, { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    setData(data);
  };

  useEffect(() => {
  fetchData();
}, []); //

  // ➕ tambah data
  const tambahKegiatan = async (status: "publish" | "draft") => {
  const imageUrls: string[] = [];

  for (const img of images) {
    const fileName = `${Date.now()}-${img.name}`;

    const { error } = await supabase.storage
      .from("kegiatan")
      .upload(fileName, img);

    if (error) {
      toast({
        title: "Gagal upload gambar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data } = supabase.storage
      .from("kegiatan")
      .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
  }

  const { error: insertError } = await supabase
    .from("kegiatan")
    .insert([
      {
        judul,
        deskripsi,
        tanggal_mulai: tanggalMulai,
        waktu_mulai: waktuMulai,
        tanggal_selesai: tanggalSelesai,
        waktu_selesai: waktuSelesai,
        lokasi,
        gambar: imageUrls, 
        status,
      },
    ]);

  if (insertError) {
    toast({
      title: "Gagal",
      description: "Gagal menyimpan kegiatan",
      variant: "destructive",
    });
    return;
  }

  if (status === "publish") {
  toast({
    title: "Berhasil!",
    description: "Kegiatan berhasil dipublikasikan.",
    action: (
      <CheckCircle className="text-green-500 w-6 h-6" />
    ),
  });
} else {
  toast({
    title: "Draft tersimpan!",
    description: "Kegiatan disimpan sebagai draft.",
    action: (
      <CheckCircle className="text-orange-500 w-6 h-6" />
    ),
  });
}

  setJudul("");
  setTanggalMulai("");
  setWaktuMulai("");
  setTanggalSelesai("");
  setWaktuSelesai("");
  setDeskripsi("");
  setLokasi("");
  setImages([]);
  setOldImages([]);
  fetchData();
};

const hapusKegiatan = async (id: number) => {
  // 1. ambil gambar dulu
  const { data } = await supabase
    .from("kegiatan")
    .select("gambar")
    .eq("id", id)
    .single();

  if (data?.gambar) {
    let images: string[] = [];

    try {
      images = Array.isArray(data.gambar)
        ? data.gambar
        : JSON.parse(data.gambar);
    } catch {
      images = [data.gambar];
    }

    const paths = images.map((url: string) =>
      url.split("/kegiatan/")[1]?.split("?")[0]
    );

    await supabase.storage.from("kegiatan").remove(paths);
  }

  // 2. baru hapus DB
  await supabase.from("kegiatan").delete().eq("id", id);

  toast({
    title: "Berhasil",
    description: "Data berhasil dihapus.",
  });

  fetchData();
};

const [editId, setEditId] = useState<number | null>(null);
const [editStatus, setEditStatus] = useState<"publish" | "draft" | null>(null);

const handleEdit = (item: any) => {
  setEditId(item.id);
  setEditStatus(item.status);
  setOldImages([]);
  setJudul(item.judul);
  setDeskripsi(item.deskripsi);
  setLokasi(item.lokasi);
  setTanggalMulai(item.tanggal_mulai || "");
  setWaktuMulai(item.waktu_mulai || "");
  setTanggalSelesai(item.tanggal_selesai || "");
  setWaktuSelesai(item.waktu_selesai || "");
  let parsedImages: string[] = [];

  try {
    parsedImages = Array.isArray(item.gambar)
      ? item.gambar
      : JSON.parse(item.gambar);
  } catch {
    parsedImages = item.gambar ? [item.gambar] : [];
  }

  setOldImages(parsedImages);
  };

const handleSubmit = async (status: "publish" | "draft") => {
  const newErrors = {
    judul: !judul,
    deskripsi: !deskripsi,
    lokasi: !lokasi,
    tanggalMulai: !tanggalMulai,
    waktuMulai: !waktuMulai,
    tanggalSelesai: !tanggalSelesai,
    waktuSelesai: !waktuSelesai,
    gambar: images.length === 0 && oldImages.length === 0,
  };

  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) {
    toast({
      title: "Form belum lengkap",
      description: "Harap isi semua data sebelum melanjutkan.",
      variant: "destructive",
    });
    return;
  }

  const start = new Date(`${tanggalMulai}T${waktuMulai}`);
  const end = new Date(`${tanggalSelesai}T${waktuSelesai}`);

  if (end < start) {
    toast({
      title: "Waktu tidak valid",
      description: "Waktu selesai tidak boleh sebelum mulai",
      variant: "destructive",
    });
    return;
  }

  if (editId) {
    const finalStatus =
      editStatus === "publish" ? "publish" : status; 

    const imageUrls: string[] = [];
    for (const img of images) {
    const fileName = `${Date.now()}-${img.name}`;

const { error } = await supabase.storage
      .from("kegiatan")
      .upload(fileName, img);

    if (error) {
      toast({
        title: "Gagal upload",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data } = supabase.storage
      .from("kegiatan")
      .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
  }

   let finalImages = oldImages;

   if (imageUrls.length > 0 && oldImages.length === 0) {
  const { data } = await supabase
    .from("kegiatan")
    .select("gambar")
    .eq("id", editId)
    .single();

  if (data?.gambar) {
    let old: string[] = [];

    try {
      old = Array.isArray(data.gambar)
        ? data.gambar
        : JSON.parse(data.gambar);
    } catch {
      old = [data.gambar];
    }

    const paths = old.map((url: string) =>
      url.split("/kegiatan/")[1]?.split("?")[0]
    );

    await supabase.storage.from("kegiatan").remove(paths);
  }
}

// kalau ada gambar baru
if (imageUrls.length > 0) {
  // kalau oldImages kosong → berarti replace semua
  if (oldImages.length === 0) {
    finalImages = imageUrls;
  } else {
    // kalau masih ada oldImages → berarti tambah
    finalImages = [...oldImages, ...imageUrls];
  }
}

  const { error } = await supabase

  .from("kegiatan")
  .update({
    judul,
    deskripsi,
    tanggal_mulai: tanggalMulai,
    waktu_mulai: waktuMulai,
    tanggal_selesai: tanggalSelesai,
    waktu_selesai: waktuSelesai,
    lokasi,
    gambar: finalImages,
    status: finalStatus,
  })
  .eq("id", editId);

if (error) {
  toast({
    title: "Gagal",
    description: "Gagal memperbarui kegiatan.",
    variant: "destructive",
  });
  return;
}

if (finalStatus === "publish") {
  toast({
    title: "Berhasil",
    description: "Kegiatan berhasil diperbarui dan dipublikasikan.",
    action: (
      <CheckCircle className="text-green-500 w-6 h-6" />
    ),
  });
} else {
  toast({
    title: "Draft diperbarui",
    description: "Perubahan berhasil disimpan sebagai draft.",
    action: (
      <CheckCircle className="text-orange-500 w-6 h-6" />
    ),
  });
}

setEditId(null);
setEditStatus(null);
setOldImages([]);

  } else {
    await tambahKegiatan(status);
    return;
  }

  setJudul("");
  setDeskripsi("");
  setTanggalMulai("");
  setWaktuMulai("");
  setTanggalSelesai("");
  setWaktuSelesai("");
  setLokasi("");
  setImages([]);
  setOldImages([]);
  fetchData();
};

const getProgress = (
  tanggalMulai: string,
  waktuMulai: string,
  tanggalSelesai: string,
  waktuSelesai: string
) => {
  const now = new Date();

  const start = new Date(`${tanggalMulai}T${waktuMulai}`);
  const end = new Date(`${tanggalSelesai}T${waktuSelesai}`);

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Ongoing";
  return "Selesai";
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
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          Upload Kegiatan
        </h1>
        <p className="text-sm text-muted-foreground">
          Tambahkan kegiatan terbaru untuk ditampilkan di website.
        </p>
      </div>

      {/* FORM */}
    <div className="bg-white py-4 px-5 rounded-xl shadow-sm space-y-4">
      <h2 className="font-bold text-xl">
        {editId ? "Edit Kegiatan" : "Tambah Kegiatan"}
      </h2>

      {/* GRID FORM */}
<div className="grid md:grid-cols-4 gap-4">

 <div className="md:col-span-3 space-y-1">
  <label className="text-base font-medium">Judul</label>

  <input
    placeholder="Masukkan judul kegiatan"
    type="text"
    value={judul}
    onChange={(e) => {
      if (e.target.value.length <= 150) {
        setJudul(e.target.value)
      }
    }}
    className={`w-full h-10 px-3 border rounded-lg outline-none
    ${
      errors.judul
        ? "focus:ring-2 border-red-500 focus:ring-red-500"
        : "focus:ring-2 focus:ring-primary"
    }`}
  />

  {/* ERROR */}
  {errors.judul && (
    <p className="text-xs text-red-500">*Judul harus diisi</p>
  )}

  {/* COUNTER */}
  <div className="flex justify-end text-xs mt-1">
    <span
      className={`${
        judul.length === 150 ? "text-red-500" : "text-gray-500"
      }`}
    >
      {judul.length}/150
    </span>
  </div>
</div>

  {/* LOKASI (1 kolom) */}
  <div className="space-y-1">
    <label className="text-base font-medium">Lokasi</label>
    <input
      placeholder="Masukkan lokasi"
      type="text"
      value={lokasi || ""}
      onChange={(e) => setLokasi(e.target.value)}
      className={`w-full h-10 px-3 border rounded-lg outline-none
      ${errors.lokasi
        ? "focus:ring-2 border-red-500 focus:ring-red-500" 
        : "focus:ring-2 focus:ring-primary"}`}
    />
    {errors.lokasi && (
      <p className="text-xs text-red-500">*Lokasi harus diisi</p>
    )}
  </div>

  {/* TANGGAL MULAI */}
  <div className="space-y-1">
    <label className="text-base font-medium">Tanggal Mulai</label>
    <input
      type="date"
      value={tanggalMulai}
      onChange={(e) => setTanggalMulai(e.target.value)}
      className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  {/* WAKTU MULAI */}
  <div className="space-y-1">
    <label className="text-base font-medium">Waktu Mulai</label>
    <input
      type="time"
      value={waktuMulai}
      onChange={(e) => setWaktuMulai(e.target.value)}
      className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  {/* TANGGAL SELESAI */}
  <div className="space-y-1">
    <label className="text-base font-medium">Tanggal Selesai</label>
    <input
      type="date"
      value={tanggalSelesai}
      onChange={(e) => setTanggalSelesai(e.target.value)}
      className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  {/* WAKTU SELESAI */}
  <div className="space-y-1">
    <label className="text-base font-medium">Waktu Selesai</label>
    <input
      type="time"
      value={waktuSelesai}
      onChange={(e) => setWaktuSelesai(e.target.value)}
      className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

</div>

  {/* GAMBAR (FULL 4 KOLOM) */}
  <div className="md:col-span-4 space-y-1">
    <label className="text-base font-medium">Gambar</label>
    <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setImages((prev) => {
    const combined = [...prev, ...files];

    if (combined.length > 5) {
      alert("Maksimal 5 gambar!");
      return prev;
    }

    return combined;
  });
  e.target.value = "";

  }}
  className="w-full border p-2 rounded-lg"
/>
  <p
  className={`text-xs ${
    errors.gambar ? "text-red-500" : "text-gray-500"
  }`}
>
  *Upload minimal 1 gambar, maksimal 5 gambar.
</p>

    {oldImages.length > 0 && (
  <div className="mt-3 space-y-2">
    {oldImages.map((img, index) => (
      <div
        key={index}
        className="flex justify-between items-center border p-3 rounded-lg"
      >
        {/* nama file */}
        <span className="text-sm truncate">
           {(() => {
              const fileName = decodeURIComponent(img.split("/").pop() || "");
              return fileName.replace(/^\d+-/, "");
            })()}
        </span>

        <div className="flex gap-3">
          {/* HAPUS */}
          <button
            onClick={() => {
  const removed = oldImages[index];

  const newOld = oldImages.filter((_, i) => i !== index);
  setOldImages(newOld);

  const path = removed.split("/kegiatan/")[1]?.split("?")[0];

  if (path) {
    supabase.storage.from("kegiatan").remove([path]);
  }
}}
            className="text-red-500 text-sm"
          >
            Hapus
          </button>

          {/* UBAH */}
          <label className="text-blue-500 text-sm cursor-pointer">
            Ubah
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // hapus dari oldImages & masuk ke images
                const newOld = oldImages.filter((_, i) => i !== index);
                setOldImages(newOld);

                setImages((prev) => [...prev, file]);
              }}
            />
          </label>
        </div>
      </div>
    ))}
  </div>
)}

  {images.length > 0 && (
  <div className="mt-3 space-y-2">
    {images.map((img, index) => (
      <div
        key={index}
        className="flex justify-between items-center border p-3 rounded-lg"
      >
        <span className="text-sm truncate">{img.name}</span>

        <div className="flex gap-3">
          <button
            onClick={() => {
              const newImages = images.filter((_, i) => i !== index)
              setImages(newImages)
            }}
            className="text-red-500 text-sm"
          >
            Hapus
          </button>

          <label className="text-blue-500 text-sm cursor-pointer">
            Ubah
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const newImages = [...images]
                newImages[index] = file
                setImages(newImages)
              }}
            />
          </label>
        </div>
      </div>
    ))}
  </div>
)}

  </div>

  <div className="space-y-1">
    <label className="text-base font-medium">Deksripsi Kegiatan</label>
  <textarea
    placeholder="Masukkan deskripsi kegiatan"
    value={deskripsi}
    onChange={(e) => {
      if (e.target.value.length <= 7000) {
        setDeskripsi(e.target.value)
      }
    }}
    className={`w-full px-3 p-2 border rounded-lg outline-none
      ${
        errors.deskripsi
          ? "focus:ring-2 border-red-500 focus:ring-red-500"
          : "focus:ring-2 focus:ring-primary"
      }
    `}
  />

  {errors.deskripsi && (
    <p className="text-xs text-red-500">*Isi harus diisi</p>
  )}

  <div className="flex justify-end text-xs mt-1">
    <span
      className={`${
        deskripsi.length >= 7000 ? "text-red-500" : "text-gray-500"
      }`}
    >
      {deskripsi.length}/1000
    </span>
  </div>
</div>

<div className="flex gap-2">

  {/* PUBLISH / UPDATE */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:opacity-90">
        {editStatus === "publish" ? "Update" : "Publish"}
      </button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {editStatus === "publish"
            ? "Update kegiatan?"
            : "Publish kegiatan?"}
        </AlertDialogTitle>

        <AlertDialogDescription>
          {editStatus === "publish"
            ? "Perubahan akan langsung terlihat oleh pengguna."
            : "Kegiatan akan langsung dipublikasikan dan bisa dilihat oleh publik."}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleSubmit("publish")}
          className="bg-green-500 hover:bg-green-600"
        >
          Ya, lanjutkan
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  {/* DRAFT (hanya kalau bukan publish) */}
  {editStatus !== "publish" && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90">
          Simpan Draft
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Simpan sebagai draft?</AlertDialogTitle>
          <AlertDialogDescription>
            Kegiatan tidak akan dipublikasikan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSubmit("draft")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Ya, simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )}

</div>

    {/* FILTER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* SEARCH */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 border p-2 pl-9 pr-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* KANAN: status filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm px-3 py-1 rounded-xl transition ${
            filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("publish")}
          className={`text-sm px-3 py-1 rounded-xl transition ${
            filter === "publish"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Publish
        </button>

        <button
          onClick={() => setFilter("draft")}
          className={`text-sm px-3 py-1 rounded-xl transition ${
            filter === "draft"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Draft
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
  {/* HEADER */}
  <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-semibold text-gray-600 border-b text-center">
    <div>Tanggal</div>
    <div className="col-span-2">Judul</div>
    <div>Progress</div>
    <div>Status</div>
    <div>Aksi</div>
  </div>

  {/* CONTENT */}
  {filteredData.length === 0 ? (
    <div className="text-center text-gray-500 py-6">
      Tidak ada kegiatan.
    </div>
  ) : (
    filteredData.map((item) => (
      <div
  key={item.id}
  className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 transition text-center"
>
  {/* Tanggal */}
  <div className="text-sm text-gray-600">{item.tanggal_mulai}</div>

  {/* Judul (2 kolom, kiri) */}
  <div className="col-span-2 font-medium text-left">
    {item.judul}
  </div>

  {/* Progress */}
 <div className="text-sm text-gray-500">
  {(() => {
    const progress = getProgress(
      item.tanggal_mulai,
      item.waktu_mulai,
      item.tanggal_selesai,
      item.waktu_selesai
    )

    return (
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium
            ${
              progress === "Upcoming"
                ? "bg-yellow-100 text-yellow-700"
                : progress === "Ongoing"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {progress}
        </span>
    )
  })()}
</div>

  {/* Status */}
  <div>
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium
        ${
          item.status === "publish"
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-600"
        }`}
    >
      {item.status === "publish" ? "Publish" : "Draft"}
    </span>
  </div>

  {/* Aksi */}
<div className="flex justify-center gap-2">

  {/* EDIT */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100">
        <Pencil className="w-4 h-4" />
      </button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Edit kegiatan?</AlertDialogTitle>
        <AlertDialogDescription>
          Kamu akan mengubah isi kegiatan ini.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleEdit(item)}
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          Ya, edit
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  {/* HAPUS */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2 rounded-lg text-red-500 hover:bg-red-100">
        <Trash2 className="w-4 h-4" />
      </button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus kegiatan?</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>
                Kamu yakin ingin menghapus kegiatan dengan judul:
              </p>
              <p className="font-bold">
                "{item.judul}"
              </p>
            </div>
          </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => hapusKegiatan(item.id)}
          className="bg-red-500 hover:bg-red-600"
        >
          Ya, hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

</div>

</div>
    ))
  )}
</div>
</div>

    </div>
  );
}