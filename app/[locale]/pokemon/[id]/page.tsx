import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CryButton from "@/components/CryButton";
import EvolutionChain from "@/components/EvolutionChain";
import StatBar from "@/components/StatBar";
import TypeBadge from "@/components/TypeBadge";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import {
  artworkUrl,
  formatPokemonId,
  formatPokemonName,
  generationOf,
  getDefensiveMatchups,
  getEncounters,
  getEvolutionStages,
  getMachineMoves,
  getMoveSet,
  getPokemon,
  getPokemonSpecies,
  idFromUrl,
} from "@/lib/pokeapi";
import { getTypeStyle } from "@/lib/type-colors";
import type { MatchupGroup, Pokemon, PokemonSpecies } from "@/lib/types";

/*
 * Detay sayfası dinamik segment kullandığı için varsayılan olarak her
 * istekte yeniden render ediliyordu; bu da Pokemon başına 100'ü aşan
 * PokeAPI isteği demekti. revalidate ile render sonucu tam rota
 * önbelleğine giriyor: ilk ziyaretçiden sonrası hazır HTML alıyor.
 */
export const revalidate = 86400;

/*
 * Boş liste + varsayılan dynamicParams: hiçbir sayfa build'de üretilmiyor,
 * ama rota ISR'a kaydoluyor. revalidate tek başına yetmiyor; dinamik segment
 * generateStaticParams olmadan tam rota önbelleğine hiç girmiyor.
 */
