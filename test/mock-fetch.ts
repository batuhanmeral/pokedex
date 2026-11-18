import { vi } from "vitest";

type Route = unknown | ((url: string) => unknown);

/**
 * Global fetch'i URL → JSON eşlemesiyle sahteler; gerçek ağa çıkılmaz.
 * Eşlemede olmayan URL'ler 404 döner. Anahtarlar tam URL ya da
 * "https://pokeapi.co/api/v2" sonrası yol olabilir.
 */
export function mockFetch(routes: Record<string, Route>) {
  const fn = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const path = url.replace("https://pokeapi.co/api/v2", "");
    const route = Object.hasOwn(routes, url) ? routes[url] : routes[path];
    if (route === undefined) {
      return new Response("not found", { status: 404 });
    }
    const body = typeof route === "function" ? route(url) : route;
    if (body === undefined) throw new Error(`mockFetch route returned undefined: ${url}`);
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}
