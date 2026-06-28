import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../../", // Menunjuk ke root folder repository (monorepo root)
  },
};

export default nextConfig;
