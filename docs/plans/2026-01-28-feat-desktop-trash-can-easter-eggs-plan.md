---
title: "feat: Desktop Trash Can with Easter Eggs"
type: feat
date: 2026-01-28
---

# feat: Desktop Trash Can with Easter Eggs

## Overview

Add a trash can icon in the bottom-right corner of the desktop that opens a window filled with humorous "deleted files." Each file is clickable and reveals funny content mixing developer jokes with references to Office Space, Silicon Valley, Billy Madison, and Happy Gilmore.

## Problem Statement / Motivation

The current portfolio site has a polished desktop OS aesthetic but lacks playful discovery elements that reward curious visitors. A trash can easter egg:
- Adds personality and memorability
- Rewards exploration with humor
- Follows the file system metaphor already established
- Provides a natural place for self-deprecating/creative content

## Proposed Solution

### High-Level Approach

1. Add a trash icon positioned in the bottom-right corner (separate from the main icon column)
2. Clicking opens a standard window with a list of "deleted files"
3. Clicking any file expands it inline to reveal content
4. Content mixes developer humor with movie/TV references

### Visual Mockup

```
┌─────────────────────────────────────────────────────────┐
│                    Desktop                               │
│  ┌──────┐                                               │
│  │ 📄    │                                               │
│  │about │                                               │
│  └──────┘                                               │
│  ┌──────┐                                               │
│  │ 📁    │                                               │
│  │proj/ │                                               │
│  └──────┘                                               │
│  ...                                                    │
│                                                         │
│                                          ┌──────┐       │
│                                          │ 🗑️    │       │
│                                          │trash/│       │
│                                          └──────┘       │
├─────────────────────────────────────────────────────────┤
│ [Start] [Windows...]                      [Tray] 12:00  │
└─────────────────────────────────────────────────────────┘
```

## Technical Approach

### Files to Modify

| File | Change |
|------|--------|
| `src/types/window.ts:12` | Add `'trash'` to WindowId union |
| `src/stores/windows.ts:46` | Add trash window config to `defaultWindows` |
| `src/components/Desktop.tsx` | Add trash icon with bottom-right positioning |
| `src/components/App.tsx:11-18` | Import and register TrashContent |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/TrashContent.tsx` | Main trash window content with file list |
| `src/content/trashItems.ts` | Easter egg data (filenames, icons, content) |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Desktop.tsx                          │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Icon Column     │    │ Trash Icon (bottom-right)   │ │
│  │ (top-left)      │    │ position: absolute          │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              │ onClick → openWindow('trash')
                              ▼
┌─────────────────────────────────────────────────────────┐
│              Window (id='trash')                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │              TrashContent.tsx                      │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ TrashItem (expandable)                     │   │  │
│  │  │ ├─ collapsed: icon + filename              │   │  │
│  │  │ └─ expanded: icon + filename + content     │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ TrashItem (expandable)                     │   │  │
│  │  │ ...                                        │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────┐
│              trashItems.ts                              │
│  export const trashItems = [                            │
│    { id, filename, icon, content }                      │
│  ]                                                      │
└─────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### Functional Requirements

- [x] Trash icon visible in bottom-right corner of desktop (above taskbar)
- [x] Clicking trash icon opens a window titled "trash/"
- [x] Window shows list of 12+ "deleted files" with icons and filenames
- [x] Clicking a file expands it inline to show content
- [x] Clicking expanded file collapses it
- [x] Trash window appears in taskbar when open
- [x] Trash window is draggable like other windows
- [x] Trash window can be minimized/closed

### Content Requirements

- [x] Mix of developer humor items (5-6)
- [x] Mix of movie/TV reference items (5-6)
- [x] Each item has: filename with extension, emoji icon, content text
- [x] Content is genuinely funny/clever, not just placeholders

### Non-Functional Requirements

- [x] Desktop-only feature (not shown on mobile)
- [x] No performance impact (content loaded with component)
- [x] Follows existing code patterns (DesktopIcon, Window, Content components)

## Implementation Steps

### Phase 1: Type & State Setup

**Step 1.1: Add 'trash' to WindowId type**

```typescript
// src/types/window.ts:12
export type WindowId = 'about' | 'projects' | 'skills' | 'resume' | 'contact' | 'welcome' | 'trash';
```

**Step 1.2: Add trash window config**

```typescript
// src/stores/windows.ts - add to defaultWindows
trash: {
  id: 'trash',
  title: 'trash/',
  route: '/trash',
  position: { x: 300, y: 150 },
  size: { width: 500, height: 450 },
},
```

### Phase 2: Create Content Data

**Step 2.1: Create trash items data file**

```typescript
// src/content/trashItems.ts
export interface TrashItem {
  id: string;
  filename: string;
  icon: string;
  content: string;
}

