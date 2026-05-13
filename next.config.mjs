import { InjectManifest } from 'workbox-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack for Workbox
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: './public/sw.js',
          swDest: 'sw.js',
          exclude: [
            /\.map$/,
            /^manifest.*\.js$/,
          ],
        })
      );
    }

    return config;
  },
};

export default nextConfig;
