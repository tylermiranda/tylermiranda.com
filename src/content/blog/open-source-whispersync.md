---
title: "The Day My E-Reader Erased 200 Pages: Building an Open-Source 'Whispersync'"
description: "How a 900ms distributed systems race condition in self-hosted reading sync taught me to enforce strict backend monotonicity across e-ink and web clients."
publishDate: "2026-11-15"
author: "Tyler Miranda"
tags: ["Distributed Systems", "E-Ink", "SQLite", "Offline-First", "KOReader", "PWA"]
ogImage: "/images/blog/bookworm-reading-dashboard.png"
readTime: "5 min read"
---

The single best feature of the Kindle ecosystem isn't the hardware—it's Whispersync. 

You read a chapter on your phone while waiting in line for coffee, pick up your e-reader in bed that night, and you’re seamlessly right where you left off. 

I love e-ink, but I’m actively working to de-cloud my daily life and break away from locked-down vendor ecosystems. So over the weekend, I decided to build my own private, self-hosted reading intelligence and sync stack across my devices.

### The Stack

- **E-Reader**: A Kobo Libra running [KOReader](https://github.com/koreader/koreader) with the slick [ZenOS](https://github.com/xZenLabs/zen-os) minimal UI overlay.
- **Phone Reader**: An offline-first Progressive Web App (PWA) I built for my phone that caches books locally in IndexedDB and runs in true OLED black.
- **Sync Backend**: A lightweight Node.js + SQLite service running 24/7 on my homelab that implements KOReader’s open [KOSync protocol](https://github.com/koreader/koreader/wiki/Sync-Plugin).
- **The AI Teammate**: A local bot running on our homelab agent runtime that tracks reading velocity, builds GitHub-style reading heatmaps, and automatically surfaces book recommendations when a title is finished.

![Bookworm Reading Dashboard](/images/blog/bookworm-reading-dashboard.png)

On paper, this felt like a straightforward afternoon project:
1. Phone sends reading progress to the server.
2. E-reader queries progress from the server.
3. If phone progress > e-reader progress, prompt to jump ahead.

Then reality set in.

---

## The Self-Inflicted Amnesia Loop

I spent Saturday afternoon reading on my phone, knocked out about 200 pages (jumping from page 22 up to page 217 / 48%), and set the phone down.

That night, I climbed into bed, opened the sleepcover on my Kobo, and waited for the magic prompt to jump to page 217.

Nothing happened. 

Worse: when I picked up my phone the next morning, my 200 pages of progress had completely vanished. The phone was back on page 22.

Here is the wild distributed systems race condition that caused it:

1. At `16:06:43`, my phone pushed reading progress to the server: **Page 217 (48.4%)**. Saved cleanly in SQLite.
2. At `16:06:52`, I opened the book on my Kobo.
3. In KOReader, opening a book triggers a quick document teardown under the hood (`ReaderUI:onClose`). 
4. Earlier that day, I had hooked into that `onClose` event to automatically push progress whenever a book closed. But because the e-reader was just starting up, its local position was still sitting at **Page 22 (4.9%)** from yesterday.
5. My server’s database query was a naive upsert: `ON CONFLICT DO UPDATE SET percentage = excluded.percentage`. It blindly trusted whatever device was talking.
6. The server instantly overwrote my 48.4% phone progress with the stale 4.9% from the Kobo.
7. One second later, the Kobo finished loading the document and queried the server: *"Hey, what’s my furthest location?"* The server handed back 4.9%. Because local and remote matched, the e-reader never prompted me.

In 900 milliseconds, opening my e-reader had completely gaslit my entire reading stack.

---

## The Fix: Monotonicity & E-Ink Patience

Fixing this required two architectural adjustments:

### 1. Treat reading progress as a high-water mark (Monotonicity)
Never trust client event ordering or assume clients are well-behaved. The sync server now enforces strict monotonicity: incoming progress must be strictly greater than or equal to what’s already on file. 

If an e-reader sends a lower percentage without an explicit override flag, the server logs a warning, drops the write, and preserves the furthest position:

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

### 2. Give e-ink hardware time to breathe
E-ink screens are slow to refresh. Firing network calls during document transitions is asking for race conditions. We ripped out the premature `onClose` push hook and gave the e-reader a 2-second grace period after the initial page paints before asking the server where it should be. 

Now, when the Kobo wakes up, it smoothly checks the server, notices the phone is 200 pages ahead, and pops up:  
> *"You are on page 22 (4.9%). Furthest read location is page 217 (48.4%). Jump to furthest location?"*

One tap, and you’re right there.

![Bookworm Reading Consistency Heatmap](/images/blog/bookworm-reading-heatmap.png)

---

## Why Building Homelab Systems Beats Cloud Lock-In

Building physical hardware bridges is infinitely more rewarding than consuming proprietary subscription services. 

Now, every page turn on both devices feeds back into a local SQLite database that my local AI bot monitors. When I finish a book, it surfaces reading analytics, logs my reading streak, and runs an offline research job across [StoryGraph](https://thestorygraph.com) and [Goodreads](https://www.goodreads.com) to suggest what to read next—without sending a single byte of my reading habits to an ad broker.

![Bookworm AI Recommendations View](/images/blog/bookworm-recommendations-view.png)

If you’re building local-first sync or hacking on e-ink devices, remember: your devices will fire lifecycle hooks when you least expect them, and they will lie about their state. Always enforce monotonicity on the backend.
