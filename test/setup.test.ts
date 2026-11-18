import { describe, expect, it, vi } from "vitest";
import { getEncounters } from "@/lib/pokeapi";
import { takeBlockedRequests } from "./setup";

describe("test setup network guard", () => {
  it("rejects real network access when fetch is not mocked", async () => {
    await expect(fetch("https://pokeapi.co/api/v2/pokemon/1")).rejects.toThrow(
      /Real network access is disabled/,
    );
    expect(takeBlockedRequests()).toEqual(["https://pokeapi.co/api/v2/pokemon/1"]);
  });

  it("records blocked requests even when the code swallows the error", async () => {
    // getEncounters hataları yutup [] döner; engel yine de çağrıyı kaydeder,
    // böylece afterEach mock'u unutulmuş bir testi düşürebilir.
    // Ağ hataları yeniden denendiği için her deneme ayrı kaydedilir.
    vi.useFakeTimers();
    try {
      const result = getEncounters(1);
      await vi.runAllTimersAsync();
      expect(await result).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
    expect(takeBlockedRequests()).toEqual(
      Array(3).fill("https://pokeapi.co/api/v2/pokemon/1/encounters"),
    );
  });
});
