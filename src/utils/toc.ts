import { JSDOM } from "jsdom";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function generateTOC(html: string): { toc: TocItem[]; contentWithIds: string } {
  const toc: TocItem[] = [];

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const headings = document.querySelectorAll("h2, h3");

  for (const heading of headings) {
    const text = heading.textContent?.trim() || "";
    const level = heading.tagName === "H2" ? 2 : 3;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    heading.setAttribute("id", id);
    toc.push({ id, text, level });
  }

  return {
    toc,
    contentWithIds: document.body.innerHTML,
  };
}
