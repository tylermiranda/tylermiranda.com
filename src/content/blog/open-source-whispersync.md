---
title: "The day my e-reader erased 200 pages: building an open-source 'Whispersync'"
description: "How a 900ms distributed systems race condition in self-hosted reading sync taught me to enforce strict backend monotonicity across e-ink and web clients."
publishDate: "2026-11-15"
author: "Tyler Miranda"
tags: ["Distributed Systems", "E-Ink", "SQLite", "Offline-First", "KOReader", "PWA"]
ogImage: "/images/blog/bookworm-reading-dashboard.png"
readTime: "5 min read"
draft: false
---

The single best feature of the Kindle ecosystem is not the hardware. It is Whispersync.

You read a chapter on your phone while waiting in line for coffee, pick up your e-reader in bed that night, and find yourself right where you stopped.

I like e-ink, but I try to keep my everyday tools out of walled gardens. Five years ago, I would not have attempted to build a custom reading sync stack from scratch. Writing a custom sync server, reverse-engineering client lifecycle hooks, building an offline PWA with IndexedDB, and wiring it to an e-reader would have demanded weeks of tedious boilerplate. In the agentic AI era, that friction has vanished. I can hand the architecture and protocol constraints to an agent teammate, iterate through a few back-and-forth debugging rounds, and have working personal software that genuinely improves daily life.

Over the weekend, that is exactly how I stitched together my own private reading intelligence and sync stack.

### The setup

- **E-reader:** A Kobo Libra running [KOReader](https://github.com/koreader/koreader) with the [ZenOS](https://github.com/xZenLabs/zen-os) minimal UI overlay.
- **Phone reader:** An offline-first Progressive Web App (PWA) that caches books locally in IndexedDB with an OLED black theme.
- **Sync backend:** A small Node.js and SQLite service running on my local network that implements KOReader's open [KOSync protocol](https://github.com/koreader/koreader/wiki/Sync-Plugin).
- **Automation bot:** A local background script that logs reading sessions into SQLite, generates GitHub-style reading heatmaps, and suggests similar books once a title reaches 100%.

![Bookworm Reading Dashboard](/images/blog/bookworm-reading-dashboard.png)

On paper, the flow seemed simple enough:

1. The phone posts reading progress to the server.
2. The e-reader asks the server for the current position.
3. If the phone is ahead, the e-reader prompts to jump forward.

Then the hardware reminded me why distributed state is tricky.

---

## How the server erased my progress

On Saturday afternoon, I read through roughly 200 pages on my phone, moving from page 22 to page 217 (48% of the book), and put the phone down.

That evening, I opened the sleepcover on the Kobo and waited for the prompt to jump to page 217.

Nothing appeared.

When I checked my phone the next morning, my progress was gone there too. The app had reverted to page 22.

Here is what happened under the hood:

1. At `16:06:43`, the phone pushed reading progress to the server: page 217 (48.4%). SQLite saved it immediately.
2. At `16:06:52`, I opened the book on the Kobo.
3. In KOReader, opening a document triggers an internal teardown callback (`ReaderUI:onClose`).
4. Earlier that day, I had hooked into that `onClose` event to push reading progress whenever a reader closed a file. Because the Kobo was just loading the document, its in-memory position still held the stale state from Friday: page 22 (4.9%).
5. The server query was a blind upsert: `ON CONFLICT DO UPDATE SET percentage = excluded.percentage`.
6. The server immediately overwrote the 48.4% phone record with the 4.9% snapshot from the Kobo.
7. A second later, the Kobo finished loading and asked the server for its furthest read point. The server returned 4.9%. Because the local and remote numbers matched, the e-reader never prompted to jump ahead.

Within 900 milliseconds, opening the e-reader had rolled back my progress across every device.

---

## The fix: server monotonicity and reader timing

Fixing the bug took two small changes.

### 1. Enforce monotonicity on the server

Clients will disconnect, crash, or send events out of order. The sync server cannot assume that the latest timestamp represents forward progress. Now the database treats progress as a high-water mark: incoming numbers must be greater than or equal to the existing value unless an explicit reset flag is provided.

```sql
INSERT INTO progress (user_id, document_hash, progress_pct, updated_at)
VALUES (?, ?, ?, datetime('now'))
ON CONFLICT(user_id, document_hash) DO UPDATE SET
  progress_pct = MAX(progress.progress_pct, excluded.progress_pct),
  updated_at = CASE 
    WHEN excluded.progress_pct >= progress.progress_pct THEN datetime('now')
    ELSE progress.updated_at
  END;
```

If an e-reader sends a lower percentage without an override, the server drops the update and preserves the higher number.

### 2. Delay sync queries until the document finishes rendering

E-ink controllers are slow compared to phones. Triggering network requests during UI redraws creates race conditions. I removed the `onClose` network hook and gave KOReader a two-second delay after initial render before querying the server.

When the Kobo wakes up now, it renders the current page, checks the server, detects that the phone is 200 pages ahead, and shows a prompt:

> "You are on page 22 (4.9%). Furthest read location is page 217 (48.4%). Jump to furthest location?"

One tap moves the reader directly to page 217.

![Bookworm Reading Consistency Heatmap](/images/blog/bookworm-reading-heatmap.png)

---

## Personal software in the agentic era

Ultimately, this project is about something broader than reading sync: using AI to build personal software that fits your exact life.

Building software just for yourself used to mean choosing between accepting commercial SaaS constraints or spending dozens of hours maintaining niche personal code. Now, when an off-the-shelf app falls short or locks data behind an unwanted ecosystem, you can pair with an AI agent to build a replacement tailored to how you actually live.

Every page turn on my phone and Kobo feeds back into a local SQLite database on my network. When I finish a book, a background script logs the streak and queries [StoryGraph](https://thestorygraph.com) and [Goodreads](https://www.goodreads.com) for related titles, keeping reading habits private.

![Bookworm AI Recommendations View](/images/blog/bookworm-recommendations-view.png)

If you are writing sync logic for e-ink or mobile devices, treat client events with suspicion. Hardware will fire lifecycle events unexpectedly, and clients will report stale state. Enforce monotonicity on the server so bad reads cannot destroy good data. And if you have been sitting on an idea for personal software that felt too small or tedious to build, try handing it to an agent.
