//src/global.d.ts

interface Post {
    kind: string;
    id: string;
    blog: {
      id: string;
    };
    published: string;
    updated: string;
    url: string;
    selfLink: string;
    title: string;
    content?: string;
    author: {
      id: string;
      displayName: string;
      url: string;
      image: {
        url: string;
      };
    };
    replies: {
      totalItems: string;
      selfLink: string;
    };
    labels?: string[];
    images?: Array<{
      url: string;
    }>;
    customMetaData?: Record<string, string>;
    // Tambahkan properti lain jika Anda tahu ada di respons API dan Anda membutuhkannya
  }
  
  // Interface untuk respons API ketika mengambil daftar post
  interface BloggerPostsApiResponse {
    kind: string;
    items: Post[];
    nextPageToken?: string;
    prevPageToken?: string;
    etag?: string;
  }
  
  interface BloggerBlogInfoApiResponse {
    kind: string;
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
    // Tambahkan properti lain yang mungkin ada di info blog
  }