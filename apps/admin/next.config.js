/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils", "@repo/db", "@repo/types"],
  serverExternalPackages: ["@prisma/client"]
};

export default nextConfig;
