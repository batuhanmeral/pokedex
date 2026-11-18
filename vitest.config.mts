import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // tsconfig.json'daki "@/*" yolunu Vitest'e de tanıt
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // JSX'i otomatik runtime ile dönüştür ki kapsam ölçümü .tsx dosyalarını da parse edebilsin
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    // Testler gerçek ağa çıkamaz (bkz. test/setup.ts); stub'lar her testten sonra sıfırlanır
    setupFiles: ["test/setup.ts"],
    unstubGlobals: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      // Bileşenler ve sayfalar da ölçülür ki yüzde gerçek durumu göstersin
      include: ["lib/**/*.ts", "proxy.ts", "components/**/*.tsx", "app/**/*.tsx"],
      exclude: ["lib/types.ts", "**/*.test.ts"],
      reporter: ["text", "html"],
      // Eşikler ölçülen değerin ~1 puan altında (2026-11-18: st 45.3, br 38.8,
      // fn 33.9, ln 43.1); kapsam arttıkça yükselt. lib/ saf mantık, %100 tutulur.
      thresholds: {
        statements: 44,
        branches: 37,
        functions: 32,
        lines: 42,
        "lib/**/*.ts": { statements: 100, branches: 100, functions: 100, lines: 100 },
      },
    },
  },
});
