import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
