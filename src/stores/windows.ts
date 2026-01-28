import { atom, computed } from 'nanostores';
import type { WindowState, WindowId } from '../types/window';

const defaultWindows: Record<WindowId, Omit<WindowState, 'isOpen' | 'isMinimized' | 'zIndex'>> = {
  welcome: {
    id: 'welcome',
    title: 'Terminal',
    route: '/',
    position: { x: 100, y: 80 },
    size: { width: 600, height: 400 },
  },
  about: {
    id: 'about',
    title: 'about.txt',
    route: '/about',
    position: { x: 150, y: 100 },
    size: { width: 600, height: 500 },
  },
  projects: {
    id: 'projects',
    title: 'projects/',
    route: '/projects',
    position: { x: 200, y: 120 },
    size: { width: 700, height: 500 },
  },
  skills: {
    id: 'skills',
    title: 'skills.json',
    route: '/skills',
    position: { x: 180, y: 90 },
    size: { width: 500, height: 450 },
  },
  resume: {
    id: 'resume',
    title: 'resume.pdf',
    route: '/resume',
    position: { x: 220, y: 110 },
    size: { width: 600, height: 700 },
  },
  contact: {
    id: 'contact',
    title: 'contact.sh',
    route: '/contact',
    position: { x: 160, y: 130 },
    size: { width: 500, height: 400 },
  },
  trash: {
    id: 'trash',
    title: 'trash/',
    route: '/trash',
    position: { x: 300, y: 150 },
    size: { width: 500, height: 450 },
  },
};

let maxZIndex = 0;

export const windows = atom<Record<WindowId, WindowState>>(
  Object.fromEntries(
    Object.entries(defaultWindows).map(([key, value]) => [
      key,
      { ...value, isOpen: false, isMinimized: false, zIndex: 0 },
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
