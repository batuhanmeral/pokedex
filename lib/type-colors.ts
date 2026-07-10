interface TypeStyle {
  /** Tip etiketi (badge) renkleri */
  badge: string;
  /** Kart kenarlığı ve hover halkası */
  border: string;
  /** Kart arkasındaki yumuşak parlama (glow) */
  glow: string;
  /** İstatistik barı dolgusu */
  bar: string;
}

const DEFAULT_STYLE: TypeStyle = {
  badge: "bg-slate-100 text-slate-700 dark:bg-neutral-400/10 dark:text-neutral-300",
  border:
    "border-slate-200 hover:border-slate-300 dark:border-neutral-400/20 dark:hover:border-neutral-400/40",
  glow: "bg-slate-200 dark:bg-neutral-500/30",
  bar: "bg-slate-400",
};

/**
 * Tailwind sınıfları derleme zamanında tarandığı için
 * her tipin sınıfları tam metin olarak yazılmalıdır.
 */
const TYPE_STYLES: Record<string, TypeStyle> = {
  normal: {
    badge:
      "bg-stone-100 text-stone-700 dark:bg-stone-400/10 dark:text-stone-300",
    border:
      "border-stone-200 hover:border-stone-300 dark:border-stone-400/20 dark:hover:border-stone-400/40",
    glow: "bg-stone-200 dark:bg-stone-500/30",
    bar: "bg-stone-400",
  },
  fire: {
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300",
    border:
      "border-orange-200 hover:border-orange-300 dark:border-orange-400/20 dark:hover:border-orange-400/40",
    glow: "bg-orange-200 dark:bg-orange-500/30",
    bar: "bg-orange-400",
  },
  water: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    border:
      "border-blue-200 hover:border-blue-300 dark:border-blue-400/20 dark:hover:border-blue-400/40",
    glow: "bg-blue-200 dark:bg-blue-500/30",
    bar: "bg-blue-400",
  },
  electric: {
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300",
    border:
      "border-yellow-200 hover:border-yellow-300 dark:border-yellow-400/20 dark:hover:border-yellow-400/40",
    glow: "bg-yellow-200 dark:bg-yellow-500/30",
    bar: "bg-yellow-400",
  },
  grass: {
    badge:
      "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-300",
    border:
      "border-green-200 hover:border-green-300 dark:border-green-400/20 dark:hover:border-green-400/40",
    glow: "bg-green-200 dark:bg-green-500/30",
    bar: "bg-green-400",
  },
  ice: {
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
    border:
      "border-cyan-200 hover:border-cyan-300 dark:border-cyan-400/20 dark:hover:border-cyan-400/40",
    glow: "bg-cyan-200 dark:bg-cyan-500/30",
    bar: "bg-cyan-400",
  },
  fighting: {
    badge: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-300",
    border:
      "border-red-200 hover:border-red-300 dark:border-red-400/20 dark:hover:border-red-400/40",
    glow: "bg-red-200 dark:bg-red-500/30",
    bar: "bg-red-400",
  },
  poison: {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-400/10 dark:text-purple-300",
    border:
      "border-purple-200 hover:border-purple-300 dark:border-purple-400/20 dark:hover:border-purple-400/40",
    glow: "bg-purple-200 dark:bg-purple-500/30",
    bar: "bg-purple-400",
  },
  ground: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    border:
      "border-amber-200 hover:border-amber-300 dark:border-amber-400/20 dark:hover:border-amber-400/40",
    glow: "bg-amber-200 dark:bg-amber-500/30",
    bar: "bg-amber-400",
  },
  flying: {
    badge:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
    border:
      "border-indigo-200 hover:border-indigo-300 dark:border-indigo-400/20 dark:hover:border-indigo-400/40",
    glow: "bg-indigo-200 dark:bg-indigo-500/30",
    bar: "bg-indigo-400",
  },
  psychic: {
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-400/10 dark:text-pink-300",
    border:
      "border-pink-200 hover:border-pink-300 dark:border-pink-400/20 dark:hover:border-pink-400/40",
    glow: "bg-pink-200 dark:bg-pink-500/30",
    bar: "bg-pink-400",
  },
  bug: {
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300",
    border:
      "border-lime-200 hover:border-lime-300 dark:border-lime-400/20 dark:hover:border-lime-400/40",
    glow: "bg-lime-200 dark:bg-lime-500/30",
    bar: "bg-lime-400",
  },
  rock: {
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-200",
    border:
      "border-yellow-200 hover:border-yellow-300 dark:border-yellow-400/20 dark:hover:border-yellow-400/40",
    glow: "bg-yellow-200 dark:bg-yellow-600/30",
    bar: "bg-yellow-500",
  },
  ghost: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
    border:
      "border-violet-200 hover:border-violet-300 dark:border-violet-400/20 dark:hover:border-violet-400/40",
    glow: "bg-violet-200 dark:bg-violet-500/30",
    bar: "bg-violet-400",
  },
  dragon: {
    badge:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200",
    border:
      "border-indigo-200 hover:border-indigo-300 dark:border-indigo-400/20 dark:hover:border-indigo-400/40",
    glow: "bg-indigo-200 dark:bg-indigo-500/30",
    bar: "bg-indigo-500",
  },
  dark: {
    badge:
      "bg-neutral-200 text-neutral-800 dark:bg-neutral-400/10 dark:text-neutral-300",
    border:
      "border-neutral-300 hover:border-neutral-400 dark:border-neutral-400/20 dark:hover:border-neutral-400/40",
    glow: "bg-neutral-300 dark:bg-neutral-500/30",
    bar: "bg-neutral-500",
  },
  steel: {
    badge:
      "bg-slate-200 text-slate-700 dark:bg-neutral-400/10 dark:text-neutral-300",
    border:
      "border-slate-300 hover:border-slate-400 dark:border-neutral-400/20 dark:hover:border-neutral-400/40",
    glow: "bg-slate-300 dark:bg-neutral-500/30",
    bar: "bg-slate-500",
  },
  fairy: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
    border:
      "border-rose-200 hover:border-rose-300 dark:border-rose-400/20 dark:hover:border-rose-400/40",
    glow: "bg-rose-200 dark:bg-rose-500/30",
    bar: "bg-rose-400",
  },
};

export const ALL_TYPES = Object.keys(TYPE_STYLES);

export function getTypeStyle(type: string): TypeStyle {
  return TYPE_STYLES[type] ?? DEFAULT_STYLE;
}
