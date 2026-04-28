"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2, Search, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

// ===== TYPES =====
type Jabatan = {
  id: number;
  nama: string;
};

type Bidang = {
  id: number;
  nama: string;
};

type FormType = {
  nama: string;
  angkatan: string;
  jabatan_id: string;
  bidang_id: string;
  tanggal_lahir: string;
};

export default function UploadPengurus() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormType>({
    nama: "",
    angkatan: "",
    jabatan_id: "",
    bidang_id: "",
    tanggal_lahir: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const [jabatan, setJabatan] = useState<Jabatan[]>([]);
  const [bidang, setBidang] = useState<Bidang[]>([]);
  const [riwayat, setRiwayat] = useState<string[]>([""]);
  const [pengurus, setPengurus] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("inti");
  const [oldImage, setOldImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const jabatanInti = [
    "Ketua Umum",
    "Sekretaris Umum",
    "Bendahara Umum 1",
    "Bendahara Umum 2",
  ];

  useEffect(() => {
    getData();
    getPengurus();
  }, []);

  // ===== FETCH DATA =====
  const getData = async () => {
    const { data: j } = await supabase.from("jabatan").select("*");
    const { data: b } = await supabase.from("bidang").select("*");

    setJabatan(j || []);
    setBidang(b || []);
  };

  // ===== CEK JABATAN INTI =====
  const isJabatanInti = (id: string) => {
    const j = jabatan.find((x) => x.id === Number(id));
    return jabatanInti.includes(j?.nama || "");
  };

  // ===== HANDLE INPUT =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ===== HANDLE FILE =====
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // ===== VALIDASI =====
  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (!form.nama) newErrors.nama = "Nama wajib diisi";
    if (!form.jabatan_id) newErrors.jabatan_id = "Jabatan wajib diisi";

    if (!isJabatanInti(form.jabatan_id) && !form.bidang_id) {
      newErrors.bidang_id = "Bidang wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e: React.FormEvent) => {

    if (!validate()) return;

    let imageUrl: string | null = null;


    if (file) {
  const fileName = Date.now() + "-" + file.name;

  const { error } = await supabase.storage
    .from("pengurus")
    .upload(fileName, file);

  if (error) {
    alert("Upload gambar gagal");
    return;
  }

  imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pengurus/${fileName}`;

  // 🔥 HAPUS GAMBAR LAMA (kalau edit & ada gambar lama)
  if (editId && oldImage) {
    const oldPath = oldImage
  .split("/pengurus/")[1]
  ?.split("?")[0];

    if (oldPath) {
      const { error: deleteError } = await supabase.storage
        .from("pengurus")
        .remove([oldPath]);

      if (deleteError) {
        console.log("Gagal hapus gambar lama:", deleteError);
      }
    }
  }
}
   let query;

const payload = {
  nama: form.nama,
  angkatan: form.angkatan ? Number(form.angkatan) : null,
  tanggal_lahir: form.tanggal_lahir || null,
  jabatan_id: Number(form.jabatan_id),
  bidang_id: isJabatanInti(form.jabatan_id)
    ? null
    : Number(form.bidang_id),
  gambar: imageUrl || oldImage,
  riwayat: riwayat.filter((r) => r.trim() !== ""),
};

if (editId) {
  // 🔥 UPDATE
  query = supabase
    .from("pengurus")
    .update(payload)
    .eq("id", editId);
} else {
  // 🔥 INSERT
  query = supabase
    .from("pengurus")
    .insert([payload]);
}

const { error } = await query;

if (error) {
    toast({
      title: "Gagal!",
      description: "Gagal menyimpan data",
      variant: "destructive",
    });
    return;
} 
else {
  toast({
      title: "Berhasil!",
      description: "Data berhasil ditambahkan.",
      action: (
      <CheckCircle className="text-green-500 w-6 h-6" />
    ),
    });

  await getPengurus(); // 🔥 ini penting

  setForm({
    nama: "",
    angkatan: "",
    jabatan_id: "",
    bidang_id: "",
    tanggal_lahir: "",
  });

  setPreview(null);
  setFile(null);
  setErrors({});
  setOldImage(null); // 🔥 TARUH DI SINI
  setEditId(null);   // sekalian reset edit mode
  setRiwayat([""]);
}
  };

  const getPengurus = async () => {
  const { data } = await supabase
    .from("pengurus")
    .select(`
      id,
      nama,
      angkatan,
      tanggal_lahir,
      gambar,
      riwayat,
      jabatan_id,
      bidang_id,
      jabatan:jabatan_id (nama),
      bidang:bidang_id (nama)
    `)
    .order("id", { ascending: false });

  setPengurus(data || []);
};

const filteredData = pengurus
  .filter((item) => {
    const jabatanNama = item.jabatan?.nama;
    const bidangNama = item.bidang?.nama;

    if (activeTab === "inti") {
      return jabatanInti.includes(jabatanNama);
    }

    return bidangNama === activeTab;
  })
 .sort((a, b) => {
  const aIsKepala = a.jabatan?.nama === "Kepala Bidang";
  const bIsKepala = b.jabatan?.nama === "Kepala Bidang";

  // 1️⃣ Kepala Bidang selalu di atas
  if (aIsKepala && !bIsKepala) return -1;
  if (!aIsKepala && bIsKepala) return 1;

  // 2️⃣ selain itu → urut nama (A-Z)
  return a.nama.localeCompare(b.nama);
});

const handleDelete = async (item: any) => {
  try {
    const filePath = item.gambar
      ?.split("/pengurus/")[1]
      ?.split("?")[0];

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("pengurus")
        .remove([filePath]);

      if (storageError) {
    console.log("Storage delete error:", storageError);
    alert("Gagal hapus gambar di storage"); // 🔥 TARUH DI SINI
  }
    }

    const { error } = await supabase
      .from("pengurus")
      .delete()
      .eq("id", item.id);

    if (error) throw error;
    toast({
        title: "Berhasil!",
        description: "Data berhasil dihapus",
        action: (
      <CheckCircle className="text-green-500 w-6 h-6" />
    ),
    });
   
    await getPengurus();
  } catch (err) {
toast({
        title: "Gagal!",
        description: "Data gagal dihapus.",
        variant: "destructive",
    });
  }
};

const handleEdit = (item: any) => {
  setForm({
    nama: item.nama,
    angkatan: item.angkatan ? String(item.angkatan) : "",
    jabatan_id: String(item.jabatan_id),
    bidang_id: item.bidang_id ? String(item.bidang_id) : "",
    tanggal_lahir: item.tanggal_lahir
  ? item.tanggal_lahir.split("T")[0]
  : "",
  });

  setEditId(item.id);
  setPreview(item.gambar);
  setRiwayat(item.riwayat?.length ? item.riwayat : [""]);
  setOldImage(item.gambar); // 🔥 penting
};

const isJabatanSudahDipakai = (jabatanId: number) => {
  return pengurus.some(
    (p) =>
      p.jabatan_id === jabatanId &&
      jabatanInti.includes(p.jabatan?.nama)
  );
};

const isBidangSudahAdaKepala = (bidangId: number) => {
  return pengurus.some(
    (p) =>
      p.bidang_id === bidangId &&
      p.jabatan?.nama === "Kepala Bidang"
  );
};

const selectedJabatan = jabatan.find(
  (j) => j.id === Number(form.jabatan_id)
);

  return (
    <div className="space-y-4">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold">
                Data Pengurus
            </h1>
            <p className="text-sm text-muted-foreground">
                Tambahkan data pengurus harian untuk ditampilkan di website.
            </p>
        </div>
    <div className="bg-white py-4 px-5 rounded-xl shadow-sm space-y-4">
      <h2 className="font-bold text-xl">
        {editId ? "Edit Data" : "Tambah Data"}
      </h2>

      <form>

  <div className="grid md:grid-cols-4 gap-4">

    {/* NAMA */}
    <div className="md:col-span-4 space-y-1">
      <label className="text-base font-medium">Nama</label>
      <input
        type="text"
        name="nama"
        value={form.nama}
        onChange={handleChange}
        className={`w-full h-10 px-3 border rounded-lg outline-none
          ${errors.nama 
            ? "focus:ring-2 border-red-500 focus:ring-red-500" 
            : "focus:ring-2 focus:ring-primary"}
        `}
      />
      {errors.nama && (
        <p className="text-xs text-red-500">*Nama harus diisi</p>
      )}
    </div>

    {/* ANGKATAN */}
    <div className="space-y-1">
      <label className="text-base font-medium">Angkatan</label>
      <input
        type="number"
        name="angkatan"
        value={form.angkatan}
        onChange={handleChange}
        className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    {/* TANGGAL */}
    <div className="space-y-1">
      <label className="text-base font-medium">Tanggal Lahir</label>
      <input
        type="date"
        name="tanggal_lahir"
        value={form.tanggal_lahir}
        onChange={handleChange}
        className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    {/* JABATAN */}
    <div className="space-y-1">
  <label className="text-base font-medium">Jabatan</label>

  <Select
    value={form.jabatan_id}
    onValueChange={(value) => {
      setForm({
        ...form,
        jabatan_id: value,
        bidang_id: isJabatanInti(value) ? "" : form.bidang_id,
      });
    }}
  >
    <SelectTrigger
      className={`w-full h-10 px-3 border rounded-lg outline-none
        ${
          errors.jabatan_id
            ? "focus:ring-2 border-red-500 focus:ring-red-500"
            : "focus:ring-2 focus:ring-primary"
        }
      `}
    >
      <SelectValue placeholder="Pilih Jabatan" />
    </SelectTrigger>

    <SelectContent className="rounded-lg shadow-md border">
      {jabatan.map((j) => (
        <SelectItem
  key={j.id}
  value={String(j.id)}
  disabled={
    jabatanInti.includes(j.nama) &&
    isJabatanSudahDipakai(j.id)
  }
  className={`cursor-pointer
    ${
      jabatanInti.includes(j.nama) &&
      isJabatanSudahDipakai(j.id)
        ? "text-gray-400 hover:bg-red-100 hover:text-red-500"
        : ""
    }
  `}
>
  {j.nama}{" "}
  {isJabatanSudahDipakai(j.id) ? "(sudah terisi)" : ""}
</SelectItem>
      ))}
    </SelectContent>
  </Select>

  {errors.jabatan_id && (
    <p className="text-xs text-red-500">*Jabatan harus diisi</p>
  )}
</div>

    {/* BIDANG */}
    <div className="space-y-1">
  <label className="text-base font-medium">Bidang</label>

  <Select
    value={form.bidang_id}
    onValueChange={(value) =>
      setForm({ ...form, bidang_id: value })
    }
    disabled={isJabatanInti(form.jabatan_id)}
  >
    <SelectTrigger
      className={`w-full h-10 px-3 border rounded-lg outline-none
        ${
          errors.bidang_id
            ? "focus:ring-2 border-red-500 focus:ring-red-500"
            : "focus:ring-2 focus:ring-primary"
        }
      `}
    >
      <SelectValue placeholder="Pilih Bidang" />
    </SelectTrigger>

    <SelectContent className="rounded-lg shadow-md border">
      {bidang.map((b) => (
        <SelectItem
        key={b.id}
        value={String(b.id)}
        disabled={
            selectedJabatan?.nama === "Kepala Bidang" &&
            isBidangSudahAdaKepala(b.id)
        }
        className={`cursor-pointer
            ${
            selectedJabatan?.nama === "Kepala Bidang" &&
            isBidangSudahAdaKepala(b.id)
                ? "text-gray-400 hover:bg-red-100 hover:text-red-500"
                : ""
            }
        `}
        >
        {b.nama}{" "}
        {selectedJabatan?.nama === "Kepala Bidang" &&
        isBidangSudahAdaKepala(b.id)
            ? "(sudah terisi)"
            : ""}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {isJabatanInti(form.jabatan_id) && (
    <p className="text-xs text-gray-500">
      *Jabatan inti tidak memiliki bidang
    </p>
  )}

  {errors.bidang_id && (
    <p className="text-xs text-red-500">*Bidang harus diisi</p>
  )}
</div>

    {/* GAMBAR */}
    <div className="md:col-span-2 space-y-1">
      <label className="text-base font-medium">Foto</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="w-full border p-2 rounded-lg"
      />

      {preview && (
        <div className="py-3">
          <img
            src={preview}
            className="w-24 h-24 object-cover rounded-xl border"
          />
        </div>
      )}
    </div>
    {/* RIWAYAT */}
<div className="md:col-span-2 space-y-2">
  <label className="text-base font-medium">Riwayat Kepanitiaan</label>

  {riwayat.map((item, index) => (
    <div key={index} className="flex gap-2">
      <input
        type="text"
        value={item}
        onChange={(e) => {
          const newRiwayat = [...riwayat];
          newRiwayat[index] = e.target.value;
          setRiwayat(newRiwayat);
        }}
        placeholder="Contoh: CO Logistik Panitia Muharram 1446 H"
        className="w-full h-10 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />

      {/* tombol hapus */}
      {riwayat.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const newRiwayat = riwayat.filter((_, i) => i !== index);
            setRiwayat(newRiwayat);
          }}
          className="text-red-500"
        >
          ✕
        </button>
      )}
    </div>
  ))}

  {/* tambah */}
  <button
    type="button"
    onClick={() => setRiwayat([...riwayat, ""])}
    className="text-sm text-blue-500"
  >
    + Tambah Riwayat
  </button>
</div>

  </div>

  {/* BUTTON */}
  <div className="pt-4">
  <AlertDialog>
  <AlertDialogTrigger asChild>
    <button
    type="button"
    className={`text-white px-4 py-2 rounded-lg hover:opacity-90 ${
        editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
    }`}
    >
    {editId ? "Update Data" : "Simpan Data"}
    </button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
    {editId ? "Update data pengurus?" : "Simpan data pengurus?"}
    </AlertDialogTitle>

    <AlertDialogDescription>
    {editId
        ? "Perubahan data akan langsung diperbarui di sistem."
        : "Data yang kamu masukkan akan disimpan ke sistem dan ditampilkan di halaman struktur kepengurusan."}
    </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Batal</AlertDialogCancel>

        <AlertDialogAction
        onClick={handleSubmit}
        className={`${
            editId
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        >
        {editId ? "Ya, update" : "Ya, simpan"}
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</div>

</form>


      
    </div>
    
   <div className="grid grid-cols-8 gap-2 mt-6">
  {[
    { label: "Pengurus Inti", value: "inti" },
    { label: "Kaderisasi", value: "Kaderisasi" },
    { label: "PPA", value: "PPA" },
    { label: "Keputrian", value: "Keputrian" },
    { label: "Kesekretariatan", value: "Kesekretariatan" },
    { label: "Syiar", value: "Syiar" },
    { label: "Kominfo", value: "Kominfo" },
    { label: "Kewirausahaan", value: "Kewirausahaan" },
  ].map((btn) => (
    <button
      key={btn.value}
      onClick={() => setActiveTab(btn.value)}
      className={`w-full h-8 rounded-2xl text-sm truncate
        ${
          activeTab === btn.value
            ? "bg-primary text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }
      `}
    >
      {btn.label}
    </button>
  ))}
</div>

<div className="mt-4 grid grid-cols-2 gap-4">
  {filteredData.length === 0 ? (
    <p className="text-gray-500 text-sm col-span-2">
      Tidak ada data
    </p>
  ) : (
    filteredData.map((item) => (
      <div
        key={item.id}
        className="relative flex gap-4 p-4 border rounded-xl h-[160px] hover:shadow-sm transition"
      >
        {/* IMAGE */}
        <div className="flex items-center">
        <img
            src={item.gambar || "/no-image.png"}
            className="w-28 h-28 rounded-xl object-cover"
        />
        </div>

        {/* CONTENT */}
<div className="flex flex-col flex-1 h-full">
  <p className="font-semibold text-base">
    Nama: {item.nama}
  </p>

  <p className="text-sm text-gray-500">
    Angkatan: {item.angkatan || "-"}
  </p>

  <p className="text-sm text-gray-500">
    Jabatan: {item.jabatan?.nama}
  </p>

  {/* RIWAYAT */}
  {item.riwayat?.length > 0 && (
    <div className="mt-1 flex flex-col flex-1 min-h-0">
      <p className="text-xs font-medium text-gray-400">
        Riwayat:
      </p>

      {/* AREA SCROLL */}
      <div className="overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
          {item.riwayat.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>

        {/* ACTION BUTTON */}
        <div className="absolute top-2 right-2 flex gap-1 bg-white/80 backdrop-blur px-1 py-1 rounded-lg">

          {/* EDIT */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition">
                <Pencil className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit data pengurus?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan mengubah data:
                  <p className="font-semibold mt-1">{item.nama}</p>
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

          {/* DELETE */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus data pengurus?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu yakin ingin menghapus:
                  <p className="font-bold mt-1">{item.nama}</p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(item)}
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
  );
}