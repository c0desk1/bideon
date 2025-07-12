//src/types.ts

interface BlogInfo {
  name: string;
  description: string;
  image: { url: string };
}

interface Post {
  id: string;
  title: string;
  url: string;
  published: string;
  updated: string;
  labels?: string[];
  images?: Array<{
    url: string;
  }>;
  content?: string;
  author: {
    id: string;
    displayName: string;
    url: string;
    image: {
      url: string;
    };
  };
  summary?: string;
  kind: string;  
  blog: {
    id: string;
  }; 
  selfLink: string; 
  replies: {
     totalItems: string;
    selfLink: string;
  };
  customMetaData?: Record<string, string>;
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
    items?: Post[];
    id: string;
    name: string;
    description: string;
    url: string;
    posts: {
      totalItems: string;
      selfLink: string;
    };
    pages: {
      totalItems: string;
      selfLink: string;
    };
    locale: {
      language: string;
      country: string;
      variant: string;
    };
    images?: {
      url: string;
    };
}

interface Env {
  VITE_BLOGGER_API_KEY: string;
  VITE_BLOGGER_BLOG_ID: string;
  BIMA_KV_SPACE: KVNamespace;
  ASSETS: { fetch: (request: Request) => Promise<Response>; };
}