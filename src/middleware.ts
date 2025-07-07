import { defineMiddleware } from "astro:middleware";
import {fetchBlogInfo, fetchRecentPosts} from './lib/blogger';

export const onRequest = defineMiddleware(async (context, next) => {
  const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;
  const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;

  if (!BLOG_ID || !API_KEY) {
    console.error("Middleware: Kredensial Blogger tidak ditemukan.");
    context.locals.blogData = {
      name: "Bima Akbar",
      description: "Default description",
      image: { url: "/bimaakbar-og-default.png" }
    };
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