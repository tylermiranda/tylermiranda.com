# TylerOS - Personal Portfolio

A retro desktop OS-themed personal portfolio built with Astro and React.

## Features

- Desktop OS aesthetic with draggable, resizable windows
- File/folder navigation metaphor
- Easter egg trash can with humorous "deleted files"
- Terminal welcome screen
- Responsive design (desktop + mobile layouts)

## Tech Stack

- **Astro** - Static site generator
- **React** - Interactive components
- **Tailwind CSS** - Styling
- **Nanostores** - State management
- **Cloudflare Pages** - Hosting

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally before deploying       |

## Project Structure

```
src/
├── components/     # React components (Desktop, Window, etc.)
├── content/        # Data files (projects, trash items)
├── layouts/        # Astro layouts
├── pages/          # Astro pages
├── stores/         # Nanostores state
├── styles/         # Global CSS
└── types/          # TypeScript types
```
