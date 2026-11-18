export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const tr = {
  nav: {
    home: "Pokedex",
    compare: "Karşılaştır",
    team: "Takımım",
    toggleTheme: "Temayı değiştir",
    switchLanguage: "Switch to English",
  },
  home: {
    random: "Rastgele Pokemon",
    searchPlaceholder: "İsim veya numara ile ara (örn: pikachu, 25)",
    searchAria: "Pokemon ara",
    noResults: "Eşleşen Pokemon bulunamadı.",
    loadMore: "Daha fazla yükle",
    showing: "Pokemon gösteriliyor",
    allTypes: "Tüm tipler",
    allGenerations: "Tüm nesiller",
    generation: "Nesil",
    typeFilterAria: "Tipe göre filtrele",
    generationFilterAria: "Nesle göre filtrele",
  },
  detail: {
    back: "Tüm Pokemonlar",
    stats: "İstatistikler",
    total: "Toplam",
    abilities: "Yetenekler",
    hidden: "(gizli)",
    evolution: "Evrim Zinciri",
    noEvolution: "Bu Pokemon'un evrimi yoktur.",
    height: "Boy",
    weight: "Kilo",
    generation: "Nesil",
    cry: "Çığlığını dinle",
    legendary: "Efsanevi",
    mythical: "Mitik",
    speciesInfo: "Tür Bilgileri",
    captureRate: "Yakalama oranı",
    genderRatio: "Cinsiyet",
    genderless: "Cinsiyetsiz",
    eggGroups: "Yumurta grupları",
    habitat: "Habitat",
    matchups: "Tip Etkileşimleri",
    weakTo: "Zayıf olduğu",
    resistantTo: "Dirençli olduğu",
    immuneTo: "Etkilenmediği",
    moves: "Hamleler",
    movesVersionNote: "sürümü baz alınmıştır",
    levelHeader: "Seviye",
    moveHeader: "Hamle",
    machineHeader: "Eşya",
    machineMoves: "TM/TR ile öğrenilenler",
    eggMoves: "Yumurta ile öğrenilenler",
    noMoves: "Hamle verisi bulunamadı.",
    encounters: "Bulunduğu Konumlar",
    encountersNone:
      "Bu Pokemon vahşi doğada bulunmaz; evrim, takas veya özel etkinlik gerektirir.",
    encounterLocationHeader: "Konum",
    encounterVersionsHeader: "Oyunlar",
    forms: "Alternatif Formlar",
    evoLevelPrefix: "Sv.",
    evoTrade: "Takas",
    evoHappiness: "Mutluluk",
    evoDay: "Gündüz",
    evoNight: "Gece",
    evoSpecial: "Özel koşul",
  },
  compare: {
    first: "1. Pokemon",
    second: "2. Pokemon",
    selectPlaceholder: "Pokemon ara ve seç…",
    noResults: "Eşleşen Pokemon bulunamadı.",
    notSelected: "Henüz seçilmedi",
    comparison: "İstatistik Karşılaştırması",
    total: "Toplam",
    metaTitle: "Karşılaştır",
    metaDescription: "İki Pokemon'un istatistiklerini yan yana karşılaştırın.",
  },
  team: {
    selectPlaceholder: "Pokemon ara ve takıma ekle…",
    noResults: "Eşleşen Pokemon bulunamadı.",
    emptySlot: "Boş slot",
    remove: "Takımdan çıkar",
    share: "Takımı paylaş",
    copied: "Bağlantı kopyalandı!",
    clear: "Takımı temizle",
    slotLabel: "Slot",
    metaTitle: "Takımını Oluştur",
    metaDescription:
      "6 Pokemonluk hayalindeki takımı kur ve tek bağlantıyla paylaş.",
    analysis: {
      title: "Takım Analizi",
      defensive: "Savunma kapsaması",
      defensiveHint:
        "Saldıran her tipe karşı kaç takım üyesinin zayıf ya da dirençli olduğu.",
      weak: "zayıf",
      resist: "dirençli",
      immune: "bağışık",
      neutral: "Tüm üyeler nötr",
      commonWeaknesses: "Ortak zayıflıklar",
      commonWeaknessesHint:
        "En az iki üyenin zayıf olduğu ve hiçbir üyenin karşılamadığı tipler. Bu takımın en büyük riski.",
      commonWeaknessesNone:
        "Ortak zayıflık yok — hiçbir tip takımı aynı anda hem vurup hem karşılıksız kalmıyor.",
      uncovered: "Dirençsiz tipler",
      uncoveredHint: "Hiçbir üyenin direnç ya da bağışıklık göstermediği tipler.",
      uncoveredNone: "Her tipe karşı en az bir dirençli üye var.",
      offenseHint:
        "Üyelerin tiplerine göre süper etkili vurulabilen tipler (hamleler değil, tipler baz alınır).",
      noOffense: "Süper etkili vurulamayan tipler",
      noOffenseNone: "Takım her tipe süper etkili vurabiliyor.",
    },
  },
  notFound: {
    title: "Pokemon bulunamadı",
    text: "Aradığınız sayfa mevcut değil ya da bu Pokemon henüz keşfedilmedi.",
    back: "Ana sayfaya dön",
  },
  meta: {
    description:
      "PokeAPI ile hazırlanmış modern, minimalist bir Pokedex. Pokemonları keşfedin, istatistiklerini inceleyin ve karşılaştırın.",
    pokemonNotFound: "Pokemon bulunamadı",
  },
  statLabels: {
    hp: "HP",
    attack: "Saldırı",
    defense: "Savunma",
    "special-attack": "Öz. Saldırı",
    "special-defense": "Öz. Savunma",
    speed: "Hız",
  } as Record<string, string>,
  typeNames: {
    normal: "Normal",
    fire: "Ateş",
    water: "Su",
    electric: "Elektrik",
    grass: "Çimen",
    ice: "Buz",
    fighting: "Dövüş",
    poison: "Zehir",
    ground: "Toprak",
    flying: "Uçan",
    psychic: "Psişik",
    bug: "Böcek",
    rock: "Kaya",
    ghost: "Hayalet",
    dragon: "Ejderha",
    dark: "Karanlık",
    steel: "Çelik",
    fairy: "Peri",
  } as Record<string, string>,
};

