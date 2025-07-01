import { marked } from 'marked';

// Slugify manual untuk heading
function slugify(text: unknown): string {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}



// Render markdown → HTML dengan ID pada heading
export function generateHtmlWithIds(markdown: string): string {
  const renderer = new marked.Renderer();

  renderer.heading = (text: string, level: number) => {
    const id = slugify(text);
    const cleanText = typeof text === 'string' ? text : String(text);
    return `<h${level} id="${id}">${cleanText}</h${level}>`;
  };

  return marked(markdown, { renderer });
}

// Ambil daftar isi dari HTML hasil render
export function generateToc(html: string) {
  const headingRegex = /<h([2-3]) id="([^"]+)">(.+?)<\/h\1>/g;
  const toc: Array<{ id: string; text: string; level: number }> = [];

  let match;
  while ((match = headingRegex.exec(html))) {
    const [, level, id, text] = match;
    toc.push({ id, text, level: parseInt(level) });
  }

  return toc;
}
