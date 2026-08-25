"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function VisiMisi() {
  const [visi, setVisi] = useState("")
  const [misi, setMisi] = useState("")

useEffect(() => {
  const fetchProfil = async () => {
    try {
      const response = await fetch("/api/profil")

      if (!response.ok) {
        throw new Error("Gagal mengambil data profil")
      }

      const data = await response.json()

      setVisi(data.visi || "")
      setMisi(data.misi || "")
    } catch (error) {
      console.error(error)
    }
  }

  fetchProfil()
}, [])

  return (
    <div className="mt-24">
      <main className="px-4 py-6 md:px-16 lg:px-40">
        <Card>
          <CardContent className="mt-6 text-gray-600">

            {/* VISI */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-center text-primary mb-6">
                Visi
              </h3>
              <p className="text-justify md:text-center mb-4 mx-2 md:mx-10 lg:mx-20 leading-relaxed">
                {visi || "Belum ada data visi"}
              </p>
            </div>

            {/* MISI */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-center text-primary mb-6">
                Misi
              </h3>

              <ul className="text-justify mb-4 mx-2 md:mx-12 lg:mx-24 space-y-3">
                {misi
                  ? misi
                      .split("\n")
                      .filter((item) => item.trim() !== "")
                      .map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 md:p-4 rounded-lg border bg-background"
                        >
                          <div className="flex-shrink-0 mt-1 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-primary/10">
                            <span className="text-primary font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>

                          <p className="text-muted-foreground leading-relaxed">
                            {item}
                          </p>
                        </li>
                      ))
                  : (
                    <p className="text-center text-gray-400 italic">
                      Belum ada data misi
                    </p>
                  )}
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
    </div>
  )
}