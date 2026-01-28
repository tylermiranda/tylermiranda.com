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
    <div className="h-screen bg-cream relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
