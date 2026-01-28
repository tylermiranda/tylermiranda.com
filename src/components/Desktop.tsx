import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { openWindows, openWindow } from '../stores/windows';
import type { WindowId } from '../types/window';

interface DesktopProps {
  windowContents: Record<WindowId, React.ReactNode>;
}

const icons: Array<{ id: WindowId; label: string; icon: string }> = [
  { id: 'about', label: 'about.txt', icon: '📄' },
  { id: 'projects', label: 'projects/', icon: '📁' },
  { id: 'skills', label: 'skills.json', icon: '📋' },
  { id: 'resume', label: 'resume.pdf', icon: '📑' },
  { id: 'contact', label: 'contact.sh', icon: '💻' },
];

export function Desktop({ windowContents }: DesktopProps) {
  const visibleWindows = useStore(openWindows);

  useEffect(() => {
    // Open welcome window on mount
    openWindow('welcome');
  }, []);

  return (
    <div className="h-screen bg-[#f5d89a] relative overflow-hidden">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, #d4c4a0 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} {...icon} />
        ))}
      </div>

      {/* Windows */}
      {visibleWindows.map((win) => (
        <Window key={win.id} id={win.id as WindowId}>
          {windowContents[win.id as WindowId]}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
