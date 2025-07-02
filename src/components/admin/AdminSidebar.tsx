// src/components/admin/AdminSidebar.tsx
import { useEffect, useState } from 'react';
import { SITE } from '@/data/site.ts';

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <i className="ri-dashboard-line text-lg" /> },
  { href: "/admin/reports", label: "Reports", icon: <i className="ri-bar-chart-2-line text-lg" /> },
  { href: "/admin/content", label: "Content", icon: <i className="ri-file-text-line text-lg" /> },
  { href: "/admin/comments", label: "Comments", icon: <i className="ri-chat-3-line text-lg" /> },
  { href: "/admin/profile", label: "Profile", icon: <i className="ri-user-line text-lg" /> },
  { href: "/admin/settings", label: "Settings", icon: <i className="ri-settings-3-line text-lg" /> },
];

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved !== null) setExpanded(saved === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-expanded', expanded);
    localStorage.setItem('sidebar-expanded', expanded.toString());
  }, [expanded]);

  return (
    <aside className={`fixed top-0 left-0 h-full z-44 bg-zinc-900 border-r border-zinc-700 transition-all duration-300 ease-in-out
      ${expanded ? 'w-44' : 'w-14'}`}>

      {/* Header */}
      <div className="flex flex-row  h-[69px] p-2 space-y-1">
        <div className="flex items-center gap-4 px-2 py-2 text-zinc-300 ">
          <button onClick={() => setExpanded(!expanded)} className="w-6 h-6 flex items-center justify-center cursor-pointer">
            <i className={`text-lg hover:text-zinc-300  ${expanded ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'}`} />
          </button>
          <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            {SITE.TITLE}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col items-start p-2 space-y-1 cursor-pointer">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex flex-row items-center gap-4 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:text-zinc-700 transition-colors"
            title={!expanded ? link.label : ''}
          >
            <div className="flex w-6 h-6 items-center">{link.icon}</div>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              {link.label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
