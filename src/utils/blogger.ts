// utils/blogger.ts
const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;


export function extractSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/\d{4}\/\d{2}\/(.+?)\.html/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return '';
  } catch (e) {
    console.error("❌ extractSlug error", url, e);
    return '';
  }
}

export async function getPostBySlug(slug: string) {
  let nextPageToken = '';
  let page = 0;
  const maxPages = 5;

  do {
    const res = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=100&pageToken=${nextPageToken}`
    );
    const data = await res.json();
    const posts = data.items || [];

    for (const post of posts) {
      const postSlug = extractSlug(post.url);
      console.log("🔍 Cek:", postSlug, "vs", slug);

      if (postSlug === slug) {
        console.log("✅ Ditemukan post:", post.title);
        return post;
      }
    }

    nextPageToken = data.nextPageToken || '';
    page++;
  } while (nextPageToken && page < maxPages);

  return null;
}


export async function getAllLabels(): Promise<string[]> {
    const allLabels = new Set<string>();
    let nextPageToken = '';
    const maxPages = 5; // Batasi agar tidak terlalu berat
    let page = 0;
  
    do {
      const res = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=100&pageToken=${nextPageToken}`
      );
      const data = await res.json();
      const posts = data.items || [];
  
      for (const post of posts) {
        if (post.labels) {
          post.labels.forEach((label: string) => allLabels.add(label));
        }
      }
  
      nextPageToken = data.nextPageToken || '';
      page++;
    } while (nextPageToken && page < maxPages);
  
    return Array.from(allLabels);
}

export async function getPostsByLabel(label: string) {
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?labels=${encodeURIComponent(label)}&key=${API_KEY}`);
  const json = await res.json();
  return json.items || [];
}

export async function getAllPosts() {
  let posts: any[] = [];
  let nextPageToken = '';
  const maxPages = 5;

  for (let page = 0; page < maxPages; page++) {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.items) posts.push(...data.items);
    if (!data.nextPageToken) break;
    nextPageToken = data.nextPageToken;
  }

  return posts;
}

