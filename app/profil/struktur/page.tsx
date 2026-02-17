import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PengurusSection from "@/components/pengurus/pengurus_card"
import { pengurus } from "@/data/pengurus"
import Footer from "@/components/footer"

export default function StrukturKepengurusan() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-6 sm:py-8 md:py-10">
        <Card className="w-full">
          <CardHeader className="border-b px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary">
              STRUKTUR KEPENGURUSAN
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-center text-gray-600">
              Struktur Pengurus Periode 2026-2027
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6 sm:mt-8 md:mt-10 px-2 sm:px-4">
            <PengurusSection data={pengurus} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