export function generateStaticParams() {
  return [];
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function fetchPokemonOrNotFound(id: string): Promise<Pokemon> {
  try {
    return await getPokemon(id.toLowerCase());
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  try {
    const pokemon = await getPokemon(id.toLowerCase());
    return {
      title: `${formatPokemonName(pokemon.name)} ${formatPokemonId(pokemon.id)}`,
    };
  } catch {
    return { title: dict.meta.pokemonNotFound };
  }
}

function formatMultiplier(multiplier: number): string {
  if (multiplier === 0.5) return "½×";
  if (multiplier === 0.25) return "¼×";
  return `${multiplier}×`;
}

function MatchupRow({
  label,
  groups,
  dict,
}: {
  label: string;
  groups: MatchupGroup[];
  dict: Dictionary;
}) {
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
      <span className="w-32 shrink-0 text-xs font-medium text-slate-500 dark:text-neutral-400">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {groups.flatMap((group) =>
          group.types.map((type) => (
            <span key={type} className="inline-flex items-center gap-1">
              <TypeBadge
                type={type}
                label={dict.typeNames[type] ?? formatPokemonName(type)}
              />
              <span className="text-[11px] font-semibold tabular-nums text-slate-400 dark:text-neutral-500">
                {formatMultiplier(group.multiplier)}
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}

function GenderRatio({
  species,
  dict,
}: {
  species: PokemonSpecies;
  dict: Dictionary;
}) {
  if (species.gender_rate < 0) {
    return <span>{dict.detail.genderless}</span>;
  }

  const female = (species.gender_rate / 8) * 100;
  const male = 100 - female;

  return (
    <span className="tabular-nums">
      <span className="text-blue-500 dark:text-blue-400">♂ {male}%</span>
      {" · "}
      <span className="text-pink-500 dark:text-pink-400">♀ {female}%</span>
    </span>
  );
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const pokemon = await fetchPokemonOrNotFound(id);
  const moveSet = getMoveSet(pokemon);

  const [species, evolutionStages, matchups, encounters, machineMoves] =
    await Promise.all([
      getPokemonSpecies(pokemon.species.name),
      getEvolutionStages(pokemon.species.name),
      getDefensiveMatchups(pokemon.types.map((t) => t.type.name)),
      getEncounters(pokemon.id),
      moveSet.versionGroup
        ? getMachineMoves(moveSet.machine, moveSet.versionGroup)
        : Promise.resolve([]),
    ]);

  const mainType = pokemon.types[0]?.type.name ?? "normal";
  const style = getTypeStyle(mainType);
  const image =
    pokemon.sprites.other["official-artwork"].front_default ??
    artworkUrl(pokemon.id);

  const flavorText = species.flavor_text_entries
    .find((entry) => entry.language.name === "en")
    ?.flavor_text.replace(/[\n\f]/g, " ");
  const genus = species.genera.find(
    (entry) => entry.language.name === "en",
  )?.genus;

  const cryUrl = pokemon.cries?.latest ?? pokemon.cries?.legacy ?? null;
  const forms = species.varieties
    .filter((variety) => !variety.is_default)
    .map((variety) => {
      const formId = idFromUrl(variety.pokemon.url);
      return {
        id: formId,
        name: variety.pokemon.name,
        image: artworkUrl(formId),
      };
    });

  const weakGroups = matchups.filter((g) => g.multiplier > 1);
  const resistGroups = matchups.filter(
    (g) => g.multiplier > 0 && g.multiplier < 1,
  );
  const immuneGroups = matchups.filter((g) => g.multiplier === 0);

  const infoBox =
    "rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-neutral-800/60";
  const card =
    "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8";

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
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
            d="M10.5 19.5L3 12l7.5-7.5M3 12h18"
          />
        </svg>
        {dict.detail.back}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Sol: görsel ve kimlik */}
        <section
          className={`flex flex-col items-center rounded-3xl border bg-white p-8 shadow-sm dark:bg-neutral-900 ${style.border}`}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold tracking-wide text-slate-400 dark:text-neutral-500">
              {formatPokemonId(pokemon.id)}
            </span>
            {cryUrl && <CryButton url={cryUrl} label={dict.detail.cry} />}
          </div>

          <div className="relative my-4 h-56 w-56 sm:h-64 sm:w-64">
            <div
              className={`absolute inset-6 rounded-full opacity-50 blur-2xl ${style.glow}`}
            />
            <Image
              src={image}
              alt={pokemon.name}
              fill
              sizes="(max-width: 640px) 224px, 256px"
              priority
              className="relative object-contain drop-shadow-md"
            />
          </div>

          <h1 className="text-center text-3xl font-bold tracking-tight">
            {formatPokemonName(pokemon.name)}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400">
            {genus && <span>{genus}</span>}
            {(species.is_legendary || species.is_mythical) && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                {species.is_mythical
                  ? dict.detail.mythical
                  : dict.detail.legendary}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {pokemon.types.map(({ type }) => (
              <TypeBadge
                key={type.name}
                type={type.name}
                label={dict.typeNames[type.name] ?? formatPokemonName(type.name)}
                size="md"
              />
            ))}
          </div>

          {flavorText && (
            <p className="mt-6 text-center text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
              {flavorText}
            </p>
          )}

          <dl className="mt-6 grid w-full grid-cols-3 gap-3">
            <div className={infoBox}>
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.height}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold">
                {(pokemon.height / 10).toLocaleString(locale)} m
              </dd>
            </div>
            <div className={infoBox}>
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.weight}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold">
                {(pokemon.weight / 10).toLocaleString(locale)} kg
              </dd>
            </div>
            <div className={infoBox}>
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.generation}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold">
                {generationOf(pokemon.id)}
              </dd>
            </div>
          </dl>

          {/* Tür bilgileri */}
          <dl className="mt-3 w-full space-y-2 rounded-2xl bg-slate-50 px-4 py-3.5 text-sm dark:bg-neutral-800/60">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.captureRate}
              </dt>
              <dd className="font-medium tabular-nums">
                {species.capture_rate} / 255
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.genderRatio}
              </dt>
              <dd className="font-medium">
                <GenderRatio species={species} dict={dict} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.eggGroups}
              </dt>
              <dd className="font-medium">
                {species.egg_groups
                  .map((group) => formatPokemonName(group.name))
                  .join(", ") || "—"}
              </dd>
            </div>
            {species.habitat && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                  {dict.detail.habitat}
                </dt>
                <dd className="font-medium">
                  {formatPokemonName(species.habitat.name)}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Sağ: istatistikler, tip etkileşimleri, yetenekler */}
        <section className="flex flex-col gap-6">
          <div className={card}>
            <h2 className="text-lg font-semibold tracking-tight">
              {dict.detail.stats}
            </h2>
            <div className="mt-5 space-y-3.5">
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  label={dict.statLabels[stat.stat.name] ?? stat.stat.name}
                  value={stat.base_stat}
                  barClass={style.bar}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-neutral-800">
              <span className="font-medium text-slate-500 dark:text-neutral-400">
                {dict.detail.total}
              </span>
              <span className="font-bold tabular-nums">
                {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
              </span>
            </div>
          </div>

          <div className={card}>
            <h2 className="text-lg font-semibold tracking-tight">
              {dict.detail.matchups}
            </h2>
            <div className="mt-5 space-y-4">
              <MatchupRow
                label={dict.detail.weakTo}
                groups={weakGroups}
                dict={dict}
              />
              <MatchupRow
                label={dict.detail.resistantTo}
                groups={resistGroups}
                dict={dict}
              />
              <MatchupRow
                label={dict.detail.immuneTo}
                groups={immuneGroups}
                dict={dict}
              />
            </div>
          </div>

          <div className={`${card} flex-1`}>
            <h2 className="text-lg font-semibold tracking-tight">
              {dict.detail.abilities}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <span
                  key={ability.name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {formatPokemonName(ability.name)}
                  {is_hidden && (
                    <span className="text-xs text-slate-400 dark:text-neutral-500">
                      {dict.detail.hidden}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className={card}>
        <h2 className="text-lg font-semibold tracking-tight">
          {dict.detail.evolution}
        </h2>
        <div className="mt-5">
          <EvolutionChain stages={evolutionStages} locale={locale} dict={dict} />
        </div>
      </section>

      {forms.length > 0 && (
        <section className={card}>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.detail.forms}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {forms.map((form) => (
              <Link
                key={form.id}
                href={`/${locale}/pokemon/${form.id}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div className="relative h-20 w-20">
                  <Image
                    src={form.image}
                    alt={form.name}
                    fill
                    sizes="80px"
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <span className="mt-2 max-w-32 text-center text-sm font-semibold">
                  {formatPokemonName(form.name)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={card}>
        <h2 className="text-lg font-semibold tracking-tight">
          {dict.detail.encounters}
        </h2>
        {encounters.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-neutral-400">
            {dict.detail.encountersNone}
          </p>
        ) : (
          <div className="mt-5 max-h-72 overflow-y-auto rounded-2xl border border-slate-100 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 text-left text-xs text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-2.5 font-medium">
                    {dict.detail.encounterLocationHeader}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {dict.detail.encounterVersionsHeader}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {encounters.map((location) => (
                  <tr key={location.name}>
                    <td className="px-4 py-2 font-medium">
                      {formatPokemonName(location.name)}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500 dark:text-neutral-400">
                      {location.versions.map(formatPokemonName).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.detail.moves}
          </h2>
          {moveSet.versionGroup && (
            <span className="text-xs text-slate-400 dark:text-neutral-500">
              {formatPokemonName(moveSet.versionGroup)}{" "}
              {dict.detail.movesVersionNote}
            </span>
          )}
        </div>

        {moveSet.levelUp.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-neutral-400">
            {dict.detail.noMoves}
          </p>
        ) : (
          <>
            <div className="mt-5 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 dark:border-neutral-800">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-xs text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <tr>
                    <th className="w-24 px-4 py-2.5 font-medium">
                      {dict.detail.levelHeader}
                    </th>
                    <th className="px-4 py-2.5 font-medium">
                      {dict.detail.moveHeader}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                  {moveSet.levelUp.map((move) => (
                    <tr key={`${move.name}-${move.level}`}>
                      <td className="px-4 py-2 tabular-nums text-slate-500 dark:text-neutral-400">
                        {move.level > 0 ? move.level : "—"}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {formatPokemonName(move.name)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {machineMoves.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white">
                  {dict.detail.machineMoves} ({machineMoves.length})
                </summary>
                <div className="mt-3 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 dark:border-neutral-800">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-left text-xs text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                      <tr>
                        <th className="w-24 px-4 py-2.5 font-medium">
                          {dict.detail.machineHeader}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.detail.moveHeader}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                      {machineMoves.map((move) => (
                        <tr key={move.name}>
                          <td className="px-4 py-2 tabular-nums text-slate-500 dark:text-neutral-400">
                            {move.code ?? "—"}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {formatPokemonName(move.name)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {moveSet.egg.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white">
                  {dict.detail.eggMoves} ({moveSet.egg.length})
                </summary>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {moveSet.egg.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {formatPokemonName(name)}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </section>
    </div>
  );
}
