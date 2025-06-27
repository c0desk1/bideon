/** @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount } from "solid-js";

export default function NotificationDropdown() {
  const [show, setShow] = createSignal(false);
  const [count, setCount] = createSignal(3);
  let dropdownRef: HTMLDivElement | undefined;

  const toggle = () => setShow(!show());
  const close = () => setShow(false);

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(e.target as Node)) {
      close();
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    onCleanup(() => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    });
  });

  return (
    <div class="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        class="btn btn-muted px-3 py-1.5 rounded-full relative cursor-pointer transition-default"
        aria-label="Notifications"
      >
        <i class="ri-notification-3-line text-lg" />
        {count() > 0 && (
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {count()}
          </span>
        )}
      </button>

      {show() && (
        <div class="absolute right-0 mt-2 w-64 bg-[--color-surface] border border-[--color-border] rounded-xl shadow-md z-50 py-2 animate-fadeScale backdrop-blur-[var(--blur-strength)]">
          <div class="px-4 py-2 text-sm text-muted border-b border-[--color-border]">
            Notifications ({count()})
          </div>
          {count() === 0 ? (
            <div class="px-4 py-2 text-sm text-muted">No new notifications.</div>
          ) : (
            <ul class="divide-y divide-[--color-border]">
              <li class="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">New comment on your post.</li>
              <li class="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">Your article was featured!</li>
              <li class="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">Admin: Update available.</li>
            </ul>
          )}
          <div class="px-4 py-2 text-sm text-center border-t border-[--color-border] mt-2">
            <a href="/notifications" class="text-oklch(70% 0.2 250) hover:underline">
              See all
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
