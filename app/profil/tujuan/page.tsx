"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Tujuan() {
  const [tujuan, setTujuan] = useState("")

  useEffect(() => {
    const fetchProfil = async () => {
      const { data, error } = await supabase
        .from("profil")
        .select("tujuan")
        .eq("id", 1)
        .single()

      if (error) {
        console.error(error)
      } else {
        setTujuan(data.tujuan || "")
      }
    }

    fetchProfil()
  }, [])

  return (
    <div className="mt-24">
      <main className="px-4 py-6 md:px-16 lg:px-40">

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold text-center text-primary">
              TUJUAN
            </CardTitle>
            <CardDescription className="text-sm text-center text-gray-600">
              Tujuan utama yang menjadi dasar pergerakan organisasi.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4 text-gray-600">
            {tujuan ? (
              tujuan.split("\n").map((item, index) => (
                <p
                  key={index}
                  className="text-justify mb-4 indent-5 mx-1 md:mx-6 leading-relaxed"
                >
                  {item}
                </p>
              ))
            ) : (
              <p className="text-center text-gray-400 italic">
                Belum ada data tujuan
              </p>
            )}
          </CardContent>
        </Card>

      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 md:px-6 py-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Remaja Mujahidin Kalimantan Barat.
        </div>
      </footer>
    </div>
  )
}