import PokemonGrid from "@/components/PokemonGrid";
import { getPokemonCardData } from "@/lib/grid-data";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const list = await getPokemonCardData();

  return <PokemonGrid list={list} locale={locale} dict={dict} />;
}
