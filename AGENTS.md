# AGENTS.md

Next.js 15 (App Router) + TypeScript + Tailwind 4 Pokedex; veri PokeAPI'den gelir.
Paket yöneticisi npm. Node `^22.12.0 || ^24 || >=26` (Vitest 5 gereksinimi).

## Commands

```bash
npm test                                   # tüm birim testleri, tek sefer (vitest run)
npx vitest run lib/pokeapi.test.ts         # tek test dosyası
npx vitest run -t "parseTeamParam"         # adına göre tek test
npm run test:watch                         # izleme modu
npm run test:coverage                      # testler + kapsam eşikleri
npm run lint                               # eslint . (flat config; uyarılar engellemez)
npm run typecheck                          # tsc --noEmit
npm run check                              # lint + typecheck + test:coverage (CI kapısı)
npm run smoke                              # elle kontrol: önce `npm run build` gerekir
```

## Test kuralları

- Testler `*.test.ts`, test ettikleri dosyanın yanında durur; yardımcılar `test/` altında.
- Gerçek ağ yasak: `test/setup.ts` global `fetch`'i engeller ve mock'lanmamış
  istek yapan testi düşürür. PokeAPI'yi `test/mock-fetch.ts` ile sahtele.
- Bileşen içindeki saf mantığı test etmek için önce `lib/`'e taşı.
- Kapsam eşikleri `vitest.config.mts` içinde; düşürme, kapsam arttıkça yükselt.

Ayrıntı (Türkçe): `.docs/test-altyapisi.md` (yerel, git'te yok).
