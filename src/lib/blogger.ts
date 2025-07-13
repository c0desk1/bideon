// src/lib/blogger.ts

// Pastikan definisi tipe ini ada di src/types.ts atau di sini.
// Jika Anda memiliki src/types.ts, impor saja dari sana dan hapus definisi ini.
export interface Post {
  id: string;
  title: string;
  url: string;
  published: string;
  updated: string;
  labels?: string[];
  images?: Array<{ url: string; }>;
  content?: string;
  author: {
    id: string;
    displayName: string;
    url: string;
    image: { url: string; };
  };
  summary?: string;
  kind: string;
  blog: { id: string; };
  selfLink: string;
  replies: { totalItems: string; selfLink: string; };
  customMetaData?: Record<string, string>;
}

export interface BlogInfo {
  name: string;
  description: string;
  image: { url: string; };
}

interface BloggerPostsApiResponse {
  kind?: string;
  items?: Post[];
  nextPageToken?: string;
  prevPageToken?: string;
  etag?: string;
}

interface BloggerBlogInfoApiResponse {
  kind?: string;
  id?: string;
  name: string;
  description: string;
  url: string;
  posts: { totalItems: string; selfLink: string; };
  pages: { totalItems: string; selfLink: string; };
  locale: { language: string; country: string; variant: string; };
  images?: { url: string; };
}

import '../utils/mock-cache';

async function fetchAndCache<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    cacheTtlSeconds: number
): Promise<T> {
  if (typeof caches !== 'undefined' && caches.default) {
    const cache = caches.default;
    const request = new Request(`https://bima-akbar-dev/bimasaktiakbarr.workers.dev/${cacheKey}`);

    let cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log(`[Cache Hit] Serving '${cacheKey}' from cache.`);
      return cachedResponse.json() as Promise<T>;
    }
  } else {
      console.warn(`[DEV MODE] Caching skipped for '${cacheKey}' as 'caches' is not defined.`);
  }

  console.log(`Fetching '${cacheKey}' from API...`);
  const data = await fetcher();

  if (typeof caches !== 'undefined' && caches.default) {
    const responseToCache = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${cacheTtlSeconds}`,
      },
    });
    const cache = caches.default;
    const request = new Request(`https://bima-akbar-dev/bimasaktiakbarr.workers.dev/${cacheKey}`);
    await cache.put(request, responseToCache.clone());
  }

  return data;
}

export function getRelatedPosts(allPosts: Post[], currentPost: Post, maxPosts: number = 3): Post[] {
  const currentPostLabels = currentPost.labels || [];
  let relatedPosts: Post[] = [];

  if (currentPostLabels.length > 0) {
    relatedPosts = allPosts
      .filter(otherPost => {
        if (otherPost.id === currentPost.id) return false;
        const otherPostLabels = otherPost.labels || [];
        return otherPostLabels.some((label: string) => currentPostLabels.includes(label));
      })
      .map(p => {
        const matchingLabels = (p.labels || []).filter((label: string) => currentPostLabels.includes(label));
        return { ...p, relatednessScore: matchingLabels.length };
      })
      .sort((a, b) => {
        if (b.relatednessScore !== a.relatednessScore) {
          return b.relatednessScore - a.relatednessScore;
        }
        return new Date(b.published).getTime() - new Date(a.published).getTime();
      })
      .slice(0, maxPosts);
  }

  if (relatedPosts.length === 0) {
    relatedPosts = allPosts
      .filter(p => p.id !== currentPost.id)
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
      .slice(0, maxPosts);
  }
  
  return relatedPosts;
}

export async function fetchBlogPostsForSSG(
  blogId: string,
  apiKey: string,
  maxResults: number = 9,
  pageToken?: string,
  label?: string
): Promise<{ posts: Post[]; nextPageToken?: string }> {
const cacheKey = `blogger-posts-ssg-${blogId}-${maxResults}-${pageToken || 'no-page'}-${label || 'no-label'}`;

return fetchAndCache(cacheKey, async () => {
  const url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('fetchBodies', 'true');
  url.searchParams.append('fetchImages', 'true');
  url.searchParams.append('orderBy', 'published');

  if (pageToken) {
    url.searchParams.append('pageToken', pageToken);
  }
  if (label) {
    url.searchParams.append('labels', label);
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`Error fetching posts for SSG: ${res.status} ${await res.text()}`);
      throw new Error("Failed to fetch blog posts for SSG");
    }

    const data = await res.json() as BloggerPostsApiResponse;
    return {
      posts: data.items || [],
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error("Error in fetchBlogPostsForSSG:", error);
    return { posts: [], nextPageToken: undefined };
  }
}, 300);
}

export async function fetchBlogInfo(BLOG_ID: string, API_KEY: string): Promise<BlogInfo> {
  const cacheKey = `blogger-blog-info-${BLOG_ID}`;
  return fetchAndCache(cacheKey, async () => {
    const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}?key=${API_KEY}`);
    if (!res.ok) throw new Error("Gagal mengambil info blog");

    const data = await res.json() as BloggerBlogInfoApiResponse;
    return {
      name: data.name,
      description: data.description,
      image: data.images?.url ? { url: data.images.url } : { url: "/bimaakbar-og-default.png" }
    };
  }, 86400);
}

export async function fetchRecentPosts(BLOG_ID: string, API_KEY: string): Promise<Post[]> {
  const cacheKey = `blogger-recent-posts-${BLOG_ID}`;
  return fetchAndCache(cacheKey, async () => {
    const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=6&fetchImages=true&orderBy=published`);
    if (!res.ok) throw new Error("Gagal mengambil post terbaru");

    const data = await res.json() as BloggerPostsApiResponse;
    return data.items || [];
  }, 300);
}


export async function fetchLatestBloggerPost(BLOG_ID: string, API_KEY: string): Promise<Post | undefined> {
  const cacheKey = `blogger-latest-post-${BLOG_ID}`;
  return fetchAndCache(cacheKey, async () => {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal fetch dari Blogger");
    const data = await res.json() as BloggerPostsApiResponse;
    return data.items?.[0];
  }, 300);
}

export async function fetchBlogPostById(postId: string, blogId: string, apiKey: string): Promise<Post | null> {
  const cacheKey = `blogger-post-by-id-${postId}`;
  return fetchAndCache(cacheKey, async () => {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}&fetchBodies=true&fetchImages=true`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Post with ID ${postId} not found.`);
        return null;
      }
      console.error(`Error fetching post by ID ${postId}: ${res.status} - ${await res.text()}`);
      throw new Error(`Failed to fetch post by ID ${postId}`);
    }
    const data = await res.json() as Post;
    return data;
  }, 300);
}

export async function fetchAllPostsForRelated(blogId: string, apiKey: string): Promise<Post[]> {
  const cacheKey = `blogger-all-posts-metadata-${blogId}`;
  return fetchAndCache(cacheKey, async () => {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=500&fields=items(id,title,url,published,labels,author(id),images)&orderBy=published`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error fetching all posts metadata: ${res.status} - ${await res.text()}`);
      throw new Error(`Failed to fetch all posts metadata: ${res.status} ${await res.text()}`);
    }
    const data = await res.json() as BloggerPostsApiResponse;
    return (data.items || []).sort((a: Post, b: Post) => new Date(a.published).getTime() - new Date(b.published).getTime());
  }, 300);
}