// src/components/AdminSidebar.tsx
import { useState, useEffect } from 'react';

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"></path></svg> },
    { href: "/admin/reports", label: "Reports", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11H8V21H2V11ZM9 3H15V21H9V3ZM16 6H22V21H16V6Z"></path></svg> },
    { href: "/admin/content", label: "Content", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM6 7H18V9H6V7ZM6 11H18V13H6V11Z"></path></svg> },
    { href: "/admin/comments", label: "Comments", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19H13V22.5L8.5 19H8C4.13401 19 1 15.866 1 12C1 8.13401 4.13401 5 8 5H10V3Z"></path></svg> },
    { href: "/admin/profile", label: "Profile", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg> },
    { href: "/admin/settings", label: "Settings", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.236L4.5 7.636V16.364L12 20.764L19.5 16.364V7.636L12 3.236ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z"></path></svg> },
];

export default function AdminSidebar() {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      
      const handleToggle = () => setIsMobileOpen(prev => !prev);
      const toggleButton = document.getElementById('mobile-menu-toggle');
      
      toggleButton?.addEventListener('click', handleToggle);

      return () => {
        toggleButton?.removeEventListener('click', handleToggle);
      };
    }
  }, []);

  const baseClass = "flex items-center w-full h-11 px-3.5 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeClass = "bg-zinc-700 text-white font-semibold";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity lg:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <aside className={`flex flex-col bg-zinc-800 border-r border-zinc-700 transition-all duration-300 ease-in-out z-40 
        ${isDesktopExpanded ? 'w-64' : 'w-24'} 
        fixed inset-y-0 left-0 lg:relative
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
      }>
        
        <button onClick={() => setIsDesktopExpanded(!isDesktopExpanded)} className="hidden lg:flex items-center p-4 border-b border-zinc-700 h-[69px] hover:bg-zinc-700/50 w-full flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-400"><path d="M12 2C16.9706 2 21 6.02944 21 11V12H18V11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11V12H1V11C1 6.02944 5.02944 2 10 2H12ZM4.53503 14H19.465C19.7824 14.5833 20 15.2536 20 16C20 18.2091 18.2091 20 16 20H8C5.79086 20 4 18.2091 4 16C4 15.2536 4.21759 14.5833 4.53503 14ZM9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16H9Z"></path></svg>
          </div>
          <span className={`font-bold text-xl ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopExpanded ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>CMS.</span>
        </button>
        
        <div className="flex lg:hidden items-center p-4 border-b border-zinc-700 h-[69px] w-full flex-shrink-0">
          <span className="font-bold text-xl ml-2">Menu</span>
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4144L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className={`${baseClass} ${currentPath === link.href ? activeClass : ''}`} title={isDesktopExpanded ? '' : link.label}>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"><div className="w-6 h-6 fill-current">{link.icon}</div></div>
              <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${isDesktopExpanded ? 'opacity-100' : 'opacity-0'}`}>{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}