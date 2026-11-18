"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import TypeBadge from "./TypeBadge";
import { STAT_ORDER } from "./StatBar";
import type { Dictionary } from "@/lib/i18n";
import {
  artworkUrl,
  formatPokemonId,
  formatPokemonName,
} from "@/lib/pokeapi";
import { filterSuggestions } from "@/lib/pokemon-filter";
import { getTypeStyle } from "@/lib/type-colors";
import type { Pokemon, PokemonListItem } from "@/lib/types";

const MAX_BASE_STAT = 255;

function usePokemon(id: string): { pokemon: Pokemon | null; loading: boolean } {
  const [result, setResult] = useState<{
    id: string;
    pokemon: Pokemon | null;
  }>({ id: "", pokemon: null });

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<Pokemon>;
      })
      .then((data) => {
        if (!cancelled) setResult({ id, pokemon: data });
      })
      .catch(() => {
        if (!cancelled) setResult({ id, pokemon: null });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) return { pokemon: null, loading: false };
  if (result.id !== id) return { pokemon: null, loading: true };
  return { pokemon: result.pokemon, loading: false };
}

function PokemonCombobox({
  list,
  onChange,
  label,
  placeholder,
  noResultsText,
}: {
  list: PokemonListItem[];
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  noResultsText: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(
    () => filterSuggestions(list, query),
    [list, query],
  );

  const select = (pokemon: PokemonListItem) => {
    onChange(String(pokemon.id));
    setQuery(formatPokemonName(pokemon.name));
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onBlur={(e) => {
        // Odak dropdown içindeki bir seçeneğe geçiyorsa kapatma
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-neutral-400">
          {label}
        </span>
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (e.target.value.trim() === "") onChange("");
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) {
              e.preventDefault();
              select(suggestions[0]);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700 dark:focus:ring-neutral-800/60"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
        />
      </label>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-neutral-400">
              {noResultsText}
            </p>
          ) : (
            suggestions.map((pokemon) => (
              <button
                key={pokemon.id}
                type="button"
                onClick={() => select(pokemon)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800/60"
              >
                <Image
                  src={artworkUrl(pokemon.id)}
                  alt={pokemon.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span className="w-12 shrink-0 text-xs text-slate-400 dark:text-neutral-500">
                  {formatPokemonId(pokemon.id)}
                </span>
                <span className="font-medium">
                  {formatPokemonName(pokemon.name)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function PokemonPreview({
  pokemon,
  loading,
  dict,
}: {
  pokemon: Pokemon | null;
  loading: boolean;
  dict: Dictionary;
}) {
  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-500 dark:border-neutral-800" />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex h-52 flex-col items-center justify-center text-slate-300 dark:text-neutral-600">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-200 dark:border-neutral-700">
          <span className="text-3xl">?</span>
        </div>
        <p className="mt-3 text-sm">{dict.compare.notSelected}</p>
      </div>
    );
  }

  const mainType = pokemon.types[0]?.type.name ?? "normal";
  const style = getTypeStyle(mainType);
  const image =
    pokemon.sprites.other["official-artwork"].front_default ??
    artworkUrl(pokemon.id);

  return (
    <div className="flex h-52 flex-col items-center justify-center">
      <div className="relative h-28 w-28">
        <div
          className={`absolute inset-2 rounded-full opacity-40 blur-xl ${style.glow}`}
        />
        <Image
          src={image}
          alt={pokemon.name}
          fill
          sizes="112px"
          className="relative object-contain drop-shadow-sm"
        />
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-neutral-500">
        {formatPokemonId(pokemon.id)}
      </p>
      <p className="font-semibold">{formatPokemonName(pokemon.name)}</p>
      <div className="mt-1.5 flex gap-1.5">
        {pokemon.types.map(({ type }) => (
          <TypeBadge
            key={type.name}
            type={type.name}
            label={dict.typeNames[type.name] ?? formatPokemonName(type.name)}
          />
        ))}
      </div>
    </div>
  );
}

function CompareStatRow({
  label,
  left,
  right,
  leftBarClass,
  rightBarClass,
}: {
  label: string;
  left: number;
  right: number;
  leftBarClass: string;
  rightBarClass: string;
}) {
  const leftPercent = Math.min((left / MAX_BASE_STAT) * 100, 100);
  const rightPercent = Math.min((right / MAX_BASE_STAT) * 100, 100);

  return (
    <div className="grid grid-cols-[1fr_5rem_1fr] items-center gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-9 shrink-0 text-sm tabular-nums ${
            left >= right
              ? "font-bold"
              : "font-medium text-slate-400 dark:text-neutral-500"
          }`}
        >
          {left}
        </span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
          <div
            className={`ml-auto h-full rounded-full transition-all duration-500 ${leftBarClass}`}
            style={{ width: `${leftPercent}%` }}
          />
        </div>
      </div>

      <span className="text-center text-xs font-medium text-slate-500 dark:text-neutral-400">
        {label}
      </span>

      <div className="flex items-center gap-2.5">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${rightBarClass}`}
            style={{ width: `${rightPercent}%` }}
          />
        </div>
        <span
          className={`w-9 shrink-0 text-right text-sm tabular-nums ${
            right >= left
              ? "font-bold"
              : "font-medium text-slate-400 dark:text-neutral-500"
          }`}
        >
          {right}
        </span>
      </div>
    </div>
  );
}

export default function CompareClient({
  list,
  dict,
}: {
  list: PokemonListItem[];
  dict: Dictionary;
}) {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const { pokemon: left, loading: leftLoading } = usePokemon(leftId);
  const { pokemon: right, loading: rightLoading } = usePokemon(rightId);

  const leftStyle = getTypeStyle(left?.types[0]?.type.name ?? "normal");
  const rightStyle = getTypeStyle(right?.types[0]?.type.name ?? "normal");

  const statOf = (pokemon: Pokemon, name: string) =>
    pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  const leftTotal = left
    ? left.stats.reduce((sum, s) => sum + s.base_stat, 0)
    : 0;
  const rightTotal = right
    ? right.stats.reduce((sum, s) => sum + s.base_stat, 0)
    : 0;

  const card =
    "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8";

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <PokemonCombobox
              list={list}
              onChange={setLeftId}
              label={dict.compare.first}
              placeholder={dict.compare.selectPlaceholder}
              noResultsText={dict.compare.noResults}
            />
            <PokemonPreview pokemon={left} loading={leftLoading} dict={dict} />
          </div>
          <div>
            <PokemonCombobox
              list={list}
              onChange={setRightId}
              label={dict.compare.second}
              placeholder={dict.compare.selectPlaceholder}
              noResultsText={dict.compare.noResults}
            />
            <PokemonPreview
              pokemon={right}
              loading={rightLoading}
              dict={dict}
            />
          </div>
        </div>
      </div>

      {left && right && (
        <div className={card}>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.compare.comparison}
          </h2>
          <div className="mt-6 space-y-4">
            {STAT_ORDER.map((name) => (
              <CompareStatRow
                key={name}
                label={dict.statLabels[name] ?? name}
                left={statOf(left, name)}
                right={statOf(right, name)}
                leftBarClass={leftStyle.bar}
                rightBarClass={rightStyle.bar}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-[1fr_5rem_1fr] items-center gap-3 border-t border-slate-100 pt-4 dark:border-neutral-800">
            <span
              className={`text-sm tabular-nums ${
                leftTotal >= rightTotal
                  ? "font-bold"
                  : "font-medium text-slate-400 dark:text-neutral-500"
              }`}
            >
              {leftTotal}
            </span>
            <span className="text-center text-xs font-medium text-slate-500 dark:text-neutral-400">
              {dict.compare.total}
            </span>
            <span
              className={`text-right text-sm tabular-nums ${
                rightTotal >= leftTotal
                  ? "font-bold"
                  : "font-medium text-slate-400 dark:text-neutral-500"
              }`}
            >
              {rightTotal}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
