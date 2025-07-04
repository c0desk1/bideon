// src/utils/helpers.ts
import { parse as parseHtml } from 'node-html-parser';

export function stripHtml(html: string): string {
  if (!html) return '';
  const root = parseHtml(html);
  return root.text;
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
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function getImageUrl(post: any): string {
  if (post && post.images && Array.isArray(post.images) && post.images.length > 0) {
    return post.images[0].url;
  }
  if (post && post.content) {
    const root = parseHtml(post.content);
    const imgEl = root.querySelector('img');
    if (imgEl) {
      const imgUrl = imgEl.getAttribute('src');
      if (imgUrl) return imgUrl;
    }
  }
  return 'https://via.placeholder.com/400x250?text=No+Image';
}