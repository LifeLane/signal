
/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 's.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'media.zenfs.com',
      },
      {
        protocol: 'https',
        hostname: 'static.coindesk.com',
      },
      {
        protocol: 'https',
        hostname: 'www.coindesk.com',
      },
      {
        protocol: 'https',
        hostname: 'www.investopedia.com',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
      },
       {
        protocol: 'https',
        hostname: 'i.insider.com',
      },
    ],
  },
};

module.exports = nextConfig;
