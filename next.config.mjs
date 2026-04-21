import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // On retire le rewrite global pour utiliser des Route Handlers plus fiables
      // {
      //   source: "/api/fivem/:path*",
      //   destination: "https://servers-frontend.fivem.net/api/:path*",
      // },
    ];
  },
};

export default withNextIntl(nextConfig);
