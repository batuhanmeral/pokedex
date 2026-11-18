"use client";

import { useMemo, useState } from "react";
import FilterBar from "./FilterBar";
import PokemonCard from "./PokemonCard";
import RandomButton from "./RandomButton";
import SearchBar from "./SearchBar";
import type { PokemonCardData } from "@/lib/grid-data";
import type { Dictionary, Locale } from "@/lib/i18n";
import { filterPokemon } from "@/lib/pokemon-filter";

const PAGE_SIZE = 60;

export default function PokemonGrid({
  list,
  locale,
  dict,
}: {
  list: PokemonCardData[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      filterPokemon(list, {
        query,
        type: selectedType,
        generation: selectedGeneration,
      }),
    [list, query, selectedType, selectedGeneration],
  );

  const visible = filtered.slice(0, visibleCount);
  const resetPage = () => setVisibleCount(PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Solda arama, sağda filtreler */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              resetPage();
            }}
            placeholder={dict.home.searchPlaceholder}
            ariaLabel={dict.home.searchAria}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <FilterBar
            dict={dict}
            selectedType={selectedType}
            onTypeChange={(type) => {
              setSelectedType(type);
              resetPage();
            }}
            selectedGeneration={selectedGeneration}
            onGenerationChange={(generation) => {
              setSelectedGeneration(generation);
              resetPage();
            }}
          />
          <RandomButton locale={locale} label={dict.home.random} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-500 dark:text-neutral-400">
          {dict.home.noResults}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <p className="text-xs text-slate-400 dark:text-neutral-500">
              {visible.length} / {filtered.length} {dict.home.showing}
            </p>
            {visibleCount < filtered.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
              >
                {dict.home.loadMore}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
