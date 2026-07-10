export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: NamedApiResource[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
}

export interface PokemonType {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonStat {
  base_stat: number;
  stat: NamedApiResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  ability: NamedApiResource;
}

export interface PokemonMove {
  move: NamedApiResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedApiResource;
    version_group: NamedApiResource;
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  cries: {
    latest: string | null;
    legacy: string | null;
  };
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
  species: NamedApiResource;
}

export interface PokemonSpecies {
  id: number;
  capture_rate: number;
  base_happiness: number | null;
  /** -1: cinsiyetsiz; aksi halde dişi oranı = gender_rate / 8 */
  gender_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  habitat: NamedApiResource | null;
  egg_groups: NamedApiResource[];
  varieties: {
    is_default: boolean;
    pokemon: NamedApiResource;
  }[];
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: {
    flavor_text: string;
    language: NamedApiResource;
  }[];
  genera: {
    genus: string;
    language: NamedApiResource;
  }[];
}

export interface EvolutionDetail {
  trigger: NamedApiResource | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  item: NamedApiResource | null;
  held_item: NamedApiResource | null;
  known_move: NamedApiResource | null;
  location: NamedApiResource | null;
  time_of_day: string;
  needs_overworld_rain: boolean;
}

export interface EvolutionChainLink {
  species: NamedApiResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
  /** Bu Pokemon'a evrilme koşulu (ilk kayıt); temel form için null */
  detail: EvolutionDetail | null;
}

export interface TypeData {
  name: string;
  damage_relations: {
    double_damage_from: NamedApiResource[];
    half_damage_from: NamedApiResource[];
    no_damage_from: NamedApiResource[];
    double_damage_to: NamedApiResource[];
    half_damage_to: NamedApiResource[];
    no_damage_to: NamedApiResource[];
  };
}

/** Savunma çarpanına göre gruplanmış tipler (örn. 4x zayıflık) */
export interface MatchupGroup {
  multiplier: number;
  types: string[];
}

export interface LevelUpMove {
  name: string;
  level: number;
}

/** TM/TR ile öğrenilen hamle; code eşya adıdır (örn. "TM05", "TR23") */
export interface MachineMove {
  name: string;
  code: string | null;
}

export interface MoveSet {
  /** Hamlelerin alındığı oyun sürüm grubu (örn. "scarlet-violet") */
  versionGroup: string | null;
  levelUp: LevelUpMove[];
  machine: string[];
  egg: string[];
}

/** /move/{name} yanıtının kullanılan kısmı */
export interface MoveData {
  name: string;
  machines: {
    machine: { url: string };
    version_group: NamedApiResource;
  }[];
}

/** /machine/{id} yanıtının kullanılan kısmı */
export interface MachineData {
  id: number;
  item: NamedApiResource;
}

/** /pokemon/{id}/encounters yanıtındaki tek kayıt */
export interface PokemonEncounter {
  location_area: NamedApiResource;
  version_details: {
    version: NamedApiResource;
  }[];
}

/** İşlenmiş, konuma göre gruplanmış encounter bilgisi */
export interface EncounterLocation {
  name: string;
  versions: string[];
}
