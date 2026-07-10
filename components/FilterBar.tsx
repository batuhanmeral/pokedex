"use client";

import type { Dictionary } from "@/lib/i18n";
import { GENERATIONS, formatPokemonName } from "@/lib/pokeapi";
import { ALL_TYPES } from "@/lib/type-colors";

const selectClasses =
  "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:border-neutral-700 dark:focus:ring-neutral-800/60 sm:w-44";

export default function FilterBar({
  dict,
  selectedType,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
}: {
  dict: Dictionary;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  selectedGeneration: number | null;
  onGenerationChange: (generation: number | null) => void;
}) {
  const typeOptions = ALL_TYPES.map((type) => ({
    value: type,
    label: dict.typeNames[type] ?? formatPokemonName(type),
  })).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <select
        value={selectedType ?? ""}
        onChange={(e) => onTypeChange(e.target.value || null)}
        aria-label={dict.home.typeFilterAria}
        className={selectClasses}
      >
        <option value="">{dict.home.allTypes}</option>
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={selectedGeneration ?? ""}
        onChange={(e) =>
          onGenerationChange(e.target.value ? Number(e.target.value) : null)
        }
        aria-label={dict.home.generationFilterAria}
        className={selectClasses}
      >
        <option value="">{dict.home.allGenerations}</option>
        {GENERATIONS.map((gen) => (
          <option key={gen} value={gen}>
            {dict.home.generation} {gen}
          </option>
        ))}
      </select>
    </div>
  );
}
