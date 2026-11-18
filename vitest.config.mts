import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // tsconfig.json'daki "@/*" yolunu Vitest'e de tanıt
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // tsconfig "jsx: preserve" (Next için) JSX'i dönüştürmüyor; dönüştürülmezse
  // kapsam ölçümü .tsx dosyalarını parse edemeyip sessizce dışarıda bırakıyor
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
      include: ["lib/**/*.ts", "middleware.ts", "components/**/*.tsx", "app/**/*.tsx"],
      exclude: ["lib/types.ts", "**/*.test.ts"],
      reporter: ["text", "html"],
      // Eşikler ölçülen değerin ~1 puan altında (2026-11-18: st 37.2, br 25.9,
      // fn 29.8, ln 36.0); kapsam arttıkça yükselt. lib/ saf mantık, sıkı tutulur.
      thresholds: {
        statements: 36,
        branches: 24,
        functions: 28,
        lines: 35,
        "lib/**/*.ts": { statements: 99, branches: 96, functions: 100, lines: 99 },
      },
    },
  },
});
