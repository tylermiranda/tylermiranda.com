import { atom, computed } from 'nanostores';
import type { WindowState, WindowId } from '../types/window';

const defaultWindows: Record<WindowId, Omit<WindowState, 'isOpen' | 'isMinimized' | 'zIndex'>> = {
  welcome: {
    id: 'welcome',
    title: 'Terminal',
    route: '/',
    position: { x: 180, y: 50 },
    size: { width: 950, height: 500 },
  },
  about: {
    id: 'about',
    title: 'about.txt',
    route: '/about',
    position: { x: 500, y: 30 },
    size: { width: 800, height: 550 },
  },
  projects: {
    id: 'projects',
    title: 'projects/',
    route: '/projects',
    position: { x: 260, y: 80 },
    size: { width: 900, height: 550 },
  },
  'work-log': {
    id: 'work-log',
    title: 'work.log',
    route: '/work-log',
    position: { x: 220, y: 60 },
    size: { width: 920, height: 600 },
  },
  skills: {
    id: 'skills',
    title: 'skills.json',
    route: '/skills',
    position: { x: 180, y: 50 },
    size: { width: 400, height: 500 },
  },
  resume: {
    id: 'resume',
    title: 'resume.pdf',
    route: '/resume',
    position: { x: 340, y: 40 },
    size: { width: 850, height: 650 },
  },
  contact: {
    id: 'contact',
    title: 'contact.sh',
    route: '/contact',
    position: { x: 380, y: 180 },
    size: { width: 500, height: 400 },
  },
  trash: {
    id: 'trash',
    title: 'trash/',
    route: '/trash',
    position: { x: 300, y: 100 },
    size: { width: 900, height: 550 },
  },
};

let maxZIndex = 0;

export const windows = atom<Record<WindowId, WindowState>>(
  Object.fromEntries(
    Object.entries(defaultWindows).map(([key, value]) => [
      key,
      { ...value, isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    ])
  ) as Record<WindowId, WindowState>
);

export const openWindows = computed(windows, (w) =>
  Object.values(w).filter((win) => win.isOpen && !win.isMinimized)
);

export const taskbarWindows = computed(windows, (w) =>
  Object.values(w).filter((win) => win.isOpen)
);

export function openWindow(id: WindowId) {
  const current = windows.get();
  maxZIndex += 1;
  windows.set({
    ...current,
    [id]: { ...current[id], isOpen: true, isMinimized: false, zIndex: maxZIndex },
  });
}

export function closeWindow(id: WindowId) {
  const current = windows.get();
  windows.set({
    ...current,
    [id]: { ...current[id], isOpen: false, isMinimized: false },
  });
}

export function minimizeWindow(id: WindowId) {
  const current = windows.get();
  windows.set({
    ...current,
    [id]: { ...current[id], isMinimized: true },
  });
}

export function focusWindow(id: WindowId) {
  const current = windows.get();
  maxZIndex += 1;
  windows.set({
    ...current,
    [id]: { ...current[id], isMinimized: false, zIndex: maxZIndex },
  });
}

export function updateWindowPosition(id: WindowId, position: { x: number; y: number }) {
  const current = windows.get();
  windows.set({
    ...current,
    [id]: { ...current[id], position },
  });
}

export function updateWindowSize(id: WindowId, size: { width: number; height: number }) {
  const current = windows.get();
  windows.set({
    ...current,
    [id]: { ...current[id], size },
  });
}

export function toggleMaximize(id: WindowId) {
  const current = windows.get();
  const win = current[id];

  if (win.isMaximized) {
    // Restore to previous size/position
    const prev = win.preMaximizeState;
    windows.set({
      ...current,
      [id]: {
        ...win,
        isMaximized: false,
        position: prev?.position ?? win.position,
        size: prev?.size ?? win.size,
        preMaximizeState: undefined,
      },
    });
  } else {
    // Save current state and maximize
    windows.set({
      ...current,
      [id]: {
        ...win,
        isMaximized: true,
        preMaximizeState: { position: win.position, size: win.size },
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight - 48 }, // 48px for taskbar
      },
    });
  }
}
