import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    // Broaden the wildcard to ensure all subdomains/ports are covered in the workstation environment
    allowedDevOrigins: [
      "*.cluster-zhw3w37rxzgkutusbbhib6qhra.cloudworkstations.dev",
      "*.cloudworkstations.dev",
      "localhost:3000"
    ],
  }
};

export default nextConfig;