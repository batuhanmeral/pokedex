/** Bir takımdaki en fazla Pokemon sayısı */
export const TEAM_SIZE = 6;

/**
 * Takım URL parametresini (`?p=6,25,150`) ID listesine çevirir. Geçersiz,
 * bilinmeyen ve tekrar eden ID'ler atlanır; en fazla TEAM_SIZE ID döner.
 */
export function parseTeamParam(
  value: string | null,
  validIds: Set<number>,
): number[] {
  if (!value) return [];

  const ids: number[] = [];
  for (const part of value.split(",")) {
    const id = Number(part);
    if (Number.isInteger(id) && validIds.has(id) && !ids.includes(id)) {
      ids.push(id);
    }
    if (ids.length === TEAM_SIZE) break;
  }
  return ids;
}
