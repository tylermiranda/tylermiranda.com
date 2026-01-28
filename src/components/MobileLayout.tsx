import type { ReactNode } from 'react';
import type { WindowId } from '../types/window';

interface MobileLayoutProps {
  windowContents: Record<WindowId, ReactNode>;
}

const sections: Array<{ id: WindowId; label: string; icon: string }> = [
  { id: 'about', label: 'About', icon: '📄' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'skills', label: 'Skills', icon: '📋' },
  { id: 'resume', label: 'Resume', icon: '📑' },
  { id: 'contact', label: 'Contact', icon: '💻' },
];

export function MobileLayout({ windowContents }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream-dark/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🖥️</span>
          <h1 className="font-bold text-gray-900">TylerOS</h1>
        </div>
      </header>

      {/* Welcome */}
      <div className="p-4">
        <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
          <div className="text-gray-400">{`> whoami`}</div>
          <div>Tyler Miranda - Software Engineer</div>
          <div className="text-gray-400 mt-2">{`> cat welcome.txt`}</div>
          <div className="text-green-400">
            Hey! Welcome to my corner of the internet.
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pb-20 space-y-4">
        {sections.map(({ id, label, icon }) => (
          <details key={id} className="group">
            <summary className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-400 transition-colors list-none">
              <span>{icon}</span>
              <span className="font-medium text-gray-900 font-mono">{label}</span>
              <span className="ml-auto text-gray-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>
            <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
              {windowContents[id]}
            </div>
          </details>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-cream-dark/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 flex justify-around">
        <a
          href="https://github.com/tylermiranda"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-lg">🐙</span>
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/tylermiranda"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-lg">💼</span>
          LinkedIn
        </a>
        <a
          href="mailto:tyler@example.com"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-lg">✉️</span>
          Email
        </a>
      </nav>
    </div>
  );
}
