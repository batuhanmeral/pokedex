import { describe, expect, it } from "vitest";
import { ALL_TYPES, getTypeStyle } from "./type-colors";

describe("type colors", () => {
  it("defines exactly the 18 pokemon types", () => {
    expect(ALL_TYPES).toHaveLength(18);
    expect(new Set(ALL_TYPES).size).toBe(18);
    expect(ALL_TYPES).toEqual(expect.arrayContaining(["fire", "water", "fairy", "steel"]));
  });

  it("returns type-specific classes and a neutral fallback for unknown types", () => {
    expect(getTypeStyle("fire").badge).toContain("orange");
    expect(getTypeStyle("stellar")).toEqual(getTypeStyle("???"));
    expect(getTypeStyle("stellar").badge).toContain("slate");
  });
});
