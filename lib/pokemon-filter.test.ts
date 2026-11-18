import { describe, expect, it } from "vitest";
import type { PokemonCardData } from "./grid-data";
import { filterPokemon, filterSuggestions, MAX_SUGGESTIONS } from "./pokemon-filter";

const list: PokemonCardData[] = [
  { id: 1, name: "bulbasaur", types: ["grass", "poison"], generation: 1 },
  { id: 6, name: "charizard", types: ["fire", "flying"], generation: 1 },
  { id: 25, name: "pikachu", types: ["electric"], generation: 1 },
  { id: 155, name: "cyndaquil", types: ["fire"], generation: 2 },
  { id: 250, name: "ho-oh", types: ["fire", "flying"], generation: 2 },
];

const names = (result: { name: string }[]) => result.map((p) => p.name);
const none = { query: "", type: null, generation: null };

describe("filterPokemon", () => {
  it("returns everything when no filter is set", () => {
    expect(filterPokemon(list, none)).toEqual(list);
  });

  it("matches name substrings case-insensitively, ignoring surrounding spaces", () => {
    expect(names(filterPokemon(list, { ...none, query: "  CHAR " }))).toEqual(["charizard"]);
    expect(names(filterPokemon(list, { ...none, query: "a" }))).toEqual([
      "bulbasaur",
      "charizard",
      "pikachu",
      "cyndaquil",
    ]);
  });

  it("matches an exact pokedex number, with or without #", () => {
    expect(names(filterPokemon(list, { ...none, query: "25" }))).toEqual(["pikachu"]);
    expect(names(filterPokemon(list, { ...none, query: "#155" }))).toEqual(["cyndaquil"]);
    // "15" 155'in parçası ama numara eşleşmesi tam olmalı
    expect(filterPokemon(list, { ...none, query: "15" })).toEqual([]);
  });

  it("filters by type and generation together with the query", () => {
    expect(names(filterPokemon(list, { ...none, type: "fire" }))).toEqual([
      "charizard",
      "cyndaquil",
      "ho-oh",
    ]);
    expect(names(filterPokemon(list, { ...none, type: "fire", generation: 2 }))).toEqual([
      "cyndaquil",
      "ho-oh",
    ]);
    expect(
      names(filterPokemon(list, { query: "ho", type: "flying", generation: 2 })),
    ).toEqual(["ho-oh"]);
  });
});

describe("filterSuggestions", () => {
  const many = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `mon-${i + 1}`,
  }));

  it("returns the first MAX_SUGGESTIONS items when the query is blank", () => {
    expect(filterSuggestions(many, "   ")).toEqual(many.slice(0, MAX_SUGGESTIONS));
  });

  it("matches by name substring or exact id (with optional #) and caps results", () => {
    expect(names(filterSuggestions(list, "  #25 "))).toEqual(["pikachu"]);
    expect(names(filterSuggestions(list, "a", [], 2))).toEqual(["bulbasaur", "charizard"]);
  });

  it("excludes already selected ids before slicing or matching", () => {
    expect(names(filterSuggestions(list, "", [1, 25]))).toEqual([
      "charizard",
      "cyndaquil",
      "ho-oh",
    ]);
    expect(names(filterSuggestions(list, "25", [25]))).toEqual([]);
  });
});
