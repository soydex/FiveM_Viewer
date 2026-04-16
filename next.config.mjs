/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/fivem/:path*",
        destination: "https://servers-frontend.fivem.net/api/:path*",
      },
    ];
  },
};

export default nextConfig;
