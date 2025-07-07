// src/env.d.ts
/// <reference types="astro/client" />

type ENV = {
  BIMA_KV_SPACE: KVNamespace;
};

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