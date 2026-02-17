import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Sejarah(){
    return(
        <>
            <main className="px-4 py-6 md:px-16 lg:px-40">

                  <Card>
                    <CardHeader className="border-b">
                    <CardTitle className="text-3xl font-bold text-center text-primary">SEJARAH</CardTitle>
                    <CardDescription className="text-sm text-center text-gray-600">
                        Gambaran Singkat Awal Berdiri dan Perkembangan Organisasi.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 text-gray-600">
                        <p className="text-justify mb-4 indent-5 mx-1 md:mx-6 leading-relaxed">
                            Pada tanggal 23 Oktober 1978 diresmikan sebuah bangunan masjid yang berlokasi di Jl. Jendral Ahmad Yani Kota Pontianak diberi nama Masjid MUJAHIDIN yang berarti Para Pejuang di karenakan proses pendirian masjid Raya ini memerlukan perjuangan yang besar, semua elemen umat Islam saling-bahu membahu untuk mendirikan sebuah masjid  Raya Mujahidin.
                        </p>
                       <p className="text-justify mb-4 indent-5 mx-1 md:mx-6 leading-relaxed">
                            Masjid Raya Mujahidin tidak hanya diisi dan diramaikan oleh jamaah yang dewasa (sudah berkeluarga) akan tetapi mendorong generasi muda untuk turut berupaya mengisi kegiatan Masjid dalam arti positif sebagai proses kaderisasi dan pedelegasian tanggung jawab . Maka tidak beberapa lama sejak diresmikan Masjid Raya Mujahidin para pemuda/remaja disekitar membentuk suatu organisasi untuk mengajak peran serta remaja untuk berdakwah dan mengisi kegiatan bermanfaat yang diberi nama Remaja Mujahidin, yang berdiri di Pontianak pada tanggal  2 April 1979 bertepatan dengan 4 Jumadil Awal 1399 H.
                        </p>
                        <p className="text-justify mb-4 indent-5 mx-1 md:mx-6 leading-relaxed">
                            REMAJA MUJAHIDIN (RM) merupakan bagian dari Masjid Raya Mujahdin, mencoba melaksanakan segala kegiatannya dari tahun ke tahun dengan mengikuti perkembangan sosial remaja, khususnya remaja ibukota Provinsi. Agar tetap terarah maka RM terus berupaya melakukan perbaikan dalam agenda-agendanya. 
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