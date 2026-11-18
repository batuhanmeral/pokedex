import { describe, expect, it } from "vitest";
import { chart, pokemonWithMoves, typeResponse } from "@/test/fixtures";
import { mockFetch } from "@/test/mock-fetch";
import {
  artworkUrl,
  defensiveMultipliers,
  formatPokemonId,
  formatPokemonName,
  generationOf,
  getDefensiveMatchups,
  getEncounters,
  getEvolutionStages,
  getMachineMoves,
  getMoveSet,
  getPokemon,
  getPokemonList,
  getTypeChart,
  idFromUrl,
} from "./pokeapi";
import { ALL_TYPES } from "./type-colors";

const API = "https://pokeapi.co/api/v2";

describe("idFromUrl", () => {
  it("extracts the trailing numeric id with or without a slash", () => {
    expect(idFromUrl(`${API}/pokemon-species/25/`)).toBe(25);
    expect(idFromUrl(`${API}/pokemon/10034`)).toBe(10034);
  });

  it("returns 0 when the url does not end in an id", () => {
    expect(idFromUrl(`${API}/pokemon/pikachu/`)).toBe(0);
    // İsmin sonundaki rakam ID değildir
    expect(idFromUrl(`${API}/pokemon/porygon2/`)).toBe(0);
    expect(idFromUrl("")).toBe(0);
  });
});

describe("formatting helpers", () => {
  it("pads ids to three digits and keeps longer ids intact", () => {
    expect(formatPokemonId(7)).toBe("#007");
    expect(formatPokemonId(25)).toBe("#025");
    expect(formatPokemonId(1025)).toBe("#1025");
  });

  it("title-cases each dash-separated part", () => {
    expect(formatPokemonName("pikachu")).toBe("Pikachu");
    expect(formatPokemonName("charizard-mega-x")).toBe("Charizard Mega X");
  });

  it("builds the official artwork url from the id", () => {
    expect(artworkUrl(6)).toMatch(/\/official-artwork\/6\.png$/);
  });
});

describe("generationOf", () => {
  it.each([
    [1, 1],
    [151, 1],
    [152, 2],
    [386, 3],
    [387, 4],
    [809, 7],
    [906, 9],
    [1025, 9],
  ])("id %i belongs to generation %i", (id, gen) => {
    expect(generationOf(id)).toBe(gen);
  });

  it("falls back to the last generation past the national dex", () => {
    expect(generationOf(5000)).toBe(9);
  });
});

describe("defensiveMultipliers", () => {
  it("starts every attacking type at 1x", () => {
    const m = defensiveMultipliers([], chart);
    expect(Object.keys(m)).toEqual(ALL_TYPES);
    expect(new Set(Object.values(m))).toEqual(new Set([1]));
  });

  it("combines dual types multiplicatively (fire/flying)", () => {
    const m = defensiveMultipliers(["fire", "flying"], chart);
    expect(m.rock).toBe(4);
    expect(m.water).toBe(2);
    expect(m.electric).toBe(2);
    expect(m.grass).toBe(0.25);
    expect(m.bug).toBe(0.25);
    expect(m.ground).toBe(0);
    expect(m.normal).toBe(1);
  });

  it("ignores types missing from the chart", () => {
    expect(defensiveMultipliers(["unknown"], chart).fire).toBe(1);
  });
});

describe("getMoveSet", () => {
  it("returns empty sets when there is no level-up data", () => {
    const set = getMoveSet(pokemonWithMoves({ tackle: [["machine", "sv"]] }));
    expect(set).toEqual({ versionGroup: null, levelUp: [], machine: [], egg: [] });
  });

  it("keeps the first version group seen when level-up counts tie", () => {
    const pokemon = pokemonWithMoves({
      ember: [["level-up", "xy", 7], ["level-up", "sv", 9]],
    });
    expect(getMoveSet(pokemon).versionGroup).toBe("xy");
  });

  it("picks the version group with the most level-up moves and groups by method", () => {
    const pokemon = pokemonWithMoves({
      ember: [["level-up", "sv", 7], ["level-up", "xy", 9]],
      scratch: [["level-up", "sv", 1]],
      growl: [["level-up", "sv", 1]],
      flamethrower: [["machine", "sv"], ["machine", "xy"]],
      "fire-blast": [["machine", "sv"]],
      "dragon-dance": [["egg", "sv"]],
      "air-cutter": [["tutor", "sv"]],
    });

    expect(getMoveSet(pokemon)).toEqual({
      versionGroup: "sv",
      levelUp: [
        { name: "growl", level: 1 },
        { name: "scratch", level: 1 },
        { name: "ember", level: 7 },
      ],
      machine: ["fire-blast", "flamethrower"],
      egg: ["dragon-dance"],
    });
  });
});

