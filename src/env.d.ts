// src/env.d.ts
/// <reference types="astro/client" />
/// <reference types="jsdom" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime {
      blogName: string;
      blogData: {
        name: string;
        description: string;
        image: {url: string};
        labels?: string[];
      };
      recentPosts: Post[];
  }
}

interface CacheStorage {
  default: Cache;
}

declare var caches: CacheStorage;

declare interface KVNamespace {
  get(key: string, type?: "text"): Promise<string | null>;
  get<T>(key: string, type: "json"): Promise<T | null>;
  get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  get(key: string, type: "stream"): Promise<ReadableStream | null>;
  put(key: string, value: string | ReadableStream | ArrayBuffer, options?: {
      expiration?: string | number;
      expirationTtl?: string | number;
      metadata?: any;
  }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
      prefix?: string;
      limit?: number;
      cursor?: string;
  }): Promise<{
      keys: { name: string; expiration?: number; metadata?: any; }[];
      list_complete: boolean;
      cursor: string;
  }>;
}