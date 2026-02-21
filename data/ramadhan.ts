
export const ramadhan_day: Record<
  number,
  {
    total: number
    ikhwan: number
    akhwat: number
    images?: {
      iftar?: string
      total?: string
      kajian?: string
    }
  }
> = {
  1: {
    total: 221,
    ikhwan: 100,
    akhwat: 121,
    images: {
      iftar: "/ramadhan/gogreen.jpeg",
      total: "/ramadhan/ji-day1.jpeg",
      kajian: "/ramadhan/kajian-day2.jpeg"
    },
  },

  2: {
    total: 255,
    ikhwan: 126,
    akhwat: 129,
    images: {
      iftar: "/ramadhan/gogreen.jpeg",
      total: "/ramadhan/ji-day2.jpeg",
      kajian: "ramadhan/kajian-day3.jpeg"
    },
  },

  3: {
    total: 0,
    ikhwan: 0,
    akhwat: 0,
    images: {
      iftar: "/ramadhan/gogreen.jpeg",
      total: "/ramadhan/ji-day2.jpeg",
      kajian: "ramadhan/kajian-day3.jpeg"
    },
  },

}
