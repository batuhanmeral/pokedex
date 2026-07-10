"use client";

import { useRouter } from "next/navigation";
import { NATIONAL_DEX_COUNT } from "@/lib/pokeapi";
import type { Locale } from "@/lib/i18n";

export default function RandomButton({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();

  const goRandom = () => {
    const id = 1 + Math.floor(Math.random() * NATIONAL_DEX_COUNT);
    router.push(`/${locale}/pokemon/${id}`);
  };

  return (
    <button
      type="button"
      onClick={goRandom}
      className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 sm:w-auto"
    >
      {/* Zar ikonu */}
      <svg
        className="h-4.5 w-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
        <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
      {label}
    </button>
  );
}
