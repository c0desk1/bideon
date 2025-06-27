/** @jsxImportSource solid-js */
import { createSignal, onCleanup } from "solid-js";

export default function SearchBar() {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  let inputRef: HTMLInputElement | undefined;

  const close = () => {
    setQuery("");
    setOpen(false);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  document.addEventListener("keydown", handleKey);
  onCleanup(() => document.removeEventListener("keydown", handleKey));

  return (
    <div class="relative w-auto">
      {open() ? (
        <div class="flex items-center gap-2 animate-fadeScale relative">
          <i class="ri-search-line text-muted text-lg" />
          <input
            ref={inputRef}
            autofocus
            type="text"
            placeholder="Cari konten..."
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            class="w-40 sm:w-64 px-4 py-2 pr-10 rounded-md bg-[--color-surface] text-[--color-text] placeholder:text-muted border border-[--color-border] outline-none transition-default backdrop-blur-[var(--blur-strength)]"
          />
          {/* Tombol Close (X) */}
          <button
            type="button"
            onClick={close}
            class="absolute right-2 text-muted hover:text-[--color-text] transition-default cursor-pointer"
            aria-label="Tutup pencarian"
          >
            <i class="ri-close-line text-lg" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          class="btn btn-muted px-3 py-1.5 rounded-full transition-default cursor-pointer"
        >
          <i class="ri-search-line text-lg" />
        </button>
      )}
    </div>
  );
}
