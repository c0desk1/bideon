// src/env.d.ts

/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
      blogName: string;
      blogData: {
        name: string;
        description: string;
      };
      recentPosts: any[]; 
    }
  }