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

export default function BeritaPage() {
  const { toast } = useToast();

  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [kategoriId, setKategoriId] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [filter, setFilter] = useState<"all" | "publish" | "draft">("all");
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({
    judul: false,
    tanggal: false,
    isi: false,
    kategori: false,
    gambar: false,
  });

  // 🔄 ambil data
const fetchData = async (mode: "admin" | "publik" = "admin") => {
  const orderBy = mode === "admin" ? "created_at" : "tanggal";

  const { data, error } = await supabase
    .from("berita")
    .select(`
      *,
      kategori:kategori_id (nama)
    `)
    .order(orderBy, { ascending: false });

  if (!error) setData(data);
};

  useEffect(() => {
  fetchData();
  fetchKategori();
}, []); 

const fetchKategori = async () => {
  const { data, error } = await supabase
    .from("kategori")
    .select("*")
    .order("nama", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  setKategoriList(data);
};

  // ➕ tambah data
 const tambahBerita = async (status: "publish" | "draft") => {
 const newErrors = {
  judul: !judul,
  isi: !isi,
  kategori: !kategoriId,
  gambar: images.length === 0,
  tanggal: !tanggal,
};

setErrors(newErrors);

if (Object.values(newErrors).some(Boolean)) {
  return;
}
  const imageUrls: string[] = [];

  for (const img of images) {
    const fileName = `${Date.now()}-${img.name}`;

    const { error } = await supabase.storage
      .from("berita")
      .upload(fileName, img);

    const { data } = supabase.storage
      .from("berita")
      .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
  }

  const { error: insertError } = await supabase
    .from("berita")
    .insert([
      {
        judul,
        isi,
        tanggal,
        gambar: imageUrls, // ✅ ini yang benar
        kategori_id: Number(kategoriId),
        status,
      },
    ]);

  if (insertError) {
    toast({
      title: "Gagal",
      description: "Gagal menyimpan berita",
      variant: "destructive",
    });
    return;
  }

  if (status === "publish") {
  toast({
    title: "Berhasil!",
    description: "Berita berhasil dipublikasikan.",
    action: (
      <CheckCircle className="text-white w-6 h-6" />
    ),
  });
} else {
  toast({
    title: "Draft tersimpan!",
    description: "Berita disimpan sebagai draft.",
    action: (
      <CheckCircle className="text-orange-500 w-6 h-6" />
    ),
  });
}

  setJudul("");
  setIsi("");
  setTanggal("");
  setKategoriId("");
  setImages([]); // ✅ reset array
  fetchData();
};

const hapusBerita = async (id: string) => {
  const { error } = await supabase
  .from("berita")
  .delete()
  .eq("id", id);

if (error) {
  toast({
    title: "Gagal",
    description: "Gagal menghapus berita.",
    variant: "destructive",
  });
  return;
}
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
  toast({
    title: "Gagal",
    description: "Gagal memperbarui berita.",
    variant: "destructive",
  });
  return;
}

// 🔥 SUCCESS (dibedakan)
if (finalStatus === "publish") {
  toast({
    title: "Berhasil",
    description: "Berita berhasil diperbarui dan dipublikasikan.",
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

  } else {
    await tambahBerita(status);
    return;
  }

  setJudul("");
  setIsi("");
  setTanggal("");
  setKategoriId("");
  setImages([]);
  fetchData();
};

const filteredData = data.filter((item) => {
  const matchStatus =
    filter === "all" ? true : item.status === filter;

  const matchSearch = item.judul
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchKategori =
    kategoriFilter === "all"
      ? true
      : String(item.kategori_id) === kategoriFilter;

  return matchStatus && matchSearch && matchKategori;
});

  return (
  <div className="space-y-4">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">
        Upload Berita
      </h1>
      <p className="text-sm text-muted-foreground">
        Tambahkan berita terbaru untuk ditampilkan di website.
      </p>
    </div>

    {/* FORM */}
    <div className="bg-white py-4 px-5 rounded-xl shadow-sm space-y-4">
      <h2 className="font-bold text-xl">
        {editId ? "Edit Berita" : "Tambah Berita"}
      </h2>

      {/* GRID FORM */}
      <div className="grid md:grid-cols-4 gap-4">

  {/* JUDUL (2 kolom) */}
  <div className="md:col-span-2 space-y-1">
    <label className="text-base font-medium">Judul</label>
    <input
      placeholder="Masukkan judul berita"
      type="text"
      value={judul}
      onChange={(e) => setJudul(e.target.value)}
      className={`w-full h-10 px-3 border rounded-lg outline-none
      ${errors.judul 
        ? "focus:ring-2 border-red-500 focus:ring-red-500" 
        : "focus:ring-2 focus:ring-primary"}
    `}
    />
    {errors.judul && (
    <p className="text-xs text-red-500">*Judul harus diisi</p>
  )}
  </div>

  {/* TANGGAL (1 kolom) */}
  <div className="space-y-1">
    <label className="text-base font-medium">Tanggal</label>
    <input
      type="date"
      value={tanggal}
      onChange={(e) => setTanggal(e.target.value)}
      className={`w-full h-10 px-3 border rounded-lg outline-none
      ${errors.tanggal
        ? "focus:ring-2 border-red-500 focus:ring-red-500" 
        : "focus:ring-2 focus:ring-primary"}
    `}
    />
    {errors.tanggal && (
    <p className="text-xs text-red-500">*Tanggal harus diisi</p>
  )}
  </div>

  {/* KATEGORI (1 kolom) */}
  <div className="space-y-1">
    <label className="text-base font-medium">Kategori</label>
     <Select
    value={kategoriId}
    onValueChange={(value) => setKategoriId(value)}
  >
    <SelectTrigger
        className={`w-full h-10 px-3 border rounded-lg outline-none
          ${errors.kategori
            ? "focus:ring-2 border-red-500 focus:ring-red-500"
            : "focus:ring-2 focus:ring-primary"}
        `}
      >
      <SelectValue placeholder="Pilih Kategori" />
    </SelectTrigger>

    <SelectContent className="rounded-lg shadow-md border">
      {kategoriList.map((item) => (
        <SelectItem
          key={item.id}
          value={String(item.id)}
          className="cursor-pointer"
        >
          {item.nama}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.kategori && (
  <p className="text-xs text-red-500">*Kategori harus dipilih</p>
)}
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
</div>

      {/* TEXTAREA FULL */}
      <div className="space-y-1">
  <textarea
    placeholder="Isi"
    value={isi}
    onChange={(e) => setIsi(e.target.value)}
    className={`w-full px-3 p-2 border rounded-lg outline-none
      ${
        errors.isi
          ? "focus:ring-2 border-red-500 focus:ring-red-500"
          : "focus:ring-2 focus:ring-primary"
      }
    `}
  />

  {errors.isi && (
    <p className="text-xs text-red-500">*Isi harus diisi</p>
  )}
</div>

      {/* BUTTON */}
<div className="flex gap-2">

  {/* PUBLISH */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:opacity-90">
        {editStatus === "publish" ? "Update" : "Publish"}
      </button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {editStatus === "publish" ? "Update berita?" : "Publish berita?"}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {editStatus === "publish"
            ? "Perubahan akan langsung terlihat oleh pengguna."
            : "Berita akan langsung dipublikasikan dan bisa dilihat oleh publik."}
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

  {/* DRAFT */}
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
            Berita tidak akan dipublikasikan dan hanya tersimpan sebagai draft.
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
  
  {/* KIRI: search + kategori */}
  <div className="flex gap-2 w-full md:w-auto">
    
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

    {/* SELECT KATEGORI */}
    <Select
      value={kategoriFilter}
      onValueChange={(value) => setKategoriFilter(value)}
    >
      <SelectTrigger className="h-10 w-[160px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-white">
        <SelectValue placeholder="Kategori" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">Semua</SelectItem>

        {kategoriList.map((item) => (
          <SelectItem key={item.id} value={String(item.id)}>
            {item.nama}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
    <div>Kategori</div>
    <div>Status</div>
    <div>Aksi</div>
  </div>

  {/* CONTENT */}
  {filteredData.length === 0 ? (
    <div className="text-center text-gray-500 py-6">
      Tidak ada berita.
    </div>
  ) : (
    filteredData.map((item) => (
      <div
  key={item.id}
  className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 transition text-center"
>
  {/* Tanggal */}
  <div className="text-sm text-gray-600">{item.tanggal}</div>

  {/* Judul (2 kolom, kiri) */}
  <div className="col-span-2 font-medium text-left">
    {item.judul}
  </div>

  {/* Kategori */}
  <div className="text-sm text-gray-500">
    {item.kategori?.nama || "-"}
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
        <AlertDialogTitle>Edit berita?</AlertDialogTitle>
        <AlertDialogDescription>
          Kamu akan mengubah isi berita ini.
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
        <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>
                Kamu yakin ingin menghapus berita dengan judul:
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
          onClick={() => hapusBerita(item.id)}
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