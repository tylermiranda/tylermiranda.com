# TylerOS: Personal Website Redesign

## Overview

A complete redesign of tylermiranda.com using a "desktop operating system" metaphor inspired by PostHog's distinctive design. The site presents as a custom OS ("TylerOS") where visitors interact with desktop icons, draggable windows, and a taskbar to explore portfolio content.

**Goals:**
- Professional portfolio showcasing work, skills, and experience
- Creative expression through memorable, personality-filled design
- Stand out from typical developer portfolios

**Tech Stack:**
- Astro (static site generator)
- Tailwind CSS
- Cloudflare Workers (hosting)
- Minimal JS for window interactivity (React/Svelte islands)

---

## The Desktop Environment

### Visual Foundation

- **Wallpaper:** Warm cream/beige background (#F5F3EF) with subtle illustrated pattern - faint code snippets, terminal prompts, or circuit-board-style lines as texture
- **Desktop Icons:** Large, illustrated icons arranged on the left side (macOS/Windows style):
  - `about.txt` - Bio/intro
  - `projects/` - Folder icon for work
  - `skills.json` - Technical skills
  - `resume.pdf` - Downloadable resume
  - `contact.sh` - Contact form/info
  - `trash/` - Easter egg (rejected ideas or funny 404-style content)

### The Taskbar

Fixed bar at the bottom of the screen:
- **Left:** "Start" button or logo that opens a menu
- **Center:** Open windows appear here as tabs
- **Right:** Social links (GitHub, LinkedIn) styled as system tray icons, plus a fake clock showing actual time

### Window Chrome

When clicking an icon, content opens in a window with:
- Title bar with the filename
- Traffic light buttons (close/minimize/maximize)
- Subtle drop shadow on cream background

---

## Window Behavior & Navigation

### Interactions

- **Draggable:** Windows can be dragged around the desktop by their title bar
- **Z-index stacking:** Clicking a window brings it to front
- **Multiple windows:** Users can open several sections at once
- **Close/minimize:** Close returns to desktop, minimize sends to taskbar

### Initial State

When the site loads, one window auto-opens: a "welcome" terminal that types out an intro message character-by-character:

```
> whoami
Tyler Miranda - Software Engineer

> cat welcome.txt
Hey! Welcome to my corner of the internet.
Click around to explore my work, skills, and how to reach me.

> _
```

### Navigation Flow

- Desktop icons are the primary nav (click to open windows)
- Taskbar shows open windows for quick switching
- Optional: keyboard shortcuts (Cmd+1 for about, etc.) as easter egg
- URL routing: Each window maps to a route (`/about`, `/projects`) for shareability and SEO

### Mobile (< 768px)

The desktop metaphor breaks on mobile. Instead:
- Simplified "mobile app" view with stacked cards for each section
- Keep warm colors, illustrations, and personality
- Hamburger menu or bottom tab bar for navigation
- No draggable windows - just scrollable content

---

## Content Windows

### about.txt

Opens as a text editor window:
- Photo (illustrated or real with illustrated border)
- Bio written in casual, personality-filled tone
- Maybe formatted as a "config file" or README
- Links to social profiles inline

### projects/ (Folder)

Opens as a file browser window:
- Grid of project "files" with custom icons
- Each project clickable, opens its own detail window
- Project details: description, tech stack (as "dependencies"), screenshots, links
- Projects displayed as `.app` files or folders

### skills.json

Opens as a code editor window:
- Actual JSON or YAML format showing skills
- Syntax highlighted
- Categories: `"languages"`, `"frameworks"`, `"tools"`
- Humorous comments: `// still mass closing react import warnings`

### resume.pdf

Opens a "preview" window showing the resume with download button, or triggers direct download.

### contact.sh

Opens as a terminal window:
- Interactive-looking form styled as command prompts
- `> enter_name:` followed by input field
- Or display email/links in terminal style with "copy to clipboard" command

---

## Illustrations & Visual Personality

### Illustration Style

Hand-drawn, slightly rough line art with warm fills:
- "Developer doodles in a notebook" aesthetic
- Color palette: cream background, orange/amber accents, soft blues and greens
- Consistent line weight and style across all illustrations

### Key Illustrated Elements

- **Desktop icons:** Custom illustrated icons for each file type
- **Mascot/avatar:** Illustrated version of Tyler, OR a tech mascot (robot, terminal character, friendly cursor)
- **Window decorations:** Small doodles in corners or empty states
- **Background texture:** Faint code snippets, circuit patterns, or grid lines
- **Easter eggs:** Hidden illustrations on hover, konami code, etc.

### Personality in Copy

- Casual, first-person voice throughout
- Occasional jokes in unexpected places (loading states, error messages, alt text)
- Terminal commands as section headers: `$ cat about.txt`
- Comments in skills.json: `// yes I actually enjoy CSS`

### Microinteractions

- Icons wiggle slightly on hover
- Windows have subtle spring animation when opening
- Typing animation in the welcome terminal
- Taskbar icons bounce when a window opens

---

## Technical Architecture

### Astro Structure

```
src/
├── components/
│   ├── Desktop.astro        # Main desktop container
│   ├── Window.astro         # Reusable window component
│   ├── Taskbar.astro        # Bottom taskbar
│   ├── DesktopIcon.astro    # Clickable desktop icons
│   └── Terminal.astro       # Typing terminal effect
├── layouts/
│   └── BaseLayout.astro     # HTML shell, fonts, meta
├── pages/
│   ├── index.astro          # Desktop with welcome window
│   ├── about.astro          # About window route
│   ├── projects/
│   │   ├── index.astro      # Projects folder view
│   │   └── [slug].astro     # Individual project pages
│   ├── skills.astro
│   ├── resume.astro
│   └── contact.astro
├── content/                  # Markdown/JSON for projects, bio
└── styles/
    └── global.css           # Tailwind + custom styles
```

### Window State Management

- Use Astro islands with React or Svelte component for window interactivity (drag, z-index, minimize)
- Store open windows in URL params or lightweight state (nano stores)
- SSR the content, hydrate only the interactive shell

### Performance

- Static generation for all pages
- Lazy load illustrations
- Minimal JS - only hydrate interactive components

---

## Summary

| Aspect | Decision |
|--------|----------|
| Metaphor | Full desktop OS ("TylerOS") |
| Framework | Astro |
| Hosting | Cloudflare Workers |
| Visual Style | PostHog-inspired warm/illustrated |
| Theme | Tech/terminal with hand-drawn charm |
| Content | Bio, Projects, Skills, Resume, Contact |
| Mobile | Stacked cards, no desktop metaphor |
