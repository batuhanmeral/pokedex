"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import TeamAnalysisPanel from "./TeamAnalysis";
import TypeBadge from "./TypeBadge";
import type { PokemonCardData } from "@/lib/grid-data";
import type { Dictionary, Locale } from "@/lib/i18n";
import { artworkUrl, formatPokemonId, formatPokemonName } from "@/lib/pokeapi";
import { filterSuggestions } from "@/lib/pokemon-filter";
import { analyzeTeam } from "@/lib/team-analysis";
import { buildTeamQuery, parseTeamParam, TEAM_SIZE } from "@/lib/team-param";
import { getTypeStyle } from "@/lib/type-colors";
import type { TypeChart } from "@/lib/types";

function TeamCombobox({
  list,
  excluded,
  onSelect,
  disabled,
  placeholder,
  noResultsText,
}: {
  list: PokemonCardData[];
  excluded: number[];
  onSelect: (id: number) => void;
  disabled: boolean;
  placeholder: string;
  noResultsText: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(
    () => filterSuggestions(list, query, excluded),
    [list, excluded, query],
  );

  const select = (pokemon: PokemonCardData) => {
    onSelect(pokemon.id);
    setQuery("");
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
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            select(suggestions[0]);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700 dark:focus:ring-neutral-800/60"
        role="combobox"
        aria-expanded={open}
        aria-label={placeholder}
      />

      {open && !disabled && (
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

function TeamSlot({
  member,
  locale,
  dict,
  onRemove,
}: {
  member: PokemonCardData | null;
  locale: Locale;
  dict: Dictionary;
  onRemove: (id: number) => void;
}) {
  if (member === null) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 text-slate-300 dark:border-neutral-800 dark:text-neutral-600">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-200 dark:border-neutral-700">
          <span className="text-2xl">?</span>
        </div>
        <p className="mt-3 text-sm">{dict.team.emptySlot}</p>
      </div>
    );
  }

  const { id, types } = member;
  const style = getTypeStyle(types[0] ?? "normal");

  return (
    <div className="relative flex min-h-56 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <button
        type="button"
        onClick={() => onRemove(id)}
        title={dict.team.remove}
        aria-label={dict.team.remove}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <Link
        href={`/${locale}/pokemon/${id}`}
        className="flex flex-col items-center"
      >
        <div className="relative h-24 w-24">
          <div
            className={`absolute inset-2 rounded-full opacity-40 blur-xl ${style.glow}`}
          />
          <Image
            src={artworkUrl(id)}
            alt={member.name}
            fill
            sizes="96px"
            className="relative object-contain drop-shadow-sm"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-neutral-500">
          {formatPokemonId(id)}
        </p>
        <p className="text-center font-semibold">
          {formatPokemonName(member.name)}
        </p>
      </Link>

      <div className="mt-1.5 flex min-h-6 gap-1.5">
        {types.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            label={dict.typeNames[type] ?? formatPokemonName(type)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TeamBuilderClient({
  list,
  chart,
  dict,
  locale,
}: {
  list: PokemonCardData[];
  chart: TypeChart;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const byId = useMemo(
    () => new Map(list.map((pokemon) => [pokemon.id, pokemon])),
    [list],
  );
  const validIds = useMemo(() => new Set(byId.keys()), [byId]);
  const [team, setTeam] = useState<number[]>(() =>
    parseTeamParam(searchParams.get("p"), validIds),
  );
  const [copied, setCopied] = useState(false);

  // Takım her değiştiğinde URL'i güncelle ki adres çubuğu paylaşılabilir olsun
  const syncUrl = (ids: number[]) => {
    router.replace(`${pathname}${buildTeamQuery(ids)}`, { scroll: false });
  };

  const add = (id: number) => {
    if (team.length >= TEAM_SIZE || team.includes(id)) return;
    const next = [...team, id];
    setTeam(next);
    syncUrl(next);
  };

  const remove = (id: number) => {
    const next = team.filter((memberId) => memberId !== id);
    setTeam(next);
    syncUrl(next);
  };

  const clear = () => {
    setTeam([]);
    syncUrl([]);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano erişimi reddedildiyse sessizce geç
    }
  };

  const members = useMemo(
    () =>
      team.flatMap((id) => {
        const member = byId.get(id);
        return member ? [member] : [];
      }),
    [team, byId],
  );

  const slots: (PokemonCardData | null)[] = [
    ...members,
    ...Array<null>(TEAM_SIZE - members.length).fill(null),
  ];

  // Tip tablosu sabit, üyeler prop olarak geldiği için analiz ağ isteği
  // gerektirmez; takım değiştiğinde anında yeniden hesaplanır.
  const analysis = useMemo(
    () => (members.length > 0 ? analyzeTeam(members, chart) : null),
    [members, chart],
  );

  const card =
    "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8";

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <TeamCombobox
              list={list}
              excluded={team}
              onSelect={add}
              disabled={team.length >= TEAM_SIZE}
              placeholder={dict.team.selectPlaceholder}
              noResultsText={dict.team.noResults}
            />
          </div>

          <span className="text-sm font-semibold tabular-nums text-slate-500 dark:text-neutral-400">
            {team.length}/{TEAM_SIZE}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              disabled={team.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              {copied ? dict.team.copied : dict.team.share}
            </button>

            {team.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white"
              >
                {dict.team.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((member, index) => (
          <TeamSlot
            key={member?.id ?? `empty-${index}`}
            member={member}
            locale={locale}
            dict={dict}
            onRemove={remove}
          />
        ))}
      </div>

      {analysis && <TeamAnalysisPanel analysis={analysis} dict={dict} />}
    </div>
  );
}
