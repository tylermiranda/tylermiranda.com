import { useStore } from '@nanostores/react';
import { useState, useEffect, useRef } from 'react';
import { taskbarWindows, focusWindow, minimizeWindow, openWindow } from '../stores/windows';
import type { WindowId } from '../types/window';

export function Taskbar() {
  const openWindowsList = useStore(taskbarWindows);
  const [time, setTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const menuItems: Array<{ id: WindowId; label: string; icon: string }> = [
    { id: 'about', label: 'About Me', icon: '📄' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'skills', label: 'Skills', icon: '📋' },
    { id: 'resume', label: 'Resume', icon: '📑' },
    { id: 'contact', label: 'Contact', icon: '💻' },
  ];

  const handleMenuItemClick = (id: WindowId) => {
    openWindow(id);
    setStartMenuOpen(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-cream-dark/90 backdrop-blur-sm border-t border-gray-300 flex items-center px-4">
      {/* Start Menu */}
      {startMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-14 left-2 w-72 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center gap-3">
            <img
              src="/tyler_adult.jpeg"
              alt="Tyler Miranda"
              className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
            />
            <div className="text-white">
              <div className="font-bold">Tyler Miranda</div>
              <div className="text-xs text-amber-100">Senior VDI Platform Engineer</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50 transition-colors text-left"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 p-2">
            <a
              href="https://www.linkedin.com/in/tyler-miranda-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50 transition-colors"
            >
              <span className="text-lg">💼</span>
              <span className="text-sm text-gray-700">LinkedIn</span>
            </a>
            <a
              href="mailto:tyler.miranda@gmail.com"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50 transition-colors"
            >
              <span className="text-lg">✉️</span>
              <span className="text-sm text-gray-700">Email Me</span>
            </a>
            <a
              href="https://github.com/tylermiranda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm text-gray-700">GitHub</span>
            </a>
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={() => setStartMenuOpen(!startMenuOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
          startMenuOpen ? 'bg-white/70 shadow-sm' : 'hover:bg-white/50'
        }`}
      >
        <span className="text-lg">🖥️</span>
        <span className="font-medium text-sm">TylerOS</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-3" />

      {/* Open windows */}
      <div className="flex-1 flex items-center gap-1">
        {openWindowsList.map((win) => (
          <button
            key={win.id}
            onClick={() => {
              if (win.isMinimized) {
                focusWindow(win.id as WindowId);
              } else {
                minimizeWindow(win.id as WindowId);
              }
            }}
            className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
              win.isMinimized
                ? 'bg-gray-200 text-gray-600'
                : 'bg-white/70 text-gray-800 shadow-sm'
            }`}
          >
            {win.title}
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-3">
        <a
          href="https://www.linkedin.com/in/tyler-miranda-pro/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="LinkedIn"
        >
          <span className="text-lg">💼</span>
        </a>
        <a
          href="mailto:tyler.miranda@gmail.com"
          className="hover:scale-110 transition-transform"
          aria-label="Email"
        >
          <span className="text-lg">✉️</span>
        </a>
        <div className="w-px h-6 bg-gray-300" />
        <span className="text-sm font-mono text-gray-700">{formatTime(time)}</span>
      </div>
    </div>
  );
}
