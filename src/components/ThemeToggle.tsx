/** @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = createSignal(false);

  const toggle = () => {
    const newMode = !darkMode();
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  onMount(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enableDark = saved === "dark" || (saved === null && prefersDark);
    document.documentElement.classList.toggle("dark", enableDark);
    setDarkMode(enableDark);
  });

  return (
    <button
      class="btn btn-muted px-3 py-1.5 rounded-full transition-default"
      aria-label="Toggle theme"
      onclick={toggle}
    >
      <i class={`ri-${darkMode() ? "sun" : "moon"}-line text-lg`}></i>
    </button>
  );
}
