/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'i.redd.it',
      'preview.redd.it',
      'external-preview.redd.it',
      'i.imgur.com',
      'unsplash.com',
      'images.unsplash.com',
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
