import type { PokemonCardData } from "./grid-data";

export interface PokemonFilter {
  /** İsim parçası ya da Pokedex numarası; baştaki "#" yok sayılır */
  query: string;
  type: string | null;
  generation: number | null;
}

/** Ana sayfa grid'inin arama + tip + nesil filtresi. */
export function filterPokemon(
  list: PokemonCardData[],
  { query, type, generation }: PokemonFilter,
): PokemonCardData[] {
  const q = query.trim().toLowerCase().replace(/^#/, "");

  return list.filter((pokemon) => {
    if (q && !pokemon.name.toLowerCase().includes(q) && String(pokemon.id) !== q)
      return false;
    if (type && !pokemon.types.includes(type)) return false;
    if (generation && pokemon.generation !== generation) return false;
    return true;
  });
}
