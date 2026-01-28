# TylerOS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal portfolio website styled as a desktop OS with draggable windows, desktop icons, and a taskbar using Astro and Tailwind CSS.

**Architecture:** Astro static site with React islands for window interactivity. Desktop icons open content in draggable windows. State managed via nano stores. Mobile falls back to stacked cards.

**Tech Stack:** Astro 5.x, React 19, Tailwind CSS 4, TypeScript, nano stores, Cloudflare Workers adapter

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

**Step 1: Initialize Astro project**

Run:
```bash
cd /Users/tyler/Documents/git/tylermiranda.com2/.worktrees/tyleros-redesign
npm create astro@latest . -- --template minimal --install --git --typescript strict
```

Select: Yes to install dependencies, No to git init (already a repo)

**Step 2: Add integrations**

Run:
```bash
npm install @astrojs/react @astrojs/tailwind @astrojs/cloudflare react react-dom nanostores @nanostores/react
npm install -D @types/react @types/react-dom
```

**Step 3: Configure Astro**

Replace `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  adapter: cloudflare(),
});
```

**Step 4: Configure Tailwind**

Replace `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F3EF',
        'cream-dark': '#E8E4DC',
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

**Step 5: Create global styles**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply font-sans;
  }

  body {
    @apply bg-cream text-gray-900 overflow-hidden;
    height: 100vh;
    height: 100dvh;
  }
}
```

**Step 6: Verify build works**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro project with React, Tailwind, Cloudflare"
```

---

## Task 2: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title?: string;
}

const { title = 'TylerOS' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Tyler Miranda - Software Engineer" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 2: Update index page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="TylerOS">
  <main class="h-screen bg-cream flex items-center justify-center">
    <h1 class="text-4xl font-bold text-gray-900">TylerOS</h1>
  </main>
</BaseLayout>
```

**Step 3: Verify dev server works**

Run:
```bash
npm run dev
```

Expected: Page loads at localhost:4321 showing "TylerOS" centered

**Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add base layout and placeholder index page"
```

---

## Task 3: Window Store

**Files:**
- Create: `src/stores/windows.ts`
- Create: `src/types/window.ts`

**Step 1: Create window types**

Create `src/types/window.ts`:

```typescript
export interface WindowState {
  id: string;
  title: string;
  route: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type WindowId = 'about' | 'projects' | 'skills' | 'resume' | 'contact' | 'welcome';
```

**Step 2: Create window store**

Create `src/stores/windows.ts`:

```typescript
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
```

**Step 3: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit**

```bash
git add src/stores/windows.ts src/types/window.ts
git commit -m "feat: add window state management with nano stores"
```

---

## Task 4: Window Component

**Files:**
- Create: `src/components/Window.tsx`

**Step 1: Create window component**

Create `src/components/Window.tsx`:

```tsx
import { useStore } from '@nanostores/react';
import { useRef, useCallback, useState, type ReactNode, type MouseEvent } from 'react';
import {
  windows,
  closeWindow,
  minimizeWindow,
  focusWindow,
  updateWindowPosition,
} from '../stores/windows';
import type { WindowId } from '../types/window';

interface WindowProps {
  id: WindowId;
  children: ReactNode;
}

export function Window({ id, children }: WindowProps) {
  const allWindows = useStore(windows);
  const windowState = allWindows[id];
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-window-controls]')) return;

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
    </div>
  );
}
```

**Step 2: Verify build**

Run:
```bash
npm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Window.tsx
git commit -m "feat: add draggable Window component with title bar controls"
```

---

## Task 5: Desktop Icons

**Files:**
- Create: `src/components/DesktopIcon.tsx`
- Create: `src/components/Desktop.tsx`

**Step 1: Create DesktopIcon component**

Create `src/components/DesktopIcon.tsx`:

```tsx
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
      <span className="text-xs font-medium text-gray-800 text-center font-mono leading-tight">
        {label}
      </span>
    </button>
  );
}
```

**Step 2: Create Desktop component**

Create `src/components/Desktop.tsx`:

```tsx
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
```

**Step 3: Commit**

```bash
git add src/components/DesktopIcon.tsx src/components/Desktop.tsx
git commit -m "feat: add Desktop and DesktopIcon components"
```

---

## Task 6: Taskbar

**Files:**
- Create: `src/components/Taskbar.tsx`

**Step 1: Create Taskbar component**

Create `src/components/Taskbar.tsx`:

```tsx
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
```

**Step 2: Verify build**

Run:
```bash
npm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Taskbar.tsx
git commit -m "feat: add Taskbar with window tabs and system tray"
```

---

## Task 7: Welcome Terminal

**Files:**
- Create: `src/components/WelcomeTerminal.tsx`

**Step 1: Create terminal component with typing effect**

Create `src/components/WelcomeTerminal.tsx`:

```tsx
import { useState, useEffect } from 'react';

