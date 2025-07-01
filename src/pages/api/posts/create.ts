// src/pages/api/posts/create.ts
import type { APIRoute } from "astro";

// Fungsi untuk membuat slug dari judul
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const POST: APIRoute = async ({ request }) => {
  const { title, description, body } = await request.json();

  if (!title || !body) {
    return new Response(JSON.stringify({ message: "Judul dan isi konten diperlukan" }), { status: 400 });
  }

  const slug = slugify(title);
  const date = new Date().toISOString();

  // Format konten file Markdown
  const fileContent = `---
title: "${title}"
description: "${description}"
pubDate: ${date}
author: "Bima Akbar" # Atau ambil dari user yang login nanti
draft: true # Buat sebagai draf dulu
---

${body}
`;

  const owner = import.meta.env.GITHUB_OWNER;
  const repo = import.meta.env.GITHUB_REPO;
  const token = import.meta.env.GITHUB_TOKEN;
  const path = `src/content/blog/${slug}.md`;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat: add new post '${title}'`,
        content: Buffer.from(fileContent).toString('base64'),
        branch: 'main'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan ke GitHub');
    }

    return new Response(JSON.stringify({ message: 'Postingan berhasil dibuat!', data }), { status: 201 });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
    return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
  }
};