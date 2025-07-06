// src/env.d.ts

/// <reference types="astro/client" />
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
      recentPosts: any[]; 
    }
  }
