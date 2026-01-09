import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Tujuan(){
    return(
        <>
            <main className="px-40 py-6">
                  <Card>
                    <CardHeader className="border-b">
                    <CardTitle className="text-3xl font-bold text-center text-primary">TUJUAN</CardTitle>
                    <CardDescription className="text-sm text-center text-gray-600">
                        Tujuan utama yang menjadi dasar pergerakan organisasi.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6 text-gray-600">
                        <p className="text-justify mb-4 indent-5 mx-6">
                            Remaja Mujahidin dalam menjalankan aktivitasnya organisasi yang bertujuan terbinanya kehidupan beragama di kalangan remaja Islam,dalam mengembangkan potensi Ruhiyah, Fikriah dan jasadiah dan mengerahkan Seluruh potensi dan usaha agar tercapainya tujuan Remaja Mujahidin Kalimantan Barat.
                        </p>
                        <p className="text-justify mb-4 indent-5 mx-6">
                            Keberadaan RM membantu anggota-anggotanya untuk belajar berorganisasi dan bermasyarakat seperti dalam menghadapi hal -hal yang rutin seperti tanggung jawab dalam Kepanitiaan Ramadhan, Zakat Fitrah , Idul Fitri dan Qurban serta hari-hari besar Islam lainnya serta Bakti Sosial seperti Khitanan Massal, Pelayanan Kesehatan Remaja Islam Darul Ma'arif juga membina anggota-anggotanya untuk membentuk pribadi-pribadi yang Izzah(Bangga)  terhadap Islam maka mengadakan kegiatan kegiatan seperti Nuzulul Qur’an, Siraman Rohani, Itikaf pada bulan Ramadhan, melatih skill kepemimpinan dengan pelatihan-pelatihan leadership yang bekerja sama dengan Lembaga Manajemen Terapan. Selain itu juga menjalain ukhuwah dengan Remaja Masjid Lainnya dalam Forum Silahturahmi Remaja Masjid (FSRM), selain itu juga mengikuti undangan-undangan seminar seminar, dan pelatihan lainnya.
                        </p>
                    </CardContent>
                  </Card>
            </main>
          
            <footer className="border-t">
                <div className="container mx-auto px-4 md:px-6 py-6 text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} Remaja Mujahidin Kalimantan Barat.
                </div>
            </footer>
        </>
    )
}