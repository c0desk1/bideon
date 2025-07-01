// src/components/TableOfContents.tsx
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
  return (
    <div className="mb-10 bg-zinc-900 p-4 rounded-lg border border-white/5">
      <h2 className="text-white text-lg font-semibold mb-2">Daftar Isi</h2>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id} className={`ml-${(item.level - 2) * 4}`}>
            <a href={`#${item.id}`} className="text-sm text-blue-400 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
