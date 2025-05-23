/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.indianhealthyrecipes.com',
      },
      {
        protocol: 'https',
        hostname: 'blog.swiggy.com',
      },
      {
        protocol: 'https',
        hostname: 'nfcihospitality.com',
      },
      {
        protocol: 'https',
        hostname: 'thewhiskaddict.com',
      },
      {
        protocol: 'https',
        hostname: 'sharethespice.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cubesnjuliennes.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'bakewithshivesh.com',
      },
      {
        protocol: 'https',
        hostname: 'shivanilovesfood.com',
      },
      {
        protocol: 'https',
        hostname: 'annikaeats.com',
      },
      {
        protocol: 'https',
        hostname: 'bakingwithgranny.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'cdn.loveandlemons.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
