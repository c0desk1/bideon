// src/utils/helpers.ts
import { load } from 'cheerio';

export function stripHtml(html: string): string {
  const $ = load(html);
  return $.text();
}

export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const cleanContent = stripHtml(content);
  const wordCount = cleanContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

export function getImageUrl(post: any): string {
  if (post && post.images && Array.isArray(post.images) && post.images.length > 0) {
    return post.images[0].url;
  }
  if (post && post.content) {
    const $ = load(post.content);
    const imgUrl = $('img').attr('src');
    if (imgUrl) {
      return imgUrl;
    }
  }
  return 'https://via.placeholder.com/400x250?text=No+Image';
}

export function getAstroPostUrl(post: any): string {
  if (post && post.id) {
    return `/post/${post.id}`;
  }
  return '#';
}

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