const lines = [
  { prompt: '> whoami', response: 'Tyler Miranda - Software Engineer' },
  { prompt: '> cat welcome.txt', response: "Hey! Welcome to my corner of the internet.\nClick around to explore my work, skills, and how to reach me." },
];

export function WelcomeTerminal() {
  const [displayedLines, setDisplayedLines] = useState<Array<{ prompt: string; response: string; showResponse: boolean }>>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingPrompt, setIsTypingPrompt] = useState(true);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    const targetText = isTypingPrompt ? currentLine.prompt : currentLine.response;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, isTypingPrompt ? 50 : 20);
      return () => clearTimeout(timeout);
    }

    // Finished typing current segment
    if (isTypingPrompt) {
      // Show response after prompt
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], showResponse: true },
        ]);
        setIsTypingPrompt(false);
        setCurrentCharIndex(0);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setIsTypingPrompt(true);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex, isTypingPrompt]);

  useEffect(() => {
    if (currentLineIndex < lines.length && isTypingPrompt && currentCharIndex === 0) {
      setDisplayedLines((prev) => [
        ...prev,
        { prompt: '', response: lines[currentLineIndex].response, showResponse: false },
      ]);
    }
  }, [currentLineIndex, isTypingPrompt, currentCharIndex]);

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-full overflow-auto">
      {displayedLines.map((line, i) => (
        <div key={i} className="mb-2">
          <div className="text-gray-400">
            {i === displayedLines.length - 1 && isTypingPrompt
              ? lines[currentLineIndex].prompt.slice(0, currentCharIndex)
              : line.prompt || lines[i]?.prompt}
            {i === displayedLines.length - 1 && isTypingPrompt && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
          {line.showResponse && (
            <div className="text-green-400 whitespace-pre-wrap pl-2">
              {i === displayedLines.length - 1 && !isTypingPrompt
                ? line.response.slice(0, currentCharIndex)
                : line.response}
              {i === displayedLines.length - 1 && !isTypingPrompt && currentCharIndex < line.response.length && (
                <span className="animate-pulse">▋</span>
              )}
            </div>
          )}
        </div>
      ))}
      {currentLineIndex >= lines.length && (
        <div className="text-gray-400">
          {'> '}<span className="animate-pulse">▋</span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/WelcomeTerminal.tsx
git commit -m "feat: add WelcomeTerminal with typing animation"
```

---

## Task 8: Wire Up Index Page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Connect Desktop to index page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <div className="prose">About content coming soon...</div>,
      projects: <div className="prose">Projects content coming soon...</div>,
      skills: <div className="prose">Skills content coming soon...</div>,
      resume: <div className="prose">Resume content coming soon...</div>,
      contact: <div className="prose">Contact content coming soon...</div>,
    }}
  />
</BaseLayout>
```

**Step 2: Run dev server and test**

Run:
```bash
npm run dev
```

Expected:
- Page loads with cream background
- Desktop icons visible on left
- Welcome terminal window opens automatically with typing animation
- Clicking icons opens windows
- Windows are draggable
- Taskbar shows open windows

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire up Desktop with window contents on index page"
```

---

## Task 9: About Content

**Files:**
- Create: `src/components/AboutContent.tsx`
- Modify: `src/pages/index.astro`

**Step 1: Create About content**

Create `src/components/AboutContent.tsx`:

```tsx
export function AboutContent() {
  return (
    <div className="font-mono text-sm">
      <div className="text-gray-500 mb-4"># about.txt</div>

      <div className="flex gap-6 mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-4xl">
          👨‍💻
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tyler Miranda</h1>
          <p className="text-gray-600">Software Engineer</p>
          <p className="text-gray-500 text-xs mt-1">📍 Location TBD</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          Hey! I'm Tyler, a software engineer who builds things for the web.
        </p>

        <p>
          I love creating tools that make developers' lives easier and
          products that users actually enjoy using.
        </p>

        <div className="bg-cream p-3 rounded border border-gray-200">
          <div className="text-gray-500 text-xs mb-1">// Currently interested in</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Building delightful user experiences</li>
            <li>Developer tooling</li>
            <li>Making complex things simple</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <a
            href="https://github.com/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 transition-colors"
          >
            GitHub →
          </a>
          <a
            href="https://linkedin.com/in/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            LinkedIn →
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update index.astro**

Update the `about` entry in windowContents in `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <AboutContent />,
      projects: <div className="prose">Projects content coming soon...</div>,
      skills: <div className="prose">Skills content coming soon...</div>,
      resume: <div className="prose">Resume content coming soon...</div>,
      contact: <div className="prose">Contact content coming soon...</div>,
    }}
  />
</BaseLayout>
```

**Step 3: Verify in dev**

Run:
```bash
npm run dev
```

Expected: Clicking about.txt icon shows the about content in a window

**Step 4: Commit**

```bash
git add src/components/AboutContent.tsx src/pages/index.astro
git commit -m "feat: add About content window"
```

---

## Task 10: Skills Content

**Files:**
- Create: `src/components/SkillsContent.tsx`
- Modify: `src/pages/index.astro`

**Step 1: Create Skills content as JSON**

Create `src/components/SkillsContent.tsx`:

```tsx
const skills = {
  languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
  frameworks: ['React', 'Next.js', 'Astro', 'Node.js', 'FastAPI'],
  tools: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'Redis'],
  practices: ['TDD', 'CI/CD', 'Code Review', 'Agile'],
};

export function SkillsContent() {
  return (
    <div className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded h-full overflow-auto">
      <div className="text-gray-500 mb-2">// skills.json</div>
      <pre className="text-xs leading-relaxed">
        <span className="text-gray-500">{'{'}</span>
        {'\n'}

        {Object.entries(skills).map(([category, items], i) => (
          <span key={category}>
            {'  '}<span className="text-purple-400">"{category}"</span>
            <span className="text-gray-500">:</span>
            <span className="text-gray-500">[</span>
            {'\n'}
            {items.map((item, j) => (
              <span key={item}>
                {'    '}<span className="text-green-400">"{item}"</span>
                {j < items.length - 1 && <span className="text-gray-500">,</span>}
                {j === 0 && category === 'languages' && (
                  <span className="text-gray-600"> // yes I actually enjoy TS</span>
                )}
                {'\n'}
              </span>
            ))}
            {'  '}<span className="text-gray-500">]</span>
            {i < Object.keys(skills).length - 1 && <span className="text-gray-500">,</span>}
            {'\n'}
          </span>
        ))}

        <span className="text-gray-500">{'}'}</span>
      </pre>
    </div>
  );
}
```

**Step 2: Update index.astro skills entry**

Update `src/pages/index.astro` to include SkillsContent:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
import { SkillsContent } from '../components/SkillsContent';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <AboutContent />,
      projects: <div className="prose">Projects content coming soon...</div>,
      skills: <SkillsContent />,
      resume: <div className="prose">Resume content coming soon...</div>,
      contact: <div className="prose">Contact content coming soon...</div>,
    }}
  />
</BaseLayout>
```

**Step 3: Commit**

```bash
git add src/components/SkillsContent.tsx src/pages/index.astro
git commit -m "feat: add Skills content as syntax-highlighted JSON"
```

---

## Task 11: Contact Content

**Files:**
- Create: `src/components/ContactContent.tsx`
- Modify: `src/pages/index.astro`

**Step 1: Create Contact terminal**

Create `src/components/ContactContent.tsx`:

```tsx
import { useState } from 'react';

export function ContactContent() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="font-mono text-sm bg-gray-900 text-green-400 p-4 rounded h-full">
      <div className="text-gray-500 mb-4">#!/bin/bash</div>
      <div className="text-gray-500 mb-4"># contact.sh - Get in touch</div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">$</span>
          <span>echo $EMAIL</span>
        </div>
        <div className="pl-4 flex items-center gap-2">
          <span className="text-amber-400">tyler@example.com</span>
          <button
            onClick={() => copyToClipboard('tyler@example.com', 'email')}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {copied === 'email' ? '✓ copied!' : '[copy]'}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-gray-400">$</span>
          <span>open $GITHUB</span>
        </div>
        <div className="pl-4">
          <a
            href="https://github.com/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            github.com/tylermiranda →
          </a>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-gray-400">$</span>
          <span>open $LINKEDIN</span>
        </div>
        <div className="pl-4">
          <a
            href="https://linkedin.com/in/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            linkedin.com/in/tylermiranda →
          </a>
        </div>

        <div className="mt-6 text-gray-500">
          <span className="text-gray-400">$</span> # DMs always open 👋
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
import { SkillsContent } from '../components/SkillsContent';
import { ContactContent } from '../components/ContactContent';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <AboutContent />,
      projects: <div className="prose">Projects content coming soon...</div>,
      skills: <SkillsContent />,
      resume: <div className="prose">Resume content coming soon...</div>,
      contact: <ContactContent client:load />,
    }}
  />
</BaseLayout>
```

**Step 3: Commit**

```bash
git add src/components/ContactContent.tsx src/pages/index.astro
git commit -m "feat: add Contact terminal with copy-to-clipboard"
```

---

## Task 12: Projects Content

**Files:**
- Create: `src/components/ProjectsContent.tsx`
- Create: `src/content/projects.ts`
- Modify: `src/pages/index.astro`

**Step 1: Create projects data**

Create `src/content/projects.ts`:

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Project One',
    description: 'A brief description of your first project and what it does.',
    tech: ['TypeScript', 'React', 'Node.js'],
    url: 'https://example.com',
    github: 'https://github.com/tylermiranda/project-1',
  },
  {
    id: 'project-2',
    name: 'Project Two',
    description: 'Another cool project you built.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/tylermiranda/project-2',
  },
  {
    id: 'project-3',
    name: 'Project Three',
    description: 'Something else impressive.',
    tech: ['Go', 'Docker', 'AWS'],
  },
];
```

**Step 2: Create Projects content**

Create `src/components/ProjectsContent.tsx`:

```tsx
import { projects } from '../content/projects';

export function ProjectsContent() {
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        <span>📁</span>
        <span>~/projects/</span>
      </div>

      <div className="grid gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>📦</span>
                <h3 className="font-bold text-gray-900">{project.name}</h3>
              </div>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="GitHub"
                  >
                    🐙
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Live site"
                  >
                    🔗
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-xs mb-3">{project.description}</p>

            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-cream text-gray-600 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
import { SkillsContent } from '../components/SkillsContent';
import { ContactContent } from '../components/ContactContent';
import { ProjectsContent } from '../components/ProjectsContent';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <AboutContent />,
      projects: <ProjectsContent />,
      skills: <SkillsContent />,
      contact: <ContactContent client:load />,
      resume: <div className="prose">Resume content coming soon...</div>,
    }}
  />
</BaseLayout>
```

**Step 4: Commit**

```bash
git add src/content/projects.ts src/components/ProjectsContent.tsx src/pages/index.astro
git commit -m "feat: add Projects folder view with project cards"
```

---

## Task 13: Resume Content

**Files:**
- Create: `src/components/ResumeContent.tsx`
- Create: `public/resume.pdf` (placeholder)
- Modify: `src/pages/index.astro`

**Step 1: Create Resume preview**

Create `src/components/ResumeContent.tsx`:

```tsx
export function ResumeContent() {
  return (
    <div className="font-mono text-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-500">
          <span>📄</span>
          <span>resume.pdf</span>
        </div>
        <a
          href="/resume.pdf"
          download
          className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors flex items-center gap-1"
        >
          <span>⬇️</span>
          Download PDF
        </a>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Tyler Miranda</h1>
            <p className="text-gray-600">Software Engineer</p>
            <p className="text-xs text-gray-500 mt-1">
              tyler@example.com • github.com/tylermiranda • linkedin.com/in/tylermiranda
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Software Engineer</h3>
                  <span className="text-xs text-gray-500">2022 - Present</span>
                </div>
                <p className="text-gray-600 text-xs">Company Name</p>
                <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                  <li>Accomplishment one with measurable impact</li>
                  <li>Accomplishment two demonstrating skills</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Education
            </h2>
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900">Computer Science, B.S.</h3>
                <span className="text-xs text-gray-500">2018 - 2022</span>
              </div>
              <p className="text-gray-600 text-xs">University Name</p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Skills
            </h2>
            <p className="text-xs text-gray-700">
              TypeScript, JavaScript, Python, React, Node.js, PostgreSQL, AWS, Docker, Git
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create placeholder PDF**

Run:
```bash
mkdir -p public
echo "Placeholder - replace with actual resume" > public/resume.pdf
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
import { SkillsContent } from '../components/SkillsContent';
import { ContactContent } from '../components/ContactContent';
import { ProjectsContent } from '../components/ProjectsContent';
import { ResumeContent } from '../components/ResumeContent';
---

<BaseLayout title="TylerOS | Tyler Miranda">
  <Desktop
    client:load
    windowContents={{
      welcome: <WelcomeTerminal client:load />,
      about: <AboutContent />,
      projects: <ProjectsContent />,
      skills: <SkillsContent />,
      contact: <ContactContent client:load />,
      resume: <ResumeContent />,
    }}
  />
</BaseLayout>
```

**Step 4: Commit**

```bash
git add src/components/ResumeContent.tsx public/resume.pdf src/pages/index.astro
git commit -m "feat: add Resume preview with download button"
```

---

## Task 14: Mobile Responsive Layout

**Files:**
- Create: `src/components/MobileLayout.tsx`
- Modify: `src/pages/index.astro`

**Step 1: Create mobile layout**

Create `src/components/MobileLayout.tsx`:

```tsx
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
```

**Step 2: Update index to use responsive layout**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Desktop } from '../components/Desktop';
import { MobileLayout } from '../components/MobileLayout';
import { WelcomeTerminal } from '../components/WelcomeTerminal';
import { AboutContent } from '../components/AboutContent';
import { SkillsContent } from '../components/SkillsContent';
import { ContactContent } from '../components/ContactContent';
import { ProjectsContent } from '../components/ProjectsContent';
import { ResumeContent } from '../components/ResumeContent';

const windowContents = {
  welcome: <WelcomeTerminal client:load />,
  about: <AboutContent />,
  projects: <ProjectsContent />,
  skills: <SkillsContent />,
  contact: <ContactContent client:load />,
  resume: <ResumeContent />,
};
---

<BaseLayout title="TylerOS | Tyler Miranda">
  {/* Desktop layout */}
  <div class="hidden md:block">
    <Desktop client:load windowContents={windowContents} />
  </div>

  {/* Mobile layout */}
  <div class="md:hidden">
    <MobileLayout client:load windowContents={windowContents} />
  </div>
</BaseLayout>
```

**Step 3: Verify responsive behavior**

Run:
```bash
npm run dev
```

Expected:
- Desktop (>768px): Full desktop OS experience
- Mobile (<768px): Stacked accordion layout

**Step 4: Commit**

```bash
git add src/components/MobileLayout.tsx src/pages/index.astro
git commit -m "feat: add responsive mobile layout with accordion sections"
```

---

## Task 15: Final Polish & Deploy Setup

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json`

**Step 1: Create Cloudflare config**

Create `wrangler.toml`:

```toml
name = "tylermiranda-com"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

**Step 2: Add deploy script**

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

**Step 3: Build and verify**

Run:
```bash
npm run build
```

Expected: Build succeeds, `dist/` folder created

**Step 4: Commit**

```bash
git add wrangler.toml package.json
git commit -m "feat: add Cloudflare Workers deployment config"
```

---

## Summary

After completing all tasks, you will have:

1. ✅ Astro project with React, Tailwind, TypeScript
2. ✅ Desktop OS metaphor with draggable windows
3. ✅ Desktop icons that open content windows
4. ✅ Taskbar with window tabs and system tray
5. ✅ Welcome terminal with typing animation
6. ✅ About, Projects, Skills, Contact, Resume content
7. ✅ Mobile-responsive accordion layout
8. ✅ Cloudflare Workers deployment ready

**To deploy:**
```bash
npm run deploy
```

**To customize:**
- Update `src/content/projects.ts` with your real projects
- Replace `public/resume.pdf` with your actual resume
- Update social links in components
- Customize colors in `tailwind.config.mjs`
