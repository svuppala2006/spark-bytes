// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Fallback for environments where wildcard hostname isn't supported
    // domains: [process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '') || ''],
  },
};

export default nextConfig;