export const trashItems: TrashItem[] = [
  // Developer humor
  {
    id: 'tps-report',
    filename: 'TPS_report_cover_sheet.pdf',
    icon: '📄',
    content: `MEMORANDUM

To: All Employees
From: Management
Re: TPS Report Cover Sheets

It has come to our attention that some employees are not using the new cover sheet for TPS reports. Did you get the memo? We're putting cover sheets on all TPS reports now. If you could just go ahead and do that from now on, that would be great.

And I'm going to need you to come in on Saturday. Thaaanks.`
  },
  {
    id: 'tabs-spaces',
    filename: 'tabs_vs_spaces_final_answer.txt',
    icon: '📝',
    content: `TABS VS SPACES: THE DEFINITIVE ANSWER

After years of research and debate, the answer is...

*file corrupted*

Just kidding. It's tabs. Fight me.

No wait, spaces.

Actually, whoever wrote the codebase first wins.

This file has been deleted 47 times.`
  },
  {
    id: 'startup-idea',
    filename: 'startup_idea_v47_FINAL.doc',
    icon: '💡',
    content: `BILLION DOLLAR IDEA #47

It's like Uber, but for...

[27 pages of pivot strategies redacted]

Okay new plan: It's like Airbnb, but for...

[another 30 pages redacted]

You know what, let me just get a job.`
  },
  {
    id: 'env-backup',
    filename: '.env.backup.old.DONOTDELETE',
    icon: '🔐',
    content: `DATABASE_URL=postgres://admin:hunter2@localhost/mydb
SECRET_KEY=definitely_not_the_real_key_nice_try
API_KEY=sk-REDACTED_BECAUSE_I_LEARNED_MY_LESSON
AWS_SECRET=git-guardian-caught-this-one
STRIPE_KEY=we_dont_have_customers_yet_anyway`
  },
  {
    id: 'todo-2019',
    filename: 'todo_list_2019.txt',
    icon: '✅',
    content: `TODO LIST - 2019
[ ] Learn Docker (how hard can it be?)
[ ] Finish side project
[ ] Update LinkedIn
[ ] Learn Kubernetes
[ ] Start blog
[ ] Contribute to open source
[ ] Finish that side project
[ ] Learn GraphQL
[ ] Seriously finish the side project
[ ] Delete this list and pretend it never existed`
  },
  {
    id: 'git-commits',
    filename: 'git_commit_messages.log',
    icon: '📋',
    content: `commit a1b2c3d - "fixed stuff"
commit d4e5f6g - "WIP"
commit h7i8j9k - "WIP 2"
commit l0m1n2o - "please work"
commit p3q4r5s - "why"
commit t6u7v8w - "asdfasdf"
commit x9y0z1a - "final fix"
commit b2c3d4e - "final fix 2"
commit f5g6h7i - "okay actually final"
commit j8k9l0m - "i give up"
commit n1o2p3q - "jk fixed it"
commit r4s5t6u - "broke it again"
commit v7w8x9y - "friday 5pm commit"`
  },
  // Movie/TV References
  {
    id: 'happy-place',
    filename: 'happy_place_visualization.txt',
    icon: '⛳',
    content: `HAPPY GILMORE'S GUIDE TO FINDING YOUR HAPPY PLACE

Step 1: Close your eyes
Step 2: Go to your happy place
Step 3: Picture yourself at the coding bootcamp
Step 4: Your code compiles on the first try
Step 5: No merge conflicts
Step 6: The tests all pass
Step 7: Stack Overflow has the exact answer you need
Step 8: It's not deprecated

Now open your eyes and... you shanked it into the woods.
The price is WRONG, Bob.`
  },
  {
    id: 'penguin',
    filename: 'business_ethics_penguin.ppt',
    icon: '🐧',
    content: `BUSINESS ETHICS FINAL PRESENTATION
by Billy Madison

The Industrial Revolution changed the way we...

*spins in chair*

...the way we think about ethics and...

*long pause*

...business?

[SLIDE 2: Just a picture of a penguin]

In conclusion: Business. Ethics. Thank you.

Everyone in this room is now dumber for having listened to this.`
  },
  {
    id: 'pivot',
    filename: 'PIVOT_instructions.mov',
    icon: '🎬',
    content: `[TRANSCRIPT FROM DEPLOYMENT MEETING]

DevOps: "Okay, we need to pivot the architecture."
Backend: "PIVOT!"
Frontend: "PIVOT!"
DevOps: "PIVOT!"
Backend: "PIVOTTT!"
PM: "Shut up! SHUT UP! SHUT UPPP!"

[Server crashes]

Backend: "I don't think it's gonna pivot anymore."
DevOps: "You think?"`
  },
  {
    id: 'stapler',
    filename: 'stapler_location_tracker.xlsx',
    icon: '📎',
    content: `RED SWINGLINE STAPLER TRACKING LOG

Day 1: Stapler on desk. All is well.
Day 5: Stapler moved to supply room. Suspicious.
Day 12: Retrieved stapler. Moved desk to basement.
Day 15: They changed my building.
Day 23: I could set the building on fire.
Day 24: Still have stapler though.
Day 30: I was told there would be cake.
Day 31: There was no cake.

Current status: STAPLER SECURED
Threat level: ELEVATED`
  },
  {
    id: 'silicon-valley',
    filename: 'hotdog_not_hotdog.ai',
    icon: '🌭',
    content: `JIAN-YANG'S HOTDOG CLASSIFIER v1.0

Input: [IMAGE]

Processing...
Analyzing...
Running neural network...

Result: NOT HOTDOG

Accuracy: 100%*

*Note: This app only detects hotdogs.
Everything else is "not hotdog."

SEE FOOD? MORE LIKE C-FOOD. I MAKE JOKE.

ERLICH IS FAT AND POOR.`
  },
  {
    id: 'this-guy',
    filename: 'this_guy_fucks.txt',
    icon: '💼',
    content: `PERFORMANCE REVIEW: JARED DUNN

Technical Skills: Adequate
Communication: Excellent
Team Collaboration: Exceptional
Business Operations: Outstanding

Additional Notes:
- Has mysterious past
- May have been involved with international crime syndicate?
- Sleeps in garage (by choice?)
- THIS GUY FUCKS

Overall Rating: Exceeded Expectations

"I've been known to fuck myself." - Jared, probably misquoting something`
  },
];
```

### Phase 3: Create Components

**Step 3.1: Create TrashContent.tsx**

```tsx
// src/components/TrashContent.tsx
import { useState } from 'react';
import { trashItems, type TrashItem } from '../content/trashItems';

