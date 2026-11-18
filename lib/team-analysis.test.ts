import { describe, expect, it } from "vitest";
import { chart } from "@/test/fixtures";
import { analyzeTeam, type TeamMember } from "./team-analysis";
import { ALL_TYPES } from "./type-colors";

const member = (id: number, ...types: string[]): TeamMember => ({
  id,
  name: `mon-${id}`,
  types,
});

describe("analyzeTeam", () => {
  it("reports every type as uncovered and unhit for an empty team", () => {
    const result = analyzeTeam([], chart);
    expect(result.rows.map((r) => r.type)).toEqual(ALL_TYPES);
    expect(result.rows.every((r) => r.weak + r.resist + r.immune === 0)).toBe(true);
    expect(result.commonWeaknesses).toEqual([]);
    expect(result.uncovered).toEqual(ALL_TYPES);
    expect(result.noOffenseAgainst).toEqual(ALL_TYPES);
  });

  it("counts weak, resist and immune members per attacking type", () => {
    const { rows } = analyzeTeam([member(6, "fire", "flying"), member(9, "water")], chart);
    const row = (type: string) => rows.find((r) => r.type === type);

    expect(row("rock")).toEqual({ type: "rock", weak: 1, resist: 0, immune: 0 });
    expect(row("electric")).toEqual({ type: "electric", weak: 2, resist: 0, immune: 0 });
    expect(row("ground")).toEqual({ type: "ground", weak: 0, resist: 0, immune: 1 });
    expect(row("fire")).toEqual({ type: "fire", weak: 0, resist: 2, immune: 0 });
  });

  it("flags a shared weakness only when two members are weak and none covers it", () => {
    const result = analyzeTeam([member(6, "fire", "flying"), member(9, "water")], chart);
    // electric: ikisi de zayıf, kimse dirençli değil → ortak zayıflık
    // rock: yalnızca bir üye zayıf → ortak değil
    expect(result.commonWeaknesses).toEqual(["electric"]);
    expect(result.uncovered).toContain("electric");
    expect(result.uncovered).not.toContain("ground");
  });

  it("does not flag a shared weakness that another member resists", () => {
    // İki fire zayıf (water), ama water üyesi water'a dirençli
    const result = analyzeTeam(
      [member(4, "fire"), member(5, "fire"), member(7, "water")],
      chart,
    );
    expect(result.rows.find((r) => r.type === "water")?.weak).toBe(2);
    expect(result.commonWeaknesses).not.toContain("water");
  });

  it("unions the super-effective targets of all member types in ALL_TYPES order", () => {
    const result = analyzeTeam([member(9, "water"), member(6, "fire", "flying")], chart);
    expect(result.superEffectiveAgainst).toEqual([
      "fire",
      "grass",
      "ice",
      "fighting",
      "ground",
      "bug",
      "rock",
      "steel",
    ]);
    expect(result.noOffenseAgainst).not.toContain("rock");
    expect(result.superEffectiveAgainst.length + result.noOffenseAgainst.length).toBe(18);
  });
});
