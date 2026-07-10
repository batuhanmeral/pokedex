import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuilderClient from "@/components/TeamBuilderClient";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { getPokemonList } from "@/lib/pokeapi";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict.team.metaTitle,
    description: dict.team.metaDescription,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const list = await getPokemonList();

  return (
    // useSearchParams kullanan client bileşeni Suspense sınırı ister
    <Suspense>
      <TeamBuilderClient list={list} dict={dict} locale={locale} />
    </Suspense>
  );
}
