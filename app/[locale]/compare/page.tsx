import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";
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
    title: dict.compare.metaTitle,
    description: dict.compare.metaDescription,
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const list = await getPokemonList();

  return <CompareClient list={list} dict={dict} />;
}
