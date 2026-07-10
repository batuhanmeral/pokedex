import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { EvolutionDetail, EvolutionStage } from "@/lib/types";
import { formatPokemonId, formatPokemonName } from "@/lib/pokeapi";

/** Evrim koşulunu kısa, okunur bir etikete çevirir. */
function evolutionLabel(
  detail: EvolutionDetail | null,
  dict: Dictionary,
): string | null {
  if (!detail) return null;

  const trigger = detail.trigger?.name;

  if (trigger === "use-item" && detail.item) {
    return formatPokemonName(detail.item.name);
  }

  if (trigger === "trade") {
    return detail.held_item
      ? `${dict.detail.evoTrade} + ${formatPokemonName(detail.held_item.name)}`
      : dict.detail.evoTrade;
  }

  if (trigger === "level-up") {
    const parts: string[] = [];
    if (detail.min_level)
      parts.push(`${dict.detail.evoLevelPrefix} ${detail.min_level}`);
    if (detail.min_happiness) parts.push(dict.detail.evoHappiness);
    if (detail.held_item) parts.push(formatPokemonName(detail.held_item.name));
    if (detail.known_move) parts.push(formatPokemonName(detail.known_move.name));
    if (detail.time_of_day === "day") parts.push(dict.detail.evoDay);
    if (detail.time_of_day === "night") parts.push(dict.detail.evoNight);
    return parts.length > 0 ? parts.join(" · ") : dict.detail.evoSpecial;
  }

  return dict.detail.evoSpecial;
}

function EvolutionCard({
  stage,
  locale,
  dict,
  showCondition,
}: {
  stage: EvolutionStage;
  locale: Locale;
  dict: Dictionary;
  showCondition: boolean;
}) {
  const condition = showCondition ? evolutionLabel(stage.detail, dict) : null;

  return (
    <Link
      href={`/${locale}/pokemon/${stage.id}`}
      className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
    >
      {condition && (
        <span className="mb-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
          {condition}
        </span>
      )}
      <div className="relative h-20 w-20">
        <Image
          src={stage.image}
          alt={stage.name}
          fill
          sizes="80px"
          className="object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <span className="mt-2 text-xs text-slate-400 dark:text-neutral-500">
        {formatPokemonId(stage.id)}
      </span>
      <span className="text-sm font-semibold">
        {formatPokemonName(stage.name)}
      </span>
    </Link>
  );
}

export default function EvolutionChain({
  stages,
  locale,
  dict,
}: {
  stages: EvolutionStage[][];
  locale: Locale;
  dict: Dictionary;
}) {
  if (stages.length <= 1) {
    return (
      <p className="text-sm text-slate-500 dark:text-neutral-400">
        {dict.detail.noEvolution}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {stages.map((stage, index) => (
        <div key={index} className="flex items-center gap-3">
          {index > 0 && (
            <svg
              className="h-5 w-5 shrink-0 text-slate-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
              />
            </svg>
          )}
          <div className="flex flex-wrap gap-3">
            {stage.map((pokemon) => (
              <EvolutionCard
                key={pokemon.id}
                stage={pokemon}
                locale={locale}
                dict={dict}
                showCondition={index > 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
