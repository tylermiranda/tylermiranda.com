import { useState, type ReactNode } from 'react';
import type { WindowId } from '../types/window';

interface MobileLayoutProps {
  windowContents: Record<WindowId, ReactNode>;
}

const windows: Array<{ id: WindowId; label: string; icon: string }> = [
  { id: 'welcome', label: 'Terminal', icon: '🖥️' },
  { id: 'about', label: 'About', icon: '📄' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'skills', label: 'Skills', icon: '📋' },
  { id: 'resume', label: 'Resume', icon: '📑' },
  { id: 'contact', label: 'Contact', icon: '💻' },
];

export function MobileLayout({ windowContents }: MobileLayoutProps) {
  const [activeWindow, setActiveWindow] = useState<WindowId>('welcome');
  const [showMenu, setShowMenu] = useState(false);

  const activeWindowData = windows.find(w => w.id === activeWindow);

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Window - fullscreen style */}
      <div className="flex-1 p-2 pb-16 relative z-10">
        <div className="h-full bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden flex flex-col">
          {/* Window title bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 absolute left-1/2 -translate-x-1/2">
              {activeWindowData?.icon} {activeWindowData?.label}
            </span>
            <div className="w-12" />
          </div>

          {/* Window content */}
          <div className="flex-1 overflow-auto bg-gray-50">
            {windowContents[activeWindow]}
          </div>
        </div>
      </div>

      {/* Start Menu Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute bottom-14 left-2 right-2 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Profile Section */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center gap-3">
              <img
                src="/tyler_adult.jpeg"
                alt="Tyler Miranda"
                className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
              />
              <div className="text-white">
                <div className="font-bold">Tyler Miranda</div>
                <div className="text-xs text-amber-100">Senior VDI Platform Engineer</div>
              </div>
            </div>

            {/* Window shortcuts */}
            <div className="p-2 grid grid-cols-3 gap-2">
              {windows.map((win) => (
                <button
                  key={win.id}
                  onClick={() => {
                    setActiveWindow(win.id);
                    setShowMenu(false);
                  }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                    activeWindow === win.id
                      ? 'bg-amber-100 border border-amber-300'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{win.icon}</span>
                  <span className="text-xs text-gray-700">{win.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 p-2 flex justify-around">
              <a
                href="https://www.linkedin.com/in/tyler-miranda-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 text-gray-600"
              >
                <span className="text-lg">💼</span>
                <span className="text-xs">LinkedIn</span>
              </a>
              <a
                href="mailto:tyler.miranda@gmail.com"
                className="flex flex-col items-center p-2 text-gray-600"
              >
                <span className="text-lg">✉️</span>
                <span className="text-xs">Email</span>
              </a>
              <a
                href="https://github.com/tylermiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-xs mt-1">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-cream-dark/95 backdrop-blur-sm border-t border-gray-300 flex items-center px-2 z-30">
        {/* Start button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition-colors ${
            showMenu ? 'bg-white/70 shadow-sm' : 'hover:bg-white/50'
          }`}
        >
          <span className="text-lg">🖥️</span>
          <span className="font-medium text-sm hidden xs:inline">TylerOS</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Window tabs - scrollable */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {windows.slice(0, 4).map((win) => (
            <button
              key={win.id}
              onClick={() => setActiveWindow(win.id)}
              className={`px-2 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                activeWindow === win.id
                  ? 'bg-white/70 text-gray-800 shadow-sm'
                  : 'bg-gray-200/50 text-gray-600'
              }`}
            >
              {win.icon}
            </button>
          ))}
        </div>

        {/* Time */}
        <div className="text-xs font-mono text-gray-700 ml-2">
          {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
      </div>
    </div>
  );
}
