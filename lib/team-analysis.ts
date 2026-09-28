import { defensiveMultipliers } from "./pokeapi";
import { ALL_TYPES } from "./type-colors";
import type { TypeChart } from "./types";

export interface TeamMember {
  id: number;
  name: string;
  types: string[];
}

/** Saldıran bir tipe karşı takımın durumu */
export interface DefensiveRow {
  /** Saldıran tip */
  type: string;
  /** Bu tipe karşı zayıf üye sayısı (çarpan > 1) */
  weak: number;
  /** Bu tipe dirençli üye sayısı (0 < çarpan < 1) */
  resist: number;
  /** Bu tipe bağışık üye sayısı (çarpan = 0) */
  immune: number;
}

export interface TeamAnalysis {
  /** 18 tipin tamamı, ALL_TYPES sırasında (tablo için sabit sıra) */
  rows: DefensiveRow[];
  /** En az iki üyenin zayıf olduğu ve hiçbir üyenin karşılamadığı tipler */
  commonWeaknesses: string[];
  /** Hiçbir üyenin direnç ya da bağışıklık göstermediği tipler */
  uncovered: string[];
  /** Takımın süper etkili vurabildiği tipler */
  superEffectiveAgainst: string[];
  /** Hiçbir üyenin süper etkili vuramadığı tipler */
  noOffenseAgainst: string[];
}

/** Bir tipe karşı "ortak zayıflık" saymak için gereken en az üye sayısı */
const COMMON_WEAKNESS_THRESHOLD = 2;

/**
 * Takımın savunma ve saldırı kapsamasını hesaplar.
 *
 * Saf fonksiyon: tip tablosu dışarıdan verilir, istek atılmaz — bu yüzden
 * takım her değiştiğinde istemci tarafında yeniden çalıştırılabilir.
 */
export function analyzeTeam(
  members: TeamMember[],
  chart: TypeChart,
): TeamAnalysis {
  const rows: DefensiveRow[] = ALL_TYPES.map((type) => ({
    type,
    weak: 0,
    resist: 0,
    immune: 0,
  }));
  const rowByType = new Map(rows.map((row) => [row.type, row]));

  for (const member of members) {
    const multipliers = defensiveMultipliers(member.types, chart);
    for (const [attackingType, multiplier] of Object.entries(multipliers)) {
      const row = rowByType.get(attackingType);
      if (!row) continue;
      if (multiplier === 0) row.immune += 1;
      else if (multiplier > 1) row.weak += 1;
      else if (multiplier < 1) row.resist += 1;
    }
  }

  const covers = (row: DefensiveRow) => row.resist + row.immune > 0;

  const commonWeaknesses = rows
    .filter((row) => row.weak >= COMMON_WEAKNESS_THRESHOLD && !covers(row))
    .map((row) => row.type);

  const uncovered = rows.filter((row) => !covers(row)).map((row) => row.type);

  // Üyelerin tiplerinin 2x hasar verdiği tiplerin birleşimi
  const offensive = new Set<string>();
  for (const member of members) {
    for (const type of member.types) {
      for (const target of chart[type]?.doubleTo ?? []) offensive.add(target);
    }
  }

  return {
    rows,
    commonWeaknesses,
    uncovered,
    superEffectiveAgainst: ALL_TYPES.filter((type) => offensive.has(type)),
    noOffenseAgainst: ALL_TYPES.filter((type) => !offensive.has(type)),
  };
}
