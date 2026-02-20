/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['us-west-2.graphassets.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
    ],
  },
}

export default nextConfig