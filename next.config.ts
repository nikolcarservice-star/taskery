import type { NextConfig } from "next";

/** Host from TUNNEL_HOST env (hostname only, no protocol). Set when using `npm run tunnel`. */
const tunnelHost = process.env.TUNNEL_HOST?.replace(/^https?:\/\//, "").split("/")[0];

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const devLanHost = process.env.DEV_LAN_HOST?.replace(/^https?:\/\//, "").split("/")[0];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    ...(devLanHost ? [devLanHost] : []),
    ...(tunnelHost ? [tunnelHost] : []),
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