export type Dictionary = typeof tr;

const en: Dictionary = {
  nav: {
    home: "Pokedex",
    compare: "Compare",
    team: "My Team",
    toggleTheme: "Toggle theme",
    switchLanguage: "Türkçe'ye geç",
  },
  home: {
    random: "Random Pokemon",
    searchPlaceholder: "Search by name or number (e.g. pikachu, 25)",
    searchAria: "Search Pokemon",
    noResults: "No Pokemon match your search.",
    loadMore: "Load more",
    showing: "Pokemon shown",
    allTypes: "All types",
    allGenerations: "All generations",
    generation: "Gen",
    typeFilterAria: "Filter by type",
    generationFilterAria: "Filter by generation",
  },
  detail: {
    back: "All Pokemon",
    stats: "Base Stats",
    total: "Total",
    abilities: "Abilities",
    hidden: "(hidden)",
    evolution: "Evolution Chain",
    noEvolution: "This Pokemon does not evolve.",
    height: "Height",
    weight: "Weight",
    generation: "Generation",
    cry: "Play cry",
    legendary: "Legendary",
    mythical: "Mythical",
    speciesInfo: "Species Info",
    captureRate: "Capture rate",
    genderRatio: "Gender",
    genderless: "Genderless",
    eggGroups: "Egg groups",
    habitat: "Habitat",
    matchups: "Type Matchups",
    weakTo: "Weak to",
    resistantTo: "Resists",
    immuneTo: "Immune to",
    moves: "Moves",
    movesVersionNote: "moveset shown",
    levelHeader: "Level",
    moveHeader: "Move",
    machineHeader: "Item",
    machineMoves: "Learned by TM/TR",
    eggMoves: "Egg moves",
    noMoves: "No move data available.",
    encounters: "Encounter Locations",
    encountersNone:
      "This Pokemon can't be found in the wild; it requires evolution, trading or a special event.",
    encounterLocationHeader: "Location",
    encounterVersionsHeader: "Games",
    forms: "Alternate Forms",
    evoLevelPrefix: "Lv.",
    evoTrade: "Trade",
    evoHappiness: "Happiness",
    evoDay: "Day",
    evoNight: "Night",
    evoSpecial: "Special condition",
  },
  compare: {
    first: "1st Pokemon",
    second: "2nd Pokemon",
    selectPlaceholder: "Search and pick a Pokemon…",
    noResults: "No Pokemon match your search.",
    notSelected: "Not selected yet",
    comparison: "Stat Comparison",
    total: "Total",
    metaTitle: "Compare",
    metaDescription: "Compare the stats of two Pokemon side by side.",
  },
  team: {
    selectPlaceholder: "Search and add a Pokemon…",
    noResults: "No Pokemon match your search.",
    emptySlot: "Empty slot",
    remove: "Remove from team",
    share: "Share team",
    copied: "Link copied!",
    clear: "Clear team",
    slotLabel: "Slot",
    metaTitle: "Build Your Team",
    metaDescription:
      "Build your dream team of 6 Pokemon and share it with a single link.",
    analysis: {
      title: "Team Analysis",
      defensive: "Defensive coverage",
      defensiveHint:
        "How many team members are weak to or resist each attacking type.",
      weak: "weak",
      resist: "resist",
      immune: "immune",
      neutral: "All members neutral",
      commonWeaknesses: "Shared weaknesses",
      commonWeaknessesHint:
        "Types at least two members are weak to and no member resists. This is the team's biggest risk.",
      commonWeaknessesNone:
        "No shared weaknesses — no type hits several members without something resisting it.",
      uncovered: "Unresisted types",
      uncoveredHint: "Types no member resists or is immune to.",
      uncoveredNone: "Every type is resisted by at least one member.",
      offenseHint:
        "Types the team can hit super effectively, based on member types rather than their movesets.",
      noOffense: "Types hit for no extra damage",
      noOffenseNone: "The team can hit every type super effectively.",
    },
  },
  notFound: {
    title: "Pokemon not found",
    text: "The page you are looking for does not exist, or this Pokemon has not been discovered yet.",
    back: "Back to home",
  },
  meta: {
    description:
      "A modern, minimalist Pokedex powered by PokeAPI. Explore Pokemon, inspect their stats, and compare them.",
    pokemonNotFound: "Pokemon not found",
  },
  statLabels: {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  },
  typeNames: {
    normal: "Normal",
    fire: "Fire",
    water: "Water",
    electric: "Electric",
    grass: "Grass",
    ice: "Ice",
    fighting: "Fighting",
    poison: "Poison",
    ground: "Ground",
    flying: "Flying",
    psychic: "Psychic",
    bug: "Bug",
    rock: "Rock",
    ghost: "Ghost",
    dragon: "Dragon",
    dark: "Dark",
    steel: "Steel",
    fairy: "Fairy",
  },
};

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Mevcut yolu karşı dile çevirir (`/tr/pokemon/25` → `/en/pokemon/25`).
 */
export function switchLocalePath(
  pathname: string,
  currentLocale: Locale,
): { target: Locale; href: string } {
  const target: Locale = currentLocale === "tr" ? "en" : "tr";
  const segments = pathname.split("/");
  segments[1] = target;
  const href = segments.join("/");
  return { target, href };
}
