import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import type { Dictionary, Locale } from "@/lib/i18n";

function PokeballIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
      {/* Üst yarı (kırmızı) */}
      <path
        d="M12 3a9 9 0 0 1 8.94 8H15.9a4 4 0 0 0-7.8 0H3.06A9 9 0 0 1 12 3z"
        fill="#ef4444"
      />
      {/* Alt yarı (beyaz) */}
      <path
        d="M20.94 13A9 9 0 0 1 3.06 13h5.04a4 4 0 0 0 7.8 0h5.04z"
        fill="#f8fafc"
      />
      {/* Dış çember ve orta düğme */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        fill="#f8fafc"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/compare`, label: dict.nav.compare },
    { href: `/${locale}/team`, label: dict.nav.team },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 text-slate-900 dark:text-neutral-200"
        >
          <PokeballIcon />
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            Pokedex
          </span>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-white sm:px-4"
            >
              {link.label}
            </Link>
          ))}

          <span
            className="mx-1 h-5 w-px bg-slate-200 dark:bg-neutral-800"
            aria-hidden="true"
          />

          <ThemeToggle label={dict.nav.toggleTheme} />
          <LanguageToggle locale={locale} label={dict.nav.switchLanguage} />
        </div>
      </nav>
    </header>
  );
}
