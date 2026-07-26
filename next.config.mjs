/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [78, 82],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1600, 1920],
  },
};

export default nextConfig;
