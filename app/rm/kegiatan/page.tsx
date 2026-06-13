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
// Konstanta validasi gambar
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
// Helper: format Date → "YYYY-MM-DD"
// ─────────────────────────────────────────────
function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// ─────────────────────────────────────────────
// Custom Date Picker
// ─────────────────────────────────────────────
function DatePicker({
  value,
  onChange,
  hasError,
  minDate,        // "YYYY-MM-DD" — tanggal sebelumnya dinonaktifkan
}: {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  minDate?: string;
}) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const todayStr = toYMD(today);

  const [viewYear, setViewYear] = useState(value ? parseInt(value.split("-")[0]) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split("-")[1]) - 1 : today.getMonth());

  // Saat popup dibuka, arahkan view ke bulan value yang ada
  const handleOpen = () => {
    if (value) {
      setViewYear(parseInt(value.split("-")[0]));
      setViewMonth(parseInt(value.split("-")[1]) - 1);
    }
    setOpen(true);
  };

  const selected = value ? new Date(value + "T00:00:00") : null;

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

  const displayValue = selected
    ? `${String(selected.getDate()).padStart(2,"0")} ${monthNames[selected.getMonth()]} ${selected.getFullYear()}`
    : "";

  // Cek apakah sebuah tanggal dinonaktifkan
  const isDisabled = (day: number): boolean => {
    if (!minDate) return false;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}` < minDate;
  };

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

            {/* Header navigasi bulan */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition">
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
              <button type="button" onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Nama hari */}
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Grid tanggal */}
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={idx} />;
                const mm = String(viewMonth + 1).padStart(2, "0");
                const dd = String(day).padStart(2, "0");
                const dayStr = `${viewYear}-${mm}-${dd}`;
                const isSelected = value === dayStr;
                const isTodayCell = dayStr === todayStr;
                const disabled = isDisabled(day);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelect(day)}
                    className={`text-sm h-8 w-8 mx-auto rounded-full flex items-center justify-center transition font-medium
                      ${disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : isSelected
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

            {/* Tombol Today */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleToday}
                disabled={!!(minDate && todayStr < minDate)}
                className="w-full py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
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
// Custom Time Picker
// ─────────────────────────────────────────────
function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const [selHour, selMinute] = value ? value.split(":") : ["08", "00"];

  const handleChange = (h: string, m: string) => {
    onChange(`${h}:${m}`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3 border rounded-lg outline-none text-left text-sm flex items-center justify-between transition focus:ring-2 focus:ring-primary
          ${!value ? "text-gray-400" : "text-gray-800"}
        `}
      >
        <span>{value || "Pilih waktu"}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-56">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Pilih Waktu</p>

            {/* Preview jam terpilih */}
            <div className="text-center text-2xl font-bold text-gray-800 mb-4 tabular-nums">
              {selHour}:{selMinute}
            </div>

            <div className="flex gap-3">
              {/* Jam */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 text-center mb-1">Jam</p>
                <div className="h-40 overflow-y-auto rounded-lg border border-gray-100 scrollbar-thin">
                  {hours.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleChange(h, selMinute || "00")}
                      className={`w-full text-sm py-1.5 text-center transition
                        ${selHour === h
                          ? "bg-primary text-white font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menit */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 text-center mb-1">Menit</p>
                <div className="h-40 overflow-y-auto rounded-lg border border-gray-100 scrollbar-thin">
                  {minutes.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleChange(selHour || "08", m)}
                      className={`w-full text-sm py-1.5 text-center transition
                        ${selMinute === m
                          ? "bg-primary text-white font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full mt-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-medium"
            >
              Selesai
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Komponen Pagination
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
export default function KegiatanPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [filter, setFilter] = useState<"all" | "publish" | "draft">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [errors, setErrors] = useState({
    judul: false,
    deskripsi: false,
    lokasi: false,
    gambar: false,
  });

  const fetchData = async (mode: "admin" | "publik" = "admin") => {
    const orderBy = mode === "admin" ? "created_at" : "tanggal_mulai";
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order(orderBy, { ascending: false });
    if (error) { console.error("Fetch error:", error.message); return; }
    setData(data);
  };

  useEffect(() => {
    fetchData();
    // Default tanggal mulai & selesai = hari ini
    const todayStr = toYMD(new Date());
    setTanggalMulai(todayStr);
    setTanggalSelesai(todayStr);
  }, []);

  // Reset ke halaman 1 saat filter/search berubah
  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  const tambahKegiatan = async (status: "publish" | "draft") => {
    const imageUrls: string[] = [];
    for (const img of images) {
      const fileName = `${Date.now()}-${img.name}`;
      const { error } = await supabase.storage.from("kegiatan").upload(fileName, img);
      if (error) { toast({ title: "Gagal upload gambar", description: error.message, variant: "destructive" }); return; }
      const { data } = supabase.storage.from("kegiatan").getPublicUrl(fileName);
      imageUrls.push(data.publicUrl);
    }
    const { error: insertError } = await supabase.from("kegiatan").insert([{
      judul, deskripsi,
      tanggal_mulai: tanggalMulai, waktu_mulai: waktuMulai,
      tanggal_selesai: tanggalSelesai, waktu_selesai: waktuSelesai,
      lokasi, gambar: imageUrls, status,
    }]);
    if (insertError) { toast({ title: "Gagal", description: "Gagal menyimpan kegiatan", variant: "destructive" }); return; }
    toast({
      title: status === "publish" ? "Berhasil!" : "Draft tersimpan!",
      description: status === "publish" ? "Kegiatan berhasil dipublikasikan." : "Kegiatan disimpan sebagai draft.",
      action: <CheckCircle className={`w-6 h-6 ${status === "publish" ? "text-green-500" : "text-orange-500"}`} />,
    });
    const todayStr = toYMD(new Date());
    setJudul(""); setTanggalMulai(todayStr); setWaktuMulai("");
    setTanggalSelesai(todayStr); setWaktuSelesai("");
    setDeskripsi(""); setLokasi(""); setImages([]); setOldImages([]);
    fetchData();
  };

  const hapusKegiatan = async (id: number) => {
    const { data } = await supabase.from("kegiatan").select("gambar").eq("id", id).single();
    if (data?.gambar) {
      let imgs: string[] = [];
      try { imgs = Array.isArray(data.gambar) ? data.gambar : JSON.parse(data.gambar); } catch { imgs = [data.gambar]; }
      await supabase.storage.from("kegiatan").remove(imgs.map((url: string) => url.split("/kegiatan/")[1]?.split("?")[0]));
    }
    await supabase.from("kegiatan").delete().eq("id", id);
    toast({ title: "Berhasil", description: "Data berhasil dihapus." });
    fetchData();
  };

  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<"publish" | "draft" | null>(null);

  const handleEdit = (item: any) => {
    setEditId(item.id); setEditStatus(item.status); setOldImages([]);
    setJudul(item.judul); setDeskripsi(item.deskripsi); setLokasi(item.lokasi);
    setTanggalMulai(item.tanggal_mulai || ""); setWaktuMulai(item.waktu_mulai || "");
    setTanggalSelesai(item.tanggal_selesai || ""); setWaktuSelesai(item.waktu_selesai || "");
    let parsedImages: string[] = [];
    try { parsedImages = Array.isArray(item.gambar) ? item.gambar : JSON.parse(item.gambar); }
    catch { parsedImages = item.gambar ? [item.gambar] : []; }
    setOldImages(parsedImages);
  };

  const handleSubmit = async (status: "publish" | "draft") => {
    const newErrors = {
      judul: !judul, deskripsi: !deskripsi, lokasi: !lokasi,
      tanggalMulai: !tanggalMulai, waktuMulai: !waktuMulai,
      tanggalSelesai: !tanggalSelesai, waktuSelesai: !waktuSelesai,
      gambar: images.length === 0 && oldImages.length === 0,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast({ title: "Form belum lengkap", description: "Harap isi semua data sebelum melanjutkan.", variant: "destructive" });
      return;
    }
    const start = new Date(`${tanggalMulai}T${waktuMulai}`);
    const end = new Date(`${tanggalSelesai}T${waktuSelesai}`);
    if (end < start) {
      toast({ title: "Waktu tidak valid", description: "Waktu selesai tidak boleh sebelum mulai", variant: "destructive" });
      return;
    }
    if (editId) {
      const finalStatus = editStatus === "publish" ? "publish" : status;
      const imageUrls: string[] = [];
      for (const img of images) {
        const fileName = `${Date.now()}-${img.name}`;
        const { error } = await supabase.storage.from("kegiatan").upload(fileName, img);
        if (error) { toast({ title: "Gagal upload", description: error.message, variant: "destructive" }); return; }
        const { data } = supabase.storage.from("kegiatan").getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }
      let finalImages = oldImages;
      if (imageUrls.length > 0 && oldImages.length === 0) {
        const { data } = await supabase.from("kegiatan").select("gambar").eq("id", editId).single();
        if (data?.gambar) {
          let old: string[] = [];
          try { old = Array.isArray(data.gambar) ? data.gambar : JSON.parse(data.gambar); } catch { old = [data.gambar]; }
          await supabase.storage.from("kegiatan").remove(old.map((url: string) => url.split("/kegiatan/")[1]?.split("?")[0]));
        }
      }
      if (imageUrls.length > 0) {
        finalImages = oldImages.length === 0 ? imageUrls : [...oldImages, ...imageUrls];
      }
      const { error } = await supabase.from("kegiatan").update({
        judul, deskripsi,
        tanggal_mulai: tanggalMulai, waktu_mulai: waktuMulai,
        tanggal_selesai: tanggalSelesai, waktu_selesai: waktuSelesai,
        lokasi, gambar: finalImages, status: finalStatus,
      }).eq("id", editId);
      if (error) { toast({ title: "Gagal", description: "Gagal memperbarui kegiatan.", variant: "destructive" }); return; }
      toast({
        title: finalStatus === "publish" ? "Berhasil" : "Draft diperbarui",
        description: finalStatus === "publish" ? "Kegiatan berhasil diperbarui dan dipublikasikan." : "Perubahan berhasil disimpan sebagai draft.",
        action: <CheckCircle className={`w-6 h-6 ${finalStatus === "publish" ? "text-green-500" : "text-orange-500"}`} />,
      });
      setEditId(null); setEditStatus(null); setOldImages([]);
    } else {
      await tambahKegiatan(status);
      return;
    }
    const todayStr2 = toYMD(new Date());
    setJudul(""); setDeskripsi(""); setTanggalMulai(todayStr2); setWaktuMulai("");
    setTanggalSelesai(todayStr2); setWaktuSelesai(""); setLokasi(""); setImages([]); setOldImages([]);
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

  const getProgress = (tm: string, wm: string, ts: string, ws: string) => {
    const now = new Date();
    const start = new Date(`${tm}T${wm}`);
    const end = new Date(`${ts}T${ws}`);
    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Selesai";
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filter === "all" ? true : item.status === filter;
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Upload Kegiatan</h1>
        <p className="text-sm text-muted-foreground">Tambahkan kegiatan terbaru untuk ditampilkan di website.</p>
      </div>

      <div className="bg-white py-4 px-5 rounded-xl shadow-sm space-y-4">
        <h2 className="font-bold text-xl">{editId ? "Edit Kegiatan" : "Tambah Kegiatan"}</h2>

        {/* GRID FORM */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* JUDUL */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-base font-medium">Judul</label>
            <input
              placeholder="Masukkan judul kegiatan"
              type="text"
              value={judul}
              onChange={(e) => { if (e.target.value.length <= 200) setJudul(e.target.value); }}
              className={`w-full h-10 px-3 border rounded-lg outline-none
                ${errors.judul ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
            />
            {errors.judul && <p className="text-xs text-red-500">*Judul harus diisi</p>}
            <div className="flex justify-end text-xs mt-1">
              <span className={judul.length === 200 ? "text-red-500" : "text-gray-500"}>{judul.length}/200</span>
            </div>
          </div>

          {/* LOKASI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Lokasi</label>
            <input
              placeholder="Masukkan lokasi"
              type="text"
              value={lokasi || ""}
              onChange={(e) => setLokasi(e.target.value)}
              className={`w-full h-10 px-3 border rounded-lg outline-none
                ${errors.lokasi ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
            />
            {errors.lokasi && <p className="text-xs text-red-500">*Lokasi harus diisi</p>}
          </div>

          {/* TANGGAL MULAI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Tanggal Mulai</label>
            <DatePicker
              value={tanggalMulai}
              onChange={(val) => {
                setTanggalMulai(val);
                // Jika tanggal selesai lebih awal dari mulai yang baru, reset ke nilai yang sama
                if (tanggalSelesai && val > tanggalSelesai) {
                  setTanggalSelesai(val);
                }
              }}
              hasError={false}
            />
          </div>

          {/* WAKTU MULAI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Waktu Mulai</label>
            <TimePicker value={waktuMulai} onChange={setWaktuMulai} />
          </div>

          {/* TANGGAL SELESAI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Tanggal Selesai</label>
            <DatePicker
              value={tanggalSelesai}
              onChange={setTanggalSelesai}
              hasError={false}
              minDate={tanggalMulai || undefined}
            />
          </div>

          {/* WAKTU SELESAI */}
          <div className="space-y-1">
            <label className="text-base font-medium">Waktu Selesai</label>
            <TimePicker value={waktuSelesai} onChange={setWaktuSelesai} />
          </div>
        </div>

        {/* GAMBAR */}
        <div className="space-y-1">
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

          {oldImages.length > 0 && (
            <div className="mt-3 space-y-2">
              {oldImages.map((img, index) => (
                <div key={index} className="flex justify-between items-center border p-3 rounded-lg">
                  <span className="text-sm truncate">
                    {(() => { const f = decodeURIComponent(img.split("/").pop() || ""); return f.replace(/^\d+-/, ""); })()}
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      const path = oldImages[index].split("/kegiatan/")[1]?.split("?")[0];
                      if (path) supabase.storage.from("kegiatan").remove([path]);
                      setOldImages(oldImages.filter((_, i) => i !== index));
                    }} className="text-red-500 text-sm">Hapus</button>
                    <label className="text-blue-500 text-sm cursor-pointer">
                      Ubah
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleReplaceOldImage(e, index)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

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

        {/* DESKRIPSI */}
        <div className="space-y-1">
          <label className="text-base font-medium">Deskripsi Kegiatan</label>
          <textarea
            placeholder="Masukkan deskripsi kegiatan"
            value={deskripsi}
            onChange={(e) => { if (e.target.value.length <= 7000) setDeskripsi(e.target.value); }}
            className={`w-full px-3 p-2 border rounded-lg outline-none
              ${errors.deskripsi ? "focus:ring-2 border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-primary"}`}
          />
          {errors.deskripsi && <p className="text-xs text-red-500">*Isi harus diisi</p>}
          <div className="flex justify-end text-xs mt-1">
            <span className={deskripsi.length >= 7000 ? "text-red-500" : "text-gray-500"}>{deskripsi.length}/7000</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:opacity-90">
                {editStatus === "publish" ? "Update" : "Publish"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{editStatus === "publish" ? "Update kegiatan?" : "Publish kegiatan?"}</AlertDialogTitle>
                <AlertDialogDescription>
                  {editStatus === "publish" ? "Perubahan akan langsung terlihat oleh pengguna." : "Kegiatan akan langsung dipublikasikan dan bisa dilihat oleh publik."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleSubmit("publish")} className="bg-green-500 hover:bg-green-600">Ya, lanjutkan</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {editStatus !== "publish" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90">Simpan Draft</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Simpan sebagai draft?</AlertDialogTitle>
                  <AlertDialogDescription>Kegiatan tidak akan dipublikasikan.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleSubmit("draft")} className="bg-orange-500 hover:bg-orange-600">Ya, simpan</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
            <div className="col-span-2 ">Judul</div>
            <div>Progress</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {paginatedData.length === 0 ? (
            <div className="text-center text-gray-500 py-6">Tidak ada kegiatan.</div>
          ) : (
            paginatedData.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 transition text-center">
                <div className="text-sm text-gray-600">{item.tanggal_mulai}</div>
                <div className="col-span-2 font-medium text-justify">{item.judul}</div>
                <div>
                  {(() => {
                    const progress = getProgress(item.tanggal_mulai, item.waktu_mulai, item.tanggal_selesai, item.waktu_selesai);
                    return (
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      progress === "Upcoming" ? "bg-[#FAEEDA] text-[#854F0B]"
                        : progress === "Ongoing" ? "bg-[#E6F1FB] text-[#185FA5]"
                        : "bg-[#E1F5EE] text-[#0F6E56]"
                    }`}>{progress}</span>
                    );
                  })()}
                </div>
                <div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.status === "publish" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                  }`}>
                    {item.status === "publish" ? "Publish" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100"><Pencil className="w-4 h-4" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit kegiatan?</AlertDialogTitle>
                        <AlertDialogDescription>Kamu akan mengubah isi kegiatan ini.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600">Ya, edit</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus kegiatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div>
                            <p>Kamu yakin ingin menghapus kegiatan dengan judul:</p>
                            <p className="font-bold">"{item.judul}"</p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => hapusKegiatan(item.id)} className="bg-red-500 hover:bg-red-600">Ya, hapus</AlertDialogAction>
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
                Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} kegiatan
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