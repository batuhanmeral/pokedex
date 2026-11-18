import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/mock-fetch";
import { getPokemonCardData } from "./grid-data";

const API = "https://pokeapi.co/api/v2";
const COUNT = 120; // 50'lik gruplarla 3 parti

describe("getPokemonCardData", () => {
  it("fetches every pokemon in batches of 50 and returns sorted card data", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const ids = Array.from({ length: COUNT }, (_, i) => COUNT - i); // ters sıra

    const fetch = mockFetch({
      "/pokemon?limit=100000&offset=0": {
        count: COUNT,
        results: ids.map((id) => ({ name: `mon-${id}`, url: `${API}/pokemon/${id}/` })),
      },
    });
    const listResponse = fetch.getMockImplementation()!;
    fetch.mockImplementation(async (input) => {
      const url = String(input);
      const match = url.match(/\/pokemon\/(\d+)$/);
      if (!match) return listResponse(input);

      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 0));
      inFlight -= 1;
      const id = Number(match[1]);
      return Response.json({
        id,
        name: `mon-${id}`,
        types: [{ slot: 1, type: { name: id % 2 ? "fire" : "water", url: "" } }],
      });
    });

    const cards = await getPokemonCardData();

    expect(cards).toHaveLength(COUNT);
    expect(cards.map((c) => c.id)).toEqual(ids.toSorted((a, b) => a - b));
    expect(cards[0]).toEqual({ id: 1, name: "mon-1", types: ["fire"], generation: 1 });
    expect(cards.find((c) => c.id === 120)?.types).toEqual(["water"]);
    expect(maxInFlight).toBe(50);
  });
});
