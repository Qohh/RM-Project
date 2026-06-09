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
import { Pencil, Trash2, Search, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

// ─────────────────────────────────────────────
// Konstanta
// ─────────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const COMPRESS_QUALITY = 0.82;
const COMPRESS_MAX_WIDTH = 1280;
const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────
// Fungsi kompresi
// ─────────────────────────────────────────────
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > COMPRESS_MAX_WIDTH) {
        height = Math.round((height * COMPRESS_MAX_WIDTH) / width);
        width = COMPRESS_MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size >= file.size) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg", lastModified: Date.now(),
          }));
        },
        "image/jpeg", COMPRESS_QUALITY
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

async function validateAndCompress(
  file: File,
  toast: ReturnType<typeof useToast>["toast"]
): Promise<File | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast({
      title: "Format tidak didukung",
      description: `"${file.name}" bukan format gambar yang valid. Gunakan .jpg, .jpeg, .png, .webp, atau .gif`,
      variant: "destructive",
    });
    return null;
  }
  if (file.size > MAX_FILE_SIZE) {
    toast({
      title: "Gambar terlalu besar",
      description: `"${file.name}" melebihi 1 MB. Silakan ganti dengan gambar lain.`,
      variant: "destructive",
    });
    return null;
  }
  return await compressImage(file);
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// ─────────────────────────────────────────────
// DatePicker
// ─────────────────────────────────────────────
function DatePicker({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const todayStr = toYMD(today);

  const [viewYear, setViewYear] = useState(value ? parseInt(value.split("-")[0]) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split("-")[1]) - 1 : today.getMonth());

  const handleOpen = () => {
    if (value) {
      setViewYear(parseInt(value.split("-")[0]));
      setViewMonth(parseInt(value.split("-")[1]) - 1);
    }
    setOpen(true);
  };

  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const dayNames = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleSelect = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const handleToday = () => {
    onChange(todayStr);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selected = value ? new Date(value + "T00:00:00") : null;
  const displayValue = selected
    ? `${String(selected.getDate()).padStart(2,"0")} ${monthNames[selected.getMonth()]} ${selected.getFullYear()}`
    : "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full h-10 px-3 border rounded-lg outline-none text-left text-sm flex items-center justify-between transition
          ${hasError ? "border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}
          ${!displayValue ? "text-gray-400" : "text-gray-800"}
        `}
      >
        <span>{displayValue || "Pilih tanggal"}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72">

            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex gap-2">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="text-sm font-semibold bg-transparent border-none outline-none cursor-pointer"
                >
                  {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="text-sm font-semibold bg-transparent border-none outline-none cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 2 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={idx} />;
                const mm = String(viewMonth + 1).padStart(2, "0");
                const dd = String(day).padStart(2, "0");
                const dayStr = `${viewYear}-${mm}-${dd}`;
                const isSelected = value === dayStr;
                const isTodayCell = dayStr === todayStr;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={`text-sm h-8 w-8 mx-auto rounded-full flex items-center justify-center transition font-medium
                      ${isSelected
                        ? "bg-primary text-white shadow"
                        : isTodayCell
                        ? "border border-primary text-primary hover:bg-primary/10"
                        : "hover:bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleToday}
                className="w-full py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
              >
                Hari Ini
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 pt-2 pb-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 text-sm rounded-lg font-medium transition
            ${currentPage === page
              ? "bg-primary text-white shadow-sm"
              : "hover:bg-gray-100 text-gray-600"
            }
          `}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Komponen utama
// ─────────────────────────────────────────────
export default function BeritaPage() {
  const { toast } = useToast();

  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [kategoriId, setKategoriId] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [filter, setFilter] = useState<"all" | "publish" | "draft">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<"publish" | "draft" | null>(null);

  const [errors, setErrors] = useState({
    judul: false,
    tanggal: false,
    isi: false,
    kategori: false,
    gambar: false,
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("berita")
      .select(`*, kategori:kategori_id (nama)`)
      .order("created_at", { ascending: false });
    if (!error) setData(data);
  };

  const fetchKategori = async () => {
    const { data, error } = await supabase
      .from("kategori")
      .select("*")
      .order("nama", { ascending: true });
    if (!error) setKategoriList(data);
  };

  useEffect(() => {
    fetchData();
    fetchKategori();
    setTanggal(toYMD(new Date()));
  }, []);

  useEffect(() => { setCurrentPage(1); }, [filter, search, kategoriFilter]);

  const tambahBerita = async (status: "publish" | "draft") => {
    const imageUrls: string[] = [];
    for (const img of images) {
      const fileName = `${Date.now()}-${img.name}`;
      const { error } = await supabase.storage.from("berita").upload(fileName, img);
      if (error) {
        toast({ title: "Gagal upload gambar", description: error.message, variant: "destructive" });
        return;
      }
      const { data } = supabase.storage.from("berita").getPublicUrl(fileName);
      imageUrls.push(data.publicUrl);
    }

    const { error: insertError } = await supabase.from("berita").insert([{
      judul, isi, tanggal,
      gambar: imageUrls,
      kategori_id: Number(kategoriId),
      status,
    }]);

    if (insertError) {
      toast({ title: "Gagal", description: "Gagal menyimpan berita", variant: "destructive" });
      return;
    }

    toast({
      title: status === "publish" ? "Berhasil!" : "Draft tersimpan!",
      description: status === "publish" ? "Berita berhasil dipublikasikan." : "Berita disimpan sebagai draft.",
      action: <CheckCircle className={`w-6 h-6 ${status === "publish" ? "text-green-500" : "text-orange-500"}`} />,
    });

    resetForm();
    fetchData();
  };

  const hapusBerita = async (id: string) => {
    const { data: berita } = await supabase.from("berita").select("gambar").eq("id", id).single();
    if (berita?.gambar) {
      let imgs: string[] = [];
      try { imgs = Array.isArray(berita.gambar) ? berita.gambar : JSON.parse(berita.gambar); }
      catch { imgs = [berita.gambar]; }
      const filePaths = imgs.map((url: string) => url.split("/berita/")[1]?.split("?")[0]);
      await supabase.storage.from("berita").remove(filePaths);
    }
    const { error } = await supabase.from("berita").delete().eq("id", id);
    if (error) {
      toast({ title: "Gagal", description: "Gagal menghapus berita.", variant: "destructive" });
      return;
    }
    toast({ title: "Berhasil!", description: "Data berita berhasil dihapus." });
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setEditStatus(item.status);
    setJudul(item.judul);
    setIsi(item.isi);
    setTanggal(item.tanggal);
    setKategoriId(String(item.kategori_id));
    let parsedImages: string[] = [];
    try { parsedImages = Array.isArray(item.gambar) ? item.gambar : JSON.parse(item.gambar); }
    catch { parsedImages = item.gambar ? [item.gambar] : []; }
    setOldImages(parsedImages);
    setImages([]);
  };

  const resetForm = () => {
    setJudul(""); setIsi(""); setTanggal(toYMD(new Date()));
    setKategoriId(""); setImages([]); setOldImages([]);
    setEditId(null); setEditStatus(null);
  };

  const handleSubmit = async (status: "publish" | "draft") => {
    const newErrors = {
      judul: !judul,
      isi: !isi,
      kategori: !kategoriId,
      tanggal: !tanggal,
      gambar: images.length === 0 && oldImages.length === 0,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast({ title: "Form belum lengkap", description: "Harap isi semua data sebelum melanjutkan.", variant: "destructive" });
      return;
    }

    if (editId) {
      const finalStatus = editStatus === "publish" ? "publish" : status;
      const imageUrls: string[] = [];
      for (const img of images) {
        const fileName = `${Date.now()}-${img.name}`;
        await supabase.storage.from("berita").upload(fileName, img);
        const { data } = supabase.storage.from("berita").getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      let finalImages = oldImages;
      if (imageUrls.length > 0 && oldImages.length === 0) {
        const { data: berita } = await supabase.from("berita").select("gambar").eq("id", editId).single();
        if (berita?.gambar) {
          let old: string[] = [];
          try { old = Array.isArray(berita.gambar) ? berita.gambar : JSON.parse(berita.gambar); }
          catch { old = [berita.gambar]; }
          await supabase.storage.from("berita").remove(old.map((url: string) => url.split("/berita/")[1]?.split("?")[0]));
        }
      }
      if (imageUrls.length > 0) {
        finalImages = oldImages.length === 0 ? imageUrls : [...oldImages, ...imageUrls];
      }

      const { error } = await supabase.from("berita").update({
        judul, isi, tanggal,
        kategori_id: Number(kategoriId),
        gambar: finalImages,
        status: finalStatus,
      }).eq("id", editId);

      if (error) {
        toast({ title: "Gagal", description: "Gagal memperbarui berita.", variant: "destructive" });
        return;
      }

      toast({
        title: finalStatus === "publish" ? "Berhasil!" : "Draft diperbarui",
        description: finalStatus === "publish" ? "Berita berhasil diperbarui dan dipublikasikan." : "Perubahan berhasil disimpan sebagai draft.",
        action: <CheckCircle className={`w-6 h-6 ${finalStatus === "publish" ? "text-green-500" : "text-orange-500"}`} />,
      });

      resetForm();
    } else {
      await tambahBerita(status);
      return;
    }
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    const processed: File[] = [];
    for (const file of files) {
      const result = await validateAndCompress(file, toast);
      if (result) processed.push(result);
    }
    if (processed.length === 0) return;
    setImages((prev) => {
      const combined = [...prev, ...processed];
      if (combined.length > 5) {
        toast({ title: "Batas gambar", description: "Maksimal 5 gambar!", variant: "destructive" });
        return prev;
      }
      return combined;
    });
  };

  const handleReplaceOldImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await validateAndCompress(file, toast);
    if (!result) return;
    setOldImages(oldImages.filter((_, i) => i !== index));
    setImages((prev) => [...prev, result]);
  };

  const handleReplaceNewImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await validateAndCompress(file, toast);
    if (!result) return;
    const newImages = [...images];
    newImages[index] = result;
    setImages(newImages);
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filter === "all" ? true : item.status?.toLowerCase().trim() === filter;
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategoriFilter === "all" ? true : String(item.kategori_id) === kategoriFilter;
    return matchStatus && matchSearch && matchKategori;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Upload Berita</h1>
        <p className="text-sm text-muted-foreground">Tambahkan berita terbaru untuk ditampilkan di website.</p>
      </div>

      <div className="bg-white py-4 px-5 rounded-xl shadow-sm space-y-4">
        <h2 className="font-bold text-xl">{editId ? "Edit Berita" : "Tambah Berita"}</h2>

        {/* GRID FORM */}
        <div className="grid md:grid-cols-4 gap-4">

          {/* JUDUL */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-base font-medium">Judul</label>
            <input
              placeholder="Masukkan judul berita"
              type="text"
              value={judul}
              onChange={(e) => { if (e.target.value.length <= 200) setJudul(e.target.value); }}
              className={`w-full h-10 px-3 border rounded-lg outline-none
                ${errors.judul ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
            />
            {errors.judul && <p className="text-xs text-red-500">*Judul harus diisi</p>}
            <div className="flex justify-end text-xs">
              <span className={judul.length === 200 ? "text-red-500" : "text-gray-500"}>{judul.length}/200</span>
            </div>
          </div>

          {/* TANGGAL */}
          <div className="space-y-1">
            <label className="text-base font-medium">Tanggal</label>
            <DatePicker
              value={tanggal}
              onChange={setTanggal}
              hasError={errors.tanggal}
            />
            {errors.tanggal && <p className="text-xs text-red-500">*Tanggal harus diisi</p>}
          </div>

          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Kategori</label>
            <Select value={kategoriId} onValueChange={(value) => setKategoriId(value)}>
              <SelectTrigger
                className={`w-full h-10 px-3 border rounded-lg outline-none
                  ${errors.kategori ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
              >
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border">
                {kategoriList.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)} className="cursor-pointer">
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && <p className="text-xs text-red-500">*Kategori harus dipilih</p>}
          </div>

          {/* GAMBAR */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-base font-medium">Gambar</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageUpload}
              className="w-full border p-2 rounded-lg"
            />
            <p className={`text-xs ${errors.gambar ? "text-red-500" : "text-gray-500"}`}>
              *maks 5 gambar, format .jpg, .jpeg, .png, .webp
            </p>

            {/* Old images */}
            {oldImages.length > 0 && (
              <div className="mt-3 space-y-2">
                {oldImages.map((img, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-lg">
                    <span className="text-sm truncate">
                      {(() => { const f = decodeURIComponent(img.split("/").pop() || ""); return f.replace(/^\d+-/, ""); })()}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const path = oldImages[index].split("/berita/")[1]?.split("?")[0];
                          if (path) supabase.storage.from("berita").remove([path]);
                          setOldImages(oldImages.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 text-sm"
                      >
                        Hapus
                      </button>
                      <label className="text-blue-500 text-sm cursor-pointer">
                        Ubah
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleReplaceOldImage(e, index)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New images */}
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                {images.map((img, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-lg">
                    <span className="text-sm truncate">{img.name}</span>
                    <div className="flex gap-3">
                      <button onClick={() => setImages(images.filter((_, i) => i !== index))} className="text-red-500 text-sm">Hapus</button>
                      <label className="text-blue-500 text-sm cursor-pointer">
                        Ubah
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleReplaceNewImage(e, index)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TEXTAREA ISI */}
        <div className="space-y-1">
          <label className="text-base font-medium">Isi Berita</label>
          <textarea
            placeholder="Masukkan isi berita"
            value={isi}
            onChange={(e) => { if (e.target.value.length <= 7000) setIsi(e.target.value); }}
            className={`w-full px-3 p-2 border rounded-lg outline-none
              ${errors.isi ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
          />
          {errors.isi && <p className="text-xs text-red-500">*Isi harus diisi</p>}
          <div className="flex justify-end text-xs">
            <span className={isi.length >= 7000 ? "text-red-500" : "text-gray-500"}>{isi.length}/7000</span>
          </div>
        </div>

        {/* BUTTONS */}
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
                <AlertDialogTitle>{editStatus === "publish" ? "Update berita?" : "Publish berita?"}</AlertDialogTitle>
                <AlertDialogDescription>
                  {editStatus === "publish" ? "Perubahan akan langsung terlihat oleh pengguna." : "Berita akan langsung dipublikasikan dan bisa dilihat oleh publik."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleSubmit("publish")} className="bg-green-500 hover:bg-green-600">Ya, lanjutkan</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* DRAFT */}
          {editStatus !== "publish" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90">Simpan Draft</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Simpan sebagai draft?</AlertDialogTitle>
                  <AlertDialogDescription>Berita tidak akan dipublikasikan dan hanya tersimpan sebagai draft.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleSubmit("draft")} className="bg-orange-500 hover:bg-orange-600">Ya, simpan</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* BATAL EDIT */}
          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Batal Edit
            </button>
          )}
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex gap-2 w-full md:w-auto">
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
            <Select value={kategoriFilter} onValueChange={(value) => setKategoriFilter(value)}>
              <SelectTrigger className="h-10 w-[160px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {kategoriList.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>{item.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {(["all", "publish", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-3 py-1 rounded-xl transition ${
                  filter === f
                    ? f === "all" ? "bg-gray-800 text-white"
                      : f === "publish" ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {f === "all" ? "All" : f === "publish" ? "Publish" : "Draft"}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-semibold text-gray-600 border-b text-center">
            <div>Tanggal</div>
            <div className="col-span-2">Judul</div>
            <div>Kategori</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {paginatedData.length === 0 ? (
            <div className="text-center text-gray-500 py-6">Tidak ada berita.</div>
          ) : (
            paginatedData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 transition text-center"
              >
                <div className="text-sm text-gray-600">{item.tanggal}</div>
                <div className="col-span-2 font-medium text-justify">{item.judul}</div>
                <div className="text-sm text-gray-500">{item.kategori?.nama || "-"}</div>
                <div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.status === "publish" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                  }`}>
                    {item.status === "publish" ? "Publish" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-center gap-2">
                  {/* EDIT */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100"><Pencil className="w-4 h-4" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit berita?</AlertDialogTitle>
                        <AlertDialogDescription>Kamu akan mengubah isi berita ini.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600">Ya, edit</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* HAPUS */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div>
                            <p>Kamu yakin ingin menghapus berita dengan judul:</p>
                            <p className="font-bold">"{item.judul}"</p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => hapusBerita(item.id)} className="bg-red-500 hover:bg-red-600">Ya, hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}

          {/* INFO + PAGINATION */}
          {filteredData.length > 0 && (
            <div className="px-4 py-3 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-xs text-gray-400 text-center md:text-left">
                Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} berita
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}