// src/utils/helpers.ts
import './mock-cache'; 

export function stripHtml(html: string): string {
  try {
    if (typeof DOMParser !== 'undefined' && typeof document !== 'undefined' && document.createElement) {
      console.log('[stripHtml] Using native DOMParser.');
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const tempDiv = document.createElement('div'); 
      tempDiv.innerHTML = html;

      tempDiv.querySelectorAll('script, style').forEach((el: Element) => el.remove());
      return tempDiv.textContent?.replace(/\s+/g, ' ').trim() || '';
    } 
    else {
      console.warn('[stripHtml] DOMParser not fully functional or undefined. Falling back to robust regex.');
      let cleanText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      cleanText = cleanText.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      cleanText = cleanText.replace(/<[^>]*>/g, '');
      cleanText = cleanText.replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'");
      return cleanText.replace(/\s+/g, ' ').trim();
    }
  } catch (e) {
    console.error("Error stripping HTML (caught exception):", e);
    let cleanText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleanText = cleanText.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    cleanText = cleanText.replace(/<[^>]*>/g, '');
    cleanText = cleanText.replace(/&amp;/g, '&')
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&quot;/g, '"')
                          .replace(/&#39;/g, "'");
    return cleanText.replace(/\s+/g, ' ').trim();
  }
}

export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const cleanContent = stripHtml(content);
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
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
    const imageUrl = post.images[0]?.url;
    if (imageUrl) {
      return imageUrl.replace(/\/s\d+\//, '/w1200-h630-c/');
    }
  }

  if (post && post.content && typeof DOMParser !== 'undefined') { 
    try {
      const doc = new DOMParser().parseFromString(post.content, 'text/html');
      const img = doc.querySelector('img'); 
      if (img) {
        const src = img.getAttribute('src');
        if (src) {
          return src;
        }
      }
    } catch (e) {
      console.warn("Error parsing HTML content for image in getImageUrl:", e);
    }
  }
  return '/bimaakbar-og-default.png';
}

export function getAstroPostUrl(post: any): string {
  if (post && post.id) {
    return `/post/${post.id}`;
  }
  return '#';
}