import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";
import type { PokemonCardData } from "@/lib/grid-data";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  artworkUrl,
  formatPokemonId,
  formatPokemonName,
} from "@/lib/pokeapi";
import { getTypeStyle } from "@/lib/type-colors";

export default function PokemonCard({
  pokemon,
  locale,
  dict,
}: {
  pokemon: PokemonCardData;
  locale: Locale;
  dict: Dictionary;
}) {
  const mainType = pokemon.types[0] ?? "normal";
  const style = getTypeStyle(mainType);

  return (
    <Link
      href={`/${locale}/pokemon/${pokemon.id}`}
      className={`group relative flex flex-col items-center rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 [contain-intrinsic-size:auto_250px] [content-visibility:auto] hover:-translate-y-1 hover:shadow-md dark:bg-neutral-900 ${style.border}`}
    >
      <span className="self-start text-xs font-semibold tracking-wide text-slate-400 dark:text-neutral-500">
        {formatPokemonId(pokemon.id)}
      </span>

      <div className="relative my-2 h-28 w-28">
        <div
          className={`absolute inset-2 rounded-full opacity-40 blur-xl transition-opacity duration-200 group-hover:opacity-70 ${style.glow}`}
        />
        <Image
          src={artworkUrl(pokemon.id)}
          alt={pokemon.name}
          fill
          sizes="112px"
          className="relative object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <h2 className="mt-1 text-center text-base font-semibold tracking-tight">
        {formatPokemonName(pokemon.name)}
      </h2>

      <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
        {pokemon.types.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            label={dict.typeNames[type] ?? formatPokemonName(type)}
          />
        ))}
      </div>
    </Link>
  );
}
