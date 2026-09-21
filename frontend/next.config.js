/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Konva's package main entry targets Node and imports the optional `canvas`
    // package. The editor only runs in the browser, so always resolve its web entry.
    config.resolve.alias['konva$'] = require.resolve('konva/lib/index.js');
    return config;
  },
};

module.exports = nextConfig;
