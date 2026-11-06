/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // En sandboxes con mounts especiales, el build puede dirigirse a otro directorio.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
