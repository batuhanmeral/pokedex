import { ALL_TYPES } from "./type-colors";
import type {
  EncounterLocation,
  EvolutionChain,
  EvolutionChainLink,
  EvolutionStage,
  MachineData,
  MachineMove,
  MatchupGroup,
  MoveData,
  MoveSet,
  Pokemon,
  PokemonEncounter,
  PokemonListItem,
  PokemonListResponse,
  PokemonSpecies,
  TypeData,
} from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";

const ARTWORK_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// PokeAPI verisi neredeyse hiç değişmez; günde bir yenilemek fazlasıyla yeterli.
const REVALIDATE_SECONDS = 86400;

/**
 * Ulusal Pokedex'teki tür sayısı (9. nesil sonu). Rastgele Pokemon butonu
 * gibi listeyi beklemeden çalışması gereken yerlerde kullanılır.
 */
export const NATIONAL_DEX_COUNT = 1025;

/** ID'si bunun üzerinde olanlar alternatif formlardır (mega, alolan vb.) */
const VARIANT_FORM_THRESHOLD = 10000;

/** Nesil sınırları: [son ID, nesil numarası] */
const GENERATION_BOUNDS: [number, number][] = [
  [151, 1],
  [251, 2],
  [386, 3],
  [493, 4],
  [649, 5],
  [721, 6],
  [809, 7],
  [905, 8],
  [1025, 9],
];

export const GENERATIONS = GENERATION_BOUNDS.map(([, gen]) => gen);