function TrashItemRow({ item }: { item: TrashItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-2xl">{item.icon}</span>
        <span className="font-mono text-sm text-gray-700 flex-1">{item.filename}</span>
        <span className="text-gray-400 text-sm">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
          <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
            {item.content}
          </pre>
        </div>
      )}
    </div>
  );
}

export function TrashContent() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-500 font-mono">
          {trashItems.length} items · Emptying trash is disabled
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {trashItems.map((item) => (
          <TrashItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

### Phase 4: Wire Up Components

**Step 4.1: Update Desktop.tsx for trash icon**

Add trash icon with absolute positioning in bottom-right:

```tsx
// In Desktop.tsx, after the icons column div, add:
<div className="absolute bottom-20 right-4">
  <DesktopIcon id="trash" label="trash/" icon="🗑️" />
</div>
```

**Step 4.2: Register in App.tsx**

```tsx
// src/components/App.tsx
import { TrashContent } from './TrashContent';

// Add to windowContents object:
trash: <TrashContent />,
```

## Content: Easter Egg Items

| Filename | Icon | Category | Reference |
|----------|------|----------|-----------|
| TPS_report_cover_sheet.pdf | 📄 | Movie | Office Space |
| tabs_vs_spaces_final_answer.txt | 📝 | Dev | Silicon Valley + general |
| startup_idea_v47_FINAL.doc | 💡 | Dev | Startup culture |
| .env.backup.old.DONOTDELETE | 🔐 | Dev | Security humor |
| todo_list_2019.txt | ✅ | Dev | Self-deprecating |
| git_commit_messages.log | 📋 | Dev | Every developer |
| happy_place_visualization.txt | ⛳ | Movie | Happy Gilmore |
| business_ethics_penguin.ppt | 🐧 | Movie | Billy Madison |
| PIVOT_instructions.mov | 🎬 | TV | Friends + dev |
| stapler_location_tracker.xlsx | 📎 | Movie | Office Space |
| hotdog_not_hotdog.ai | 🌭 | TV | Silicon Valley |
| this_guy_fucks.txt | 💼 | TV | Silicon Valley |

## Success Metrics

- Visitors discover the trash can naturally
- Each item gets a smile or chuckle
- The content feels personal and authentic
- Fits seamlessly with the existing desktop aesthetic

## Dependencies & Risks

**Dependencies:**
- None external - uses existing patterns

**Risks:**
- Low: Content humor is subjective - but that's okay for an easter egg
- Low: Window positioning on different screen sizes - mitigated by standard window behavior

## References

### Internal References
- Design doc: `docs/plans/2026-01-28-personal-site-redesign-design.md`
- Brainstorm: `docs/brainstorms/2026-01-28-desktop-trash-can-brainstorm.md`
- DesktopIcon pattern: `src/components/DesktopIcon.tsx:1-22`
- Window store: `src/stores/windows.ts:4-47`
- WindowId type: `src/types/window.ts:12`
