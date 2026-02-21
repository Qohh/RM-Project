
export const ramadhan_day: Record<
  number,
  {
    total: number
    ikhwan: number
    akhwat: number
    images?: {
      iftar?: string
      total?: string
    }
  }
> = {
  1: {
    total: 275,
    ikhwan: 161,
    akhwat: 0,
    images: {
      iftar: "/ramadhan/dokumentasi-iftar.jpeg",
      total: "/ramadhan/total-jamaah-iftar.jpeg",
    },
  },

  2: {
    total: 0,
    ikhwan: 0,
    akhwat: 0,
    images: {
      iftar: "/tes.jpg",
      total: "/ramadhan/total-jamaah-iftar.jpeg",
  },
}}
