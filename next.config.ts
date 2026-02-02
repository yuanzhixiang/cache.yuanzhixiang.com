import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const distDir = isDev ? ".next-dev" : ".next";

const nextConfig: NextConfig = {
  distDir,
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
