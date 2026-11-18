"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath, type Locale } from "@/lib/i18n";

export default function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const { target, href } = switchLocalePath(pathname, locale);

  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000`;
      }}
      className="flex h-9 items-center justify-center rounded-full px-3 text-xs font-bold tracking-wide text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-white"
    >
      {target.toUpperCase()}
    </Link>
  );
}
