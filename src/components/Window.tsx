import { useStore } from '@nanostores/react';
import { useRef, useCallback, useState, type ReactNode, type MouseEvent } from 'react';
import {
  windows,
  closeWindow,
  minimizeWindow,
  focusWindow,
  updateWindowPosition,
  updateWindowSize,
} from '../stores/windows';
import type { WindowId } from '../types/window';

interface WindowProps {
  id: WindowId;
  children: ReactNode;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

export function Window({ id, children }: WindowProps) {
  const allWindows = useStore(windows);
  const windowState = allWindows[id];
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-window-controls]')) return;
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) return;

      focusWindow(id);
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - windowState.position.x,
        y: e.clientY - windowState.position.y,
      };

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        updateWindowPosition(id, {
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, windowState.position]
  );

  const handleResizeMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      focusWindow(id);
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = windowState.size.width;
      const startHeight = windowState.size.height;

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const newWidth = Math.max(MIN_WIDTH, startWidth + (e.clientX - startX));
        const newHeight = Math.max(MIN_HEIGHT, startHeight + (e.clientY - startY));
        updateWindowSize(id, { width: newWidth, height: newHeight });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, windowState.size]
  );

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="absolute bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: windowState.position.x,
        top: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      }}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 bg-cream-dark border-b border-gray-200 cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2" data-window-controls>
          <button
            onClick={() => closeWindow(id)}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            aria-label="Close window"
          />
          <button
            onClick={() => minimizeWindow(id)}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            aria-label="Minimize window"
          />
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            aria-label="Maximize window"
          />
        </div>
        <span className="text-sm font-medium text-gray-700 font-mono">
          {windowState.title}
        </span>
        <div className="w-16" /> {/* Spacer for centering title */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>

      {/* Resize Handle - Bottom Right Corner */}
      <div
        data-resize-handle
        className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize ${
          isResizing ? 'bg-blue-200' : ''
        }`}
        onMouseDown={handleResizeMouseDown}
      >
        <svg
          className="w-4 h-4 text-gray-400"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
        </svg>
      </div>
    </div>
  );
}
