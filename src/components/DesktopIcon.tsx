import { openWindow } from '../stores/windows';
import type { WindowId } from '../types/window';

interface DesktopIconProps {
  id: WindowId;
  label: string;
  icon: string;
}

export function DesktopIcon({ id, label, icon }: DesktopIconProps) {
  return (
    <button
      onClick={() => openWindow(id)}
      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/30 transition-colors group w-20"
    >
      <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-xs font-medium text-white text-center font-mono leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}
