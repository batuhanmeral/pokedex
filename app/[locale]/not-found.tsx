"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-bold text-slate-200 dark:text-neutral-800">
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold">{dict.notFound.title}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
        {dict.notFound.text}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {dict.notFound.back}
      </Link>
    </div>
  );
}
