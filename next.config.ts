import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iavzfvxnpsedcvgqbgbq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co", // 🔥 ImgBB
      },
    ],
  },
};

export default nextConfig;