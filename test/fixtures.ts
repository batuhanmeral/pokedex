import type { Pokemon, TypeChart, TypeData } from "@/lib/types";

/** Gerçek tip tablosunun testlerde kullanılan küçük, sahte bir alt kümesi. */
export const chart: TypeChart = {
  fire: {
    doubleFrom: ["water", "ground", "rock"],
    halfFrom: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    noFrom: [],
    doubleTo: ["grass", "ice", "bug", "steel"],
  },
  flying: {
    doubleFrom: ["electric", "ice", "rock"],
    halfFrom: ["grass", "fighting", "bug"],
    noFrom: ["ground"],
    doubleTo: ["grass", "fighting", "bug"],
  },
  water: {
    doubleFrom: ["electric", "grass"],
    halfFrom: ["fire", "water", "ice", "steel"],
    noFrom: [],
    doubleTo: ["fire", "ground", "rock"],
  },
  normal: {
    doubleFrom: ["fighting"],
    halfFrom: [],
    noFrom: ["ghost"],
    doubleTo: [],
  },
};

const named = (name: string) => ({ name, url: `https://x/${name}/` });

/** TypeChart girdisini PokeAPI /type yanıtı biçimine çevirir. */
export function typeResponse(type: string): TypeData {
  const r = chart[type];
  return {
    name: type,
    damage_relations: {
      double_damage_from: r.doubleFrom.map(named),
      half_damage_from: r.halfFrom.map(named),
      no_damage_from: r.noFrom.map(named),
      double_damage_to: r.doubleTo.map(named),
      half_damage_to: [],
      no_damage_to: [],
    },
  };
}

type MoveDetail = [method: string, versionGroup: string, level?: number];

/** Yalnızca hamle listesi anlamlı olan sahte bir Pokemon. */
export function pokemonWithMoves(moves: Record<string, MoveDetail[]>): Pokemon {
  return {
    id: 1,
    name: "testmon",
    height: 1,
    weight: 1,
    types: [],
    stats: [],
    abilities: [],
    cries: { latest: null, legacy: null },
    sprites: { front_default: null, other: { "official-artwork": { front_default: null } } },
    species: named("testmon"),
    moves: Object.entries(moves).map(([name, details]) => ({
      move: named(name),
      version_group_details: details.map(([method, vg, level = 0]) => ({
        level_learned_at: level,
        move_learn_method: named(method),
        version_group: named(vg),
      })),
    })),
  };
}
