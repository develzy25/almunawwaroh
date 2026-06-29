import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  turbopack: {
    root: "../../", // Menunjuk ke root folder repository (monorepo root)
  },
};

export default nextConfig;