export function generationOf(id: number): number {
  for (const [maxId, gen] of GENERATION_BOUNDS) {
    if (id <= maxId) return gen;
  }
  return GENERATION_BOUNDS[GENERATION_BOUNDS.length - 1][1];
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`PokeAPI request failed (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}

/** "https://pokeapi.co/api/v2/pokemon-species/25/" -> 25 */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function artworkUrl(id: number): string {
  return `${ARTWORK_URL}/${id}.png`;
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Alternatif formlar hariç tüm Pokemonları ID sırasıyla döndürür. */
export async function getPokemonList(): Promise<PokemonListItem[]> {
  const data = await fetchApi<PokemonListResponse>(
    `/pokemon?limit=100000&offset=0`,
  );

  return data.results
    .map((entry) => {
      const id = idFromUrl(entry.url);
      return { id, name: entry.name, image: artworkUrl(id) };
    })
    .filter((entry) => entry.id > 0 && entry.id < VARIANT_FORM_THRESHOLD)
    .sort((a, b) => a.id - b.id);
}

export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  return fetchApi<Pokemon>(`/pokemon/${idOrName}`);
}

export async function getPokemonSpecies(
  idOrName: string | number,
): Promise<PokemonSpecies> {
  return fetchApi<PokemonSpecies>(`/pokemon-species/${idOrName}`);
}

async function fetchUrl<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

  if (!res.ok) {
    throw new Error(`PokeAPI request failed (${res.status}): ${url}`);
  }

  return res.json() as Promise<T>;
}

async function getEvolutionChain(url: string): Promise<EvolutionChain> {
  return fetchUrl<EvolutionChain>(url);
}

/**
 * Evrim zincirini aşamalara ayırır. Dallanan zincirlerde (örn. Eevee)
 * aynı aşamadaki tüm Pokemonlar tek grupta toplanır.
 */
export async function getEvolutionStages(
  speciesIdOrName: string | number,
): Promise<EvolutionStage[][]> {
  const species = await getPokemonSpecies(speciesIdOrName);
  const chain = await getEvolutionChain(species.evolution_chain.url);

  const stages: EvolutionStage[][] = [];
  let current: EvolutionChainLink[] = [chain.chain];

  while (current.length > 0) {
    stages.push(
      current.map((link) => {
        const id = idFromUrl(link.species.url);
        return {
          id,
          name: link.species.name,
          image: artworkUrl(id),
          detail: link.evolution_details[0] ?? null,
        };
      }),
    );
    current = current.flatMap((link) => link.evolves_to);
  }

  return stages;
}

/**
 * Pokemon'un tiplerine göre savunma çarpanlarını hesaplar.
 * Çift tipte çarpanlar birleşir (örn. 2 × 2 = 4x zayıflık).
 * 1x (nötr) tipler sonuca dahil edilmez; gruplar çarpana göre azalan sıralıdır.
 */
export async function getDefensiveMatchups(
  types: string[],
): Promise<MatchupGroup[]> {
  const typeData = await Promise.all(
    types.map((type) => fetchApi<TypeData>(`/type/${type}`)),
  );

  const multipliers: Record<string, number> = {};
  for (const type of ALL_TYPES) multipliers[type] = 1;

  for (const data of typeData) {
    for (const t of data.damage_relations.double_damage_from)
      multipliers[t.name] *= 2;
    for (const t of data.damage_relations.half_damage_from)
      multipliers[t.name] *= 0.5;
    for (const t of data.damage_relations.no_damage_from)
      multipliers[t.name] *= 0;
  }

  const groups = new Map<number, string[]>();
  for (const [type, multiplier] of Object.entries(multipliers)) {
    if (multiplier === 1) continue;
    const group = groups.get(multiplier) ?? [];
    group.push(type);
    groups.set(multiplier, group);
  }

  return [...groups.entries()]
    .map(([multiplier, groupTypes]) => ({ multiplier, types: groupTypes }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Hamle listesinden tek bir sürüm grubu seçer (en çok seviye hamlesi olan)
 * ve o gruptaki seviye + TM/TR hamlelerini döndürür. Hamle başına ek istek
 * gerektirmez.
 */
export function getMoveSet(pokemon: Pokemon): MoveSet {
  const levelUpCounts = new Map<string, number>();

  for (const move of pokemon.moves) {
    for (const detail of move.version_group_details) {
      if (detail.move_learn_method.name !== "level-up") continue;
      const vg = detail.version_group.name;
      levelUpCounts.set(vg, (levelUpCounts.get(vg) ?? 0) + 1);
    }
  }

  let versionGroup: string | null = null;
  let best = 0;
  for (const [vg, count] of levelUpCounts) {
    if (count > best) {
      best = count;
      versionGroup = vg;
    }
  }

  if (!versionGroup)
    return { versionGroup: null, levelUp: [], machine: [], egg: [] };

  const levelUp: { name: string; level: number }[] = [];
  const machine: string[] = [];
  const egg: string[] = [];

  for (const move of pokemon.moves) {
    for (const detail of move.version_group_details) {
      if (detail.version_group.name !== versionGroup) continue;
      if (detail.move_learn_method.name === "level-up") {
        levelUp.push({
          name: move.move.name,
          level: detail.level_learned_at,
        });
      } else if (detail.move_learn_method.name === "machine") {
        machine.push(move.move.name);
      } else if (detail.move_learn_method.name === "egg") {
        egg.push(move.move.name);
      }
    }
  }

  levelUp.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  machine.sort();
  egg.sort();

  return { versionGroup, levelUp, machine, egg };
}

/**
 * TM/TR hamlelerinin eşya kodlarını (TM05, TR23 vb.) çözer. Hamle başına
 * move + machine olmak üzere iki istek gerekir; hepsi paralel atılır ve
 * günlük önbelleğe girer. Kod bulunamazsa null bırakılır.
 */
export async function getMachineMoves(
  moveNames: string[],
  versionGroup: string,
): Promise<MachineMove[]> {
  const moves = await Promise.all(
    moveNames.map(async (name): Promise<MachineMove> => {
      try {
        const move = await fetchApi<MoveData>(`/move/${name}`);
        const entry = move.machines.find(
          (m) => m.version_group.name === versionGroup,
        );
        if (!entry) return { name, code: null };

        const machine = await fetchUrl<MachineData>(entry.machine.url);
        return { name, code: machine.item.name.toUpperCase() };
      } catch {
        return { name, code: null };
      }
    }),
  );

  // TM'ler numara sırasıyla önce, kodu bilinmeyenler en sonda
  return moves.sort((a, b) => {
    if (a.code && b.code) return a.code.localeCompare(b.code, "en");
    if (a.code) return -1;
    if (b.code) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Pokemon'un vahşi doğada bulunduğu konumları döndürür. Aynı konum birden
 * fazla oyunda geçiyorsa sürümler tek kayıtta birleştirilir.
 */
export async function getEncounters(id: number): Promise<EncounterLocation[]> {
  try {
    const encounters = await fetchApi<PokemonEncounter[]>(
      `/pokemon/${id}/encounters`,
    );

    const byLocation = new Map<string, Set<string>>();
    for (const encounter of encounters) {
      const name = encounter.location_area.name;
      const versions = byLocation.get(name) ?? new Set<string>();
      for (const detail of encounter.version_details) {
        versions.add(detail.version.name);
      }
      byLocation.set(name, versions);
    }

    return [...byLocation.entries()]
      .map(([name, versions]) => ({ name, versions: [...versions] }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
