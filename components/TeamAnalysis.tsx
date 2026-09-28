import TypeBadge from "./TypeBadge";
import type { Dictionary } from "@/lib/i18n";
import { formatPokemonName } from "@/lib/pokeapi";
import type { DefensiveRow, TeamAnalysis } from "@/lib/team-analysis";

const countChip =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums";

function TypeChips({
  types,
  dict,
}: {
  types: string[];
  dict: Dictionary;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => (
        <TypeBadge
          key={type}
          type={type}
          label={dict.typeNames[type] ?? formatPokemonName(type)}
        />
      ))}
    </div>
  );
}

/** Başlık + açıklama + ya tip listesi ya da "sorun yok" mesajı */
function Finding({
  title,
  hint,
  types,
  emptyText,
  dict,
  tone = "neutral",
}: {
  title: string;
  hint: string;
  types: string[];
  emptyText: string;
  dict: Dictionary;
  tone?: "neutral" | "danger";
}) {
  const dangerous = tone === "danger" && types.length > 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        dangerous
          ? "border-red-200 bg-red-50/60 dark:border-red-500/25 dark:bg-red-500/5"
          : "border-slate-200 bg-slate-50/60 dark:border-neutral-800 dark:bg-neutral-800/30"
      }`}
    >
      <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
        {hint}
      </p>
      <div className="mt-3">
        {types.length === 0 ? (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {emptyText}
          </p>
        ) : (
          <TypeChips types={types} dict={dict} />
        )}
      </div>
    </div>
  );
}

function DefensiveCell({
  row,
  isCommonWeakness,
  dict,
}: {
  row: DefensiveRow;
  isCommonWeakness: boolean;
  dict: Dictionary;
}) {
  const quiet = row.weak === 0 && row.resist === 0 && row.immune === 0;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${
        isCommonWeakness
          ? "bg-red-50 dark:bg-red-500/10"
          : "bg-slate-50/70 dark:bg-neutral-800/30"
      }`}
    >
      <TypeBadge
        type={row.type}
        label={dict.typeNames[row.type] ?? formatPokemonName(row.type)}
      />

      {quiet ? (
        <span className="text-[11px] text-slate-400 dark:text-neutral-500">
          {dict.team.analysis.neutral}
        </span>
      ) : (
        <div className="flex shrink-0 items-center gap-1.5">
          {row.weak > 0 && (
            <span
              className={`${countChip} bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300`}
            >
              {row.weak} {dict.team.analysis.weak}
            </span>
          )}
          {row.resist > 0 && (
            <span
              className={`${countChip} bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300`}
            >
              {row.resist} {dict.team.analysis.resist}
            </span>
          )}
          {row.immune > 0 && (
            <span
              className={`${countChip} bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300`}
            >
              {row.immune} {dict.team.analysis.immune}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamAnalysisPanel({
  analysis,
  dict,
}: {
  analysis: TeamAnalysis;
  dict: Dictionary;
}) {
  const t = dict.team.analysis;
  const commonWeaknesses = new Set(analysis.commonWeaknesses);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight">{t.title}</h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Finding
          title={t.commonWeaknesses}
          hint={t.commonWeaknessesHint}
          types={analysis.commonWeaknesses}
          emptyText={t.commonWeaknessesNone}
          dict={dict}
          tone="danger"
        />
        <Finding
          title={t.uncovered}
          hint={t.uncoveredHint}
          types={analysis.uncovered}
          emptyText={t.uncoveredNone}
          dict={dict}
        />
        <Finding
          title={t.noOffense}
          hint={t.offenseHint}
          types={analysis.noOffenseAgainst}
          emptyText={t.noOffenseNone}
          dict={dict}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold tracking-tight">{t.defensive}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
          {t.defensiveHint}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {analysis.rows.map((row) => (
            <DefensiveCell
              key={row.type}
              row={row}
              isCommonWeakness={commonWeaknesses.has(row.type)}
              dict={dict}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
