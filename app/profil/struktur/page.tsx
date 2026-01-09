import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { pengurus } from "@/data/pengurus";

export default function StruturKepengurusan(){
    return(
        <>
            <main className="px-40 py-6">
                  <Card>
                    <CardHeader className="border-b">
                    <CardTitle className="text-3xl font-bold text-center text-primary">STRUKTUR KEPENGURUSAN</CardTitle>
                    <CardDescription className="text-sm text-center text-gray-600">
                        Struktur Pengurus yang Mengemban Amanah dalam Menjalankan Visi dan Misi Organisasi.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6 text-gray-600">
                          <div className="overflow-x-auto">
       <div className="overflow-x-auto space-y-6">
        {pengurus.map((bidang, i) => (
            <table
            key={i}
            className="min-w-full border border-gray-300 text-sm font-sans"
            >
            <thead className="bg-gray-100">
                <tr>
                <th
                    className="border px-4 py-2 text-center font-semibold"
                    colSpan={2}
                >
                    {bidang.bidang}
                </th>
                </tr>
            </thead>
            <tbody>
                {bidang.anggota.map((item, idx) => (
                <tr key={idx}>
                    <td className="border px-4 py-2 w-1/3 font-medium">
                    {item.jabatan}
                    </td>
                    <td className="border px-4 py-2">
                    {item.nama}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        ))}
        </div>

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