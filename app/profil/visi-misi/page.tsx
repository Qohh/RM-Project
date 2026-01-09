import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VisiMisi(){
    return(
        <>
            <main className="px-40 py-6">
                <Card>
                    <CardContent className="mt-6 text-gray-600">
                      <div className="mb-10">
                        <h3 className="text-3xl font-bold text-center text-primary mb-6">
                            Visi
                        </h3>
                        <p className="text-center mb-4 mx-20">
                            Menjadi wadah pembinaan remaja Islam yang berakhlak mulia,
                            berilmu, dan berperan aktif <br />dalam kegiatan keislaman serta sosial
                            di Kalimantan Barat.
                        </p>
                      </div>
                     
                      <div className="mb-10">
                        <h3 className="text-3xl font-bold text-center text-primary mb-6">
                            Misi
                        </h3>

                        <ul className="text-justify mb-4 mx-24 ">
                            {[
                            "Melakukan perekrutan, pembinaan dan pemberdayaan anggota Remaja Mujahidin agar terwujudnya Remaja Mujahidin yang produktif.",
                            "Mengadakan pelatihan minat dan bakat sesuai dengan hasil survey yang sudah dilakukan untuk mengembangkan potensi-potensi kader Remaja Mujahidin.",
                            "Menjadi organisasi yang mandiri dalam hal finansial yang berasal dari sumber-sumber dana yang halal untuk organisasi.",
                            "Mensyiarkan dakwah keislaman berbasis kemasjidan dan kekinian sesuai dengan perkembangan zaman.",
                            "Menjalin silaturahmi sesama Remaja Masjid lokal maupun nasional, dan organisasi masyarakat di Kota Pontianak.",
                            "Menjadikan kesekretariatan dan Masjid sebagai pusat dakwah dalam syiar keislaman dan pengembangan potensi kader Remaja Mujahidin.",
                            "Menjadikan media sosial Remaja Mujahidin sebagai media yang informatif dan terpercaya.",
                            "Memberikan pelayanan secara maksimal kepada Jamaah Masjid Raya Mujahidin Kalimantan Barat."
                            ].map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-lg border bg-background"
                            >
                                {/* Penanda / ikon */}
                                <div className="flex-shrink-0 mt-2 w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                                <span className="text-primary font-semibold text-sm">
                                    {index + 1}
                                </span>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">
                                {item}
                                </p>
                            </li>
                            ))}
                        </ul>
                        </div>

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