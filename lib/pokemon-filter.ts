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

export const MAX_SUGGESTIONS = 8;

/**
 * Karşılaştırma ve takım kurucu combobox'larının öneri filtresi: hariç tutulan
 * ID'leri çıkarır, isim parçası ya da tam numaraya göre eşleştirir ve en fazla
 * `limit` kayıt döndürür.
 */
export function filterSuggestions<T extends { id: number; name: string }>(
  list: T[],
  query: string,
  excludedIds: readonly number[] = [],
  limit = MAX_SUGGESTIONS,
): T[] {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  const available =
    excludedIds.length > 0
      ? list.filter((pokemon) => !excludedIds.includes(pokemon.id))
      : list;

  if (!q) return available.slice(0, limit);

  return available
    .filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(q) || String(pokemon.id) === q,
    )
    .slice(0, limit);
}
