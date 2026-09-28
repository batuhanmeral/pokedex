/**
 * Sayfanın arkasında sabit duran dekoratif katman: iki büyük renk lekesi
 * (pokeball kırmızısı + soğuk mavi) ve üzerine çok ince grain dokusu.
 *
 * Tamamen CSS; animasyon ve JS yok, dolayısıyla paint maliyeti ihmal
 * edilebilir ve prefers-reduced-motion için ayrı bir dal gerekmiyor.
 * Kartlar opak olduğu için metin kontrastı etkilenmez.
 */

const GLOW_GRADIENTS = [
  "radial-gradient(60rem 40rem at 12% -5%, rgba(239, 68, 68, 0.22), transparent 70%)",
  "radial-gradient(55rem 38rem at 88% 105%, rgba(59, 130, 246, 0.20), transparent 70%)",
].join(", ");

// feTurbulence ile üretilen grain; harici istek olmaması için data-URI
const GRAIN_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">` +
      `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter>` +
      `<rect width="100%" height="100%" filter="url(#n)"/>` +
      `</svg>`,
  );

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Renk lekeleri — light modda daha bastırılmış */}
      <div
        className="absolute inset-0 opacity-45 dark:opacity-100"
        style={{ backgroundImage: GLOW_GRADIENTS }}
      />
      {/* Grain, zeminin düz görünmesini engelliyor */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
      />
    </div>
  );
}
