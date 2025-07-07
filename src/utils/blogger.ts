// src/lib/blogger.ts
export interface Post {
  id: string;
  title: string;
  url: string;
  published: string;
  labels?: string[];
  images?: Array<{ url: string }>;
  content?: string;
  author: {
    id?: string;
    displayName: string;
    url?: string;
    image: { url: string };
  };
  summary?: string;
}

export interface BloggerPostsApiResponse {
  kind: string;
  items?: Post[];
  nextPageToken?: string;
  prevPageToken?: string;
  etag?: string;

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