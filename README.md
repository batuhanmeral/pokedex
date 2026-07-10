# Pokedex

A modern, minimalist Pokedex powered by [PokeAPI](https://pokeapi.co). Built with Next.js (App Router), TypeScript, and Tailwind CSS — no external database or authentication required, deployable to Vercel as-is.

## Features

- **All Pokemon** — every species from Gen 1 through Gen 9 (1025 Pokemon), listed as type-colored cards with instant client-side search by name or number.
- **Filters** — filter the grid by any of the 18 types and/or by generation, with "load more" pagination.
- **Detail page** (`/[locale]/pokemon/[id]`) — official artwork, types, height/weight/generation, abilities, and base stats as visual bars, plus:
  - **Type matchups** — combined defensive multipliers (4×/2×/½×/¼×/0×) computed from both types' damage relations.
  - **Evolution chain** — clickable, branching chains included, with evolution conditions (level, stone, trade, happiness…) shown on each stage.
  - **Alternate forms** — mega/Gigantamax/regional varieties linked as cards.
  - **Species info** — capture rate, gender ratio, egg groups, habitat, and legendary/mythical badges.
  - **Moves** — level-up move table (from the version group with the richest data) and a collapsible TM/TR list.
  - **Cry** — a speaker button plays the Pokemon's cry.
- **Compare** (`/[locale]/compare`) — pick two Pokemon via searchable comboboxes and compare their base stats side by side; the higher value is highlighted.
- **Random Pokemon** — a button next to the filters jumps to a random Pokemon's detail page.
- **Dark mode** — system-aware theme with a manual toggle, implemented with `next-themes` and Tailwind's class-based dark variant.
- **i18n (TR/EN)** — locale-prefixed routes (`/tr`, `/en`) with middleware-based detection (cookie → `Accept-Language` → default) and a language switcher in the navbar.

## Tech Notes

- The data layer lives in [lib/pokeapi.ts](lib/pokeapi.ts); every request is cached for 24 hours via Next.js fetch caching (`revalidate: 86400`). No external cache is used.
- Card data for all 1025 Pokemon is fetched server-side in batches of 50 ([lib/grid-data.ts](lib/grid-data.ts)); only the first render pays the cost, subsequent requests hit the cache.
- Images are optimized with `next/image`; the `raw.githubusercontent.com` sprite host is allowed in [next.config.ts](next.config.ts).
- Because Tailwind scans class names at build time, per-type colors are stored as full class strings in [lib/type-colors.ts](lib/type-colors.ts).
- Grid cards use CSS `content-visibility: auto` so off-screen cards skip rendering work even when many pages are loaded.
- UI strings for both locales live in [lib/i18n.ts](lib/i18n.ts). Flavor texts come from PokeAPI, which does not provide Turkish, so they are shown in English.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Deploy

Connect the repository to Vercel — no environment variables or extra configuration needed.

## License

[MIT](LICENSE)
