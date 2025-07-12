// src/utils/mock-cache.ts
if (typeof caches === 'undefined') {
  globalThis.caches = {
    default: {
      async match(request: Request | string): Promise<Response | undefined> {
        console.warn('[DEV MOCK] Cache.match called. Always returning undefined.');
        return undefined;
      },
      async put(request: Request | string, response: Response): Promise<void> {
        console.warn('[DEV MOCK] Cache.put called. No actual caching in dev.');
      },
      async delete(request: Request | string): Promise<boolean> {
        console.warn('[DEV MOCK] Cache.delete called. No actual deletion in dev.');
        return false;
      }
    } as Cache,
  } as CacheStorage;
}