describe("PokeAPI requests (fetch mocked)", () => {
  it("lists only base-form pokemon, sorted by id", async () => {
    mockFetch({
      "/pokemon?limit=100000&offset=0": {
        count: 4,
        results: [
          { name: "ivysaur", url: `${API}/pokemon/2/` },
          { name: "bulbasaur", url: `${API}/pokemon/1/` },
          { name: "venusaur-mega", url: `${API}/pokemon/10033/` },
          { name: "broken", url: `${API}/pokemon/x/` },
        ],
      },
    });

    expect(await getPokemonList()).toEqual([
      { id: 1, name: "bulbasaur", image: artworkUrl(1) },
      { id: 2, name: "ivysaur", image: artworkUrl(2) },
    ]);
  });

  it("requests the API with a daily revalidate and throws on HTTP errors", async () => {
    const fetch = mockFetch({});
    await expect(getPokemon(99999)).rejects.toThrow(
      "PokeAPI request failed (404): /pokemon/99999",
    );
    expect(fetch).toHaveBeenCalledWith(`${API}/pokemon/99999`, {
      next: { revalidate: 86400 },
    });
  });

  it("flattens a branching evolution chain into stages", async () => {
    const link = (id: number, name: string, evolves_to: unknown[] = [], detail?: unknown) => ({
      species: { name, url: `${API}/pokemon-species/${id}/` },
      evolution_details: detail ? [detail] : [],
      evolves_to,
    });
    mockFetch({
      "/pokemon-species/133": { evolution_chain: { url: `${API}/evolution-chain/67/` } },
      [`${API}/evolution-chain/67/`]: {
        id: 67,
        chain: link(133, "eevee", [
          link(134, "vaporeon", [], { item: { name: "water-stone" } }),
          link(136, "flareon", [], { item: { name: "fire-stone" } }),
        ]),
      },
    });

    const stages = await getEvolutionStages(133);
    expect(stages.map((s) => s.map((p) => p.name))).toEqual([
      ["eevee"],
      ["vaporeon", "flareon"],
    ]);
    expect(stages[0][0].detail).toBeNull();
    expect(stages[1][0]).toMatchObject({
      id: 134,
      image: artworkUrl(134),
      detail: { item: { name: "water-stone" } },
    });
  });

  it("builds the type chart from all 18 /type responses", async () => {
    const fetch = mockFetch(
      Object.fromEntries(
        ALL_TYPES.map((t) => [
          `/type/${t}`,
          chart[t] ? typeResponse(t) : { ...typeResponse("normal"), name: t },
        ]),
      ),
    );

    const result = await getTypeChart();
    expect(fetch).toHaveBeenCalledTimes(18);
    expect(Object.keys(result)).toEqual(ALL_TYPES);
    expect(result.fire).toEqual(chart.fire);
  });

  it("groups defensive matchups by multiplier, highest first, without 1x", async () => {
    const fetch = mockFetch({
      "/type/fire": typeResponse("fire"),
      "/type/flying": typeResponse("flying"),
    });

    const groups = await getDefensiveMatchups(["fire", "flying"]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(groups.map((g) => g.multiplier)).toEqual([4, 2, 0.5, 0.25, 0]);
    expect(groups[0]).toEqual({ multiplier: 4, types: ["rock"] });
    expect(groups.at(-1)).toEqual({ multiplier: 0, types: ["ground"] });
    expect(groups.flatMap((g) => g.types)).not.toContain("normal");
  });

  it("resolves TM codes, sorting known codes first and tolerating failures", async () => {
    const move = (vg: string, url: string) => ({
      machines: [{ machine: { url }, version_group: { name: vg, url: "" } }],
    });
    mockFetch({
      "/move/flamethrower": move("sv", `${API}/machine/1/`),
      "/move/protect": move("sv", `${API}/machine/2/`),
      "/move/old-move": move("xy", `${API}/machine/3/`),
      [`${API}/machine/1/`]: { id: 1, item: { name: "tm125" } },
      [`${API}/machine/2/`]: { id: 2, item: { name: "tm007" } },
      // "/move/missing" yok → 404 → kod null
    });

    expect(
      await getMachineMoves(["old-move", "flamethrower", "missing", "protect"], "sv"),
    ).toEqual([
      { name: "protect", code: "TM007" },
      { name: "flamethrower", code: "TM125" },
      { name: "missing", code: null },
      { name: "old-move", code: null },
    ]);
  });

  it("merges encounter versions per location, sorted by name", async () => {
    const version = (name: string) => ({ version: { name, url: "" } });
    mockFetch({
      "/pokemon/25/encounters": [
        { location_area: { name: "viridian-forest", url: "" }, version_details: [version("red")] },
        { location_area: { name: "power-plant", url: "" }, version_details: [version("red")] },
        {
          location_area: { name: "viridian-forest", url: "" },
          version_details: [version("blue"), version("red")],
        },
      ],
    });

    expect(await getEncounters(25)).toEqual([
      { name: "power-plant", versions: ["red"] },
      { name: "viridian-forest", versions: ["red", "blue"] },
    ]);
  });

  it("returns no encounters when the request fails", async () => {
    mockFetch({});
    expect(await getEncounters(1)).toEqual([]);
  });
});
