import type { NextConfig } from "next";

export const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://raw.githubusercontent.com",
      "font-src 'self'",
      "connect-src 'self' https://pokeapi.co",
      "media-src 'self' https://raw.githubusercontent.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  // "X-Powered-By: Next.js" başlığı gönderilmez; çatı bilgisini dışarı vermeye gerek yok.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  images: {
    /*
     * Görseller sabit boyutlarda render ediliyor (32 / 80 / 96 / 112 / 256px),
     * bu yüzden Next'in 16 varyantlık varsayılan listesine gerek yok. Liste
     * daraltılmazsa her <img> için 17 srcSet adayı üretiliyor ve ana sayfanın
     * HTML'i 1020 URL ile şişiyor.
     *
     * Değerler 2x ekranlar hesaba katılarak seçildi (112px → 224 → 256).
     */
    imageSizes: [32, 64, 96, 128, 256, 512],
    deviceSizes: [640, 828, 1200],
    // Sprite'lar hiç değişmiyor; optimize edilmiş hâli uzun süre saklanabilir.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

export default nextConfig;
