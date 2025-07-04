// utils/label.ts
export function labelToSlug(label: string): string {
    return label.toLowerCase().replace(/\s+/g, '-');
  }
  
  export function slugToLabel(slug: string): string {
    return slug.replace(/-/g, ' ');
  }
  