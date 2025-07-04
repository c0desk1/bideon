// src/pages/api/related-posts.ts

import { getPostsByLabel } from '../../../utils/blogger';

export async function get({ url }) {
  const label = url.searchParams.get('label');
  if (!label) return new Response('Label missing', { status: 400 });

  const posts = await getPostsByLabel(label);
  // map posts supaya return slug dan title saja
  const simplifiedPosts = posts.map((post: { url: string | URL; id: any; title: any; }) => {
    const urlObj = new URL(post.url);
    const slug = urlObj.pathname.split('/').pop()?.replace('.html', '') ?? '';
    return { id: post.id, slug, title: post.title };
  });

  return new Response(JSON.stringify(simplifiedPosts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
