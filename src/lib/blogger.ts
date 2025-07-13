// src/lib/blogger.ts

type BlogInfo = {
  name: string;
  description: string;
  image: { url: string };
};

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;

export function getRelatedPosts(allPosts: any[], currentPost: any, maxPosts: number = 3): any[] {
  const currentPostLabels = currentPost.labels || [];
  let relatedPosts: any[] = [];

  if (currentPostLabels.length > 0) {
    relatedPosts = allPosts
      .filter(otherPost => {
        if (otherPost.id === currentPost.id) return false;
        const otherPostLabels = otherPost.labels || [];
        return otherPostLabels.some((label: any) => currentPostLabels.includes(label));
      })
      .map(p => {
        const matchingLabels = (p.labels || []).filter((label: any) => currentPostLabels.includes(label));
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

export async function fetchBlogPosts(
  blogId: string,
  apiKey: string,
  maxResults: number = 9,
  pageToken?: string,
  label?: string
): Promise<{ posts: Post[]; nextPageToken?: string }> {
  const url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('maxResults', maxResults.toString());
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
      console.error(`Error fetching posts: ${res.status} ${await res.text()}`);
      throw new Error("Failed to fetch blog posts");
    }

    const data = await res.json() as BloggerPostsApiResponse;

    return {
      posts: data.items || [],
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error("Error in fetchBlogPosts:", error);
    return { posts: [], nextPageToken: undefined };
  }
}

export async function fetchBlogInfo(BLOG_ID: string, API_KEY: string): Promise<BlogInfo> {
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}?key=${API_KEY}`);
  if (!res.ok) throw new Error("Gagal mengambil info blog");

  const data = await res.json() as BloggerBlogInfoApiResponse;

  return {
    name: data.name,
    description: data.description,
    image: data.images ?? { url: "/bimaakbar-og-default.png" }
  };
}

export async function fetchRecentPosts(BLOG_ID: string, API_KEY: string): Promise<Post[]> {
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=6&fetchImages=true&orderBy=published`);
  if (!res.ok) throw new Error("Gagal mengambil post terbaru");

  const data = await res.json() as BloggerPostsApiResponse;

  return data.items || [];
}

export async function fetchLatestBloggerPost() {
  const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal fetch dari Blogger");
  const data = await res.json() as BloggerPostsApiResponse;
  return data.items?.[0];
}

