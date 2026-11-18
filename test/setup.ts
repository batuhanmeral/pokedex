import { afterEach } from "vitest";

/**
 * Testler gerçek ağa çıkamaz. fetch modül yüklenirken engellenir; bir test
 * vi.stubGlobal ile (bkz. test/mock-fetch.ts) kendi sahtesini kurar ve
 * unstubGlobals her testten sonra yine bu engele döner.
 *
 * Engellenen çağrılar ayrıca kaydedilir: kod hatayı yutsa bile (örn.
 * getEncounters) test sonunda başarısız olur.
 */
const blocked: string[] = [];

globalThis.fetch = async (input) => {
  const url = String(input instanceof Request ? input.url : input);
  blocked.push(url);
  throw new Error(`Real network access is disabled in tests: ${url}`);
};

/** Engellenen istekleri döndürür ve kaydı temizler (setup'ın kendi testi için). */
export function takeBlockedRequests(): string[] {
  return blocked.splice(0);
}

afterEach(() => {
  if (blocked.length === 0) return;
  const urls = takeBlockedRequests().join(", ");
  throw new Error(`Unmocked fetch called during test: ${urls}`);
});
