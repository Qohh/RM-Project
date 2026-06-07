"use client"
import { useEffect, useState } from "react"

export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState("--:--")

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return <h1 className="text-2xl font-bold text-primary">{currentTime}</h1>
}