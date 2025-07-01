// src/utils/readingTime.ts
export function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const numberOfWords = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);
    return `${minutes} menit baca`;
  }
  