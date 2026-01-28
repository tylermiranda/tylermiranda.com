import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { taskbarWindows, focusWindow, minimizeWindow } from '../stores/windows';
import type { WindowId } from '../types/window';

export function Taskbar() {
  const openWindowsList = useStore(taskbarWindows);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-cream-dark/90 backdrop-blur-sm border-t border-gray-300 flex items-center px-4">
      {/* Start button */}
      <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/50 transition-colors">
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
          href="https://github.com/tylermiranda"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="GitHub"
        >
          <span className="text-lg">🐙</span>
        </a>
        <a
          href="https://linkedin.com/in/tylermiranda"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="LinkedIn"
        >
          <span className="text-lg">💼</span>
        </a>
        <div className="w-px h-6 bg-gray-300" />
        <span className="text-sm font-mono text-gray-700">{formatTime(time)}</span>
      </div>
    </div>
  );
}
