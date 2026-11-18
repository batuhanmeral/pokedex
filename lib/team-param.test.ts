import { describe, expect, it } from "vitest";
import { parseTeamParam, TEAM_SIZE } from "./team-param";

const valid = new Set(Array.from({ length: 1025 }, (_, i) => i + 1));

describe("parseTeamParam", () => {
  it("returns an empty team for a missing or empty param", () => {
    expect(parseTeamParam(null, valid)).toEqual([]);
    expect(parseTeamParam("", valid)).toEqual([]);
  });

  it("parses comma separated ids in order", () => {
    expect(parseTeamParam("6,25,150", valid)).toEqual([6, 25, 150]);
  });

  it("drops non-integer, unknown and duplicate ids", () => {
    expect(parseTeamParam("6,abc,2.5,99999,6,,25", valid)).toEqual([6, 25]);
  });

  it(`keeps at most ${TEAM_SIZE} members`, () => {
    expect(parseTeamParam("1,2,3,4,5,6,7,8", valid)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("still fills the team when invalid ids come first", () => {
    expect(parseTeamParam("0,-1,1,2,3,4,5,6,7", valid)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
