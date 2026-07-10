import { generationOf, getPokemon, getPokemonList } from "./pokeapi";

export interface PokemonCardData {
  id: number;
  name: string;
  types: string[];
  generation: number;
}

const BATCH_SIZE = 50;

/**
 * Grid kartları tipe göre renklendirilip filtrelendiği için her Pokemon'un
 * detayını çeker. PokeAPI'yi boğmamak için istekler 50'lik gruplar halinde
 * yapılır; tamamı Next fetch cache'inde 24 saat tutulur, yalnızca ilk
 * istek/prerender yavaştır.
 */
export async function getPokemonCardData(): Promise<PokemonCardData[]> {
  const list = await getPokemonList();

  const detailed: PokemonCardData[] = [];
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (item) => {
        const pokemon = await getPokemon(item.id);
        return {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((t) => t.type.name),
          generation: generationOf(pokemon.id),
        };
      }),
    );
    detailed.push(...results);
  }

  return detailed.sort((a, b) => a.id - b.id);
}
