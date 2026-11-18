import { describe, expect, it } from "vitest";
import { defaultLocale, getDictionary, isLocale, locales, type Locale } from "./i18n";
import { ALL_TYPES } from "./type-colors";

const STAT_NAMES = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

describe("isLocale", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("tr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale("TR")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("getDictionary", () => {
  it("returns a different dictionary per locale", () => {
    expect(getDictionary("tr").nav.compare).toBe("Karşılaştır");
    expect(getDictionary("en").nav.compare).toBe("Compare");
  });

  it("falls back to the default locale for an unknown value", () => {
    expect(getDictionary("xx" as Locale)).toBe(getDictionary(defaultLocale));
  });

  // statLabels/typeNames Record<string,string> tipinde; eksik anahtarı TS yakalamaz
  it.each(locales)("%s names every type and stat", (locale) => {
    const dict = getDictionary(locale);
    for (const type of ALL_TYPES) expect(dict.typeNames[type], type).toBeTruthy();
    for (const stat of STAT_NAMES) expect(dict.statLabels[stat], stat).toBeTruthy();
  });
});
