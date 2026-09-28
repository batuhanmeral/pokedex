import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuilderClient from "@/components/TeamBuilderClient";
import { getPokemonCardData } from "@/lib/grid-data";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { getTypeChart } from "@/lib/pokeapi";

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

  // Kart verisi ana sayfayla aynı 24 saatlik fetch cache'ini paylaşır; tipleri
  // hazır getirdiği için slotlar istemci tarafında istek atmak zorunda kalmaz.
  const [list, chart] = await Promise.all([
    getPokemonCardData(),
    getTypeChart(),
  ]);

  return (
    // useSearchParams kullanan client bileşeni Suspense sınırı ister
    <Suspense>
      <TeamBuilderClient
        list={list}
        chart={chart}
        dict={dict}
        locale={locale}
      />
    </Suspense>
  );
}
