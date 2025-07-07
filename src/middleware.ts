import { defineMiddleware } from "astro:middleware";

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;

type BlogInfo = {
  name: string;
  description: string;
  image: { url: string };
};

async function fetchBlogInfo(BLOG_ID: string, API_KEY: string): Promise<BlogInfo> {
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}?key=${API_KEY}`);
  if (!res.ok) throw new Error("Gagal mengambil info blog");

  const data = await res.json() as BloggerBlogInfoApiResponse;

  return {
    name: data.name,
    description: data.description,
    image: data.images ?? { url: "/bimaakbar-og-default.png" }
  };
}

async function fetchRecentPosts(BLOG_ID: string, API_KEY: string): Promise<Post[]> {
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

export const onRequest = defineMiddleware(async (context, next) => {
  const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;
  const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;

  if (!BLOG_ID || !API_KEY) {
    console.error("Middleware: Kredensial Blogger tidak ditemukan.");
    context.locals.blogData = {
      name: "Bima Akbar",
      description: "Default description",
      image: { url: "/bimaakbar-og-default.png" }
    } as BlogInfo;
    context.locals.recentPosts = [];
    return next();
  }

  try {
    const [blogData, recentPosts] = await Promise.all([
      fetchBlogInfo(BLOG_ID, API_KEY),
      fetchRecentPosts(BLOG_ID, API_KEY)
    ]);

    context.locals.blogData = blogData;
   
    context.locals.recentPosts = recentPosts.sort((a: Post, b: Post) => new Date(b.published).getTime() - new Date(a.published).getTime());

  } catch (error) {
    console.error("Error di middleware:", error);
    context.locals.blogData = {
      name: "Bima Akbar",
      description: "Default description",
      image: { url: "/bimaakbar-og-default.png" }
    };
    context.locals.recentPosts = [];
  }

  return next();
});