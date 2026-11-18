import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function request(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(new URL(path, "https://pokedex.test"), { headers });
}

const location = (res: Response) => res.headers.get("location");

describe("proxy", () => {
  it.each(["/tr", "/en", "/tr/pokemon/25", "/en/team?p=1,2"])(
    "passes %s through untouched",
    (path) => {
      const res = proxy(request(path));
      expect(location(res)).toBeNull();
      expect(res.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it("redirects / to the default locale without a trailing slash", () => {
    const res = proxy(request("/"));
    expect(res.status).toBe(307);
    expect(location(res)).toBe("https://pokedex.test/tr");
  });

  it("keeps the path and query string when adding a locale", () => {
    const res = proxy(request("/team?p=6,25"));
    expect(location(res)).toBe("https://pokedex.test/tr/team?p=6,25");
  });

  it("does not treat a locale-like prefix as a locale", () => {
    expect(location(proxy(request("/trainer")))).toBe("https://pokedex.test/tr/trainer");
  });

  it("uses the first supported Accept-Language entry", () => {
    const res = proxy(request("/compare", { "accept-language": "de-DE,en-US;q=0.8,tr;q=0.5" }));
    expect(location(res)).toBe("https://pokedex.test/en/compare");
  });

  it("prefers a valid NEXT_LOCALE cookie over Accept-Language", () => {
    const res = proxy(
      request("/", { cookie: "NEXT_LOCALE=en", "accept-language": "tr-TR" }),
    );
    expect(location(res)).toBe("https://pokedex.test/en");
  });

  it("ignores an unsupported cookie and falls back to Accept-Language, then default", () => {
    expect(
      location(proxy(request("/", { cookie: "NEXT_LOCALE=fr", "accept-language": "EN" }))),
    ).toBe("https://pokedex.test/en");
    expect(
      location(proxy(request("/", { cookie: "NEXT_LOCALE=fr", "accept-language": "fr" }))),
    ).toBe("https://pokedex.test/tr");
  });
});
