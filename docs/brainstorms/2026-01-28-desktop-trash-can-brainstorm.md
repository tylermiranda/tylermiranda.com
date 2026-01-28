# Desktop Trash Can with Easter Eggs

**Date:** 2026-01-28
**Status:** Ready for planning

## What We're Building

A trash can icon in the bottom-right corner of the desktop that opens a window filled with funny "deleted files." Each file is clickable and reveals humorous content mixing developer jokes with references to Office Space, Silicon Valley, Billy Madison, Happy Gilmore, and other favorites.

## Why This Approach

- **Standard trash window** fits the existing window system and UX patterns
- **Bottom-right placement** follows OS conventions - visitors will naturally find it
- **Click to open** keeps discovery simple - no hidden interactions needed
- **10+ items with content** rewards curious visitors with depth

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Purpose | Pure easter egg / fun | Rewards curious visitors |
| Position | Bottom-right corner | Classic OS placement |
| Discovery | Single click opens | Simple, intuitive |
| Item count | 10+ items | Lots to discover |
| Content depth | All clickable with content | Full payoff for curiosity |
| Tone | Mix of dev humor + movie/TV refs | Variety, personality |

## Easter Egg Categories

### Fake Deleted Files (Developer Humor)
- `world_domination_plan.txt` - Comically vague startup pitch
- `definitely_not_a_virus.exe` - ASCII art or silly "scanning" animation
- `my_startup_idea_v47.doc` - Increasingly desperate pivot ideas
- `todo_list_2019.txt` - Hilariously outdated priorities
- `.env.backup.old.DONOTDELETE` - Fake credentials (hunter2 style)

### Movie/TV References
- `TPS_report_cover_sheet.pdf` - Office Space memo about the cover sheet
- `tabs_vs_spaces.txt` - Silicon Valley debate transcript
- `pivot_instructions.mov` - Friends reference, or actual pivot strategy doc
- `business_plan_penguin.ppt` - Billy Madison academic decathlon vibes
- `happy_place.txt` - Happy Gilmore visualization guide
- `this_is_my_stapler.png` - Red Swingline reference

### Self-Aware / Meta
- `resume_final_FINAL_v3_USETHISONE.pdf` - Every dev's nightmare
- `why_i_mass_applied.txt` - Honest job search confessions
- `imposter_syndrome.log` - Console output of self-doubt
- `git_commit_messages.txt` - "fixed stuff", "please work", "asdfasdf"

## Implementation Notes

### Components Needed
1. **Trash icon** - Bottom-right positioned, uses existing DesktopIcon pattern
2. **TrashContent.tsx** - Window content showing file list
3. **TrashItem preview** - Modal or nested view for file contents
4. **New window type** - Add 'trash' to WindowId union

### File Structure
```
src/
├── components/
│   ├── TrashContent.tsx      # Main trash window content
│   └── TrashItemPreview.tsx  # Individual item content viewer
├── content/
│   └── trashItems.ts         # Easter egg data and content
└── types/
    └── window.ts             # Add 'trash' to WindowId
```

### Visual Style
- Trash icon: 🗑️ emoji (matches existing icon style)
- Window layout: Grid or list of "files" with icons and names
- Item preview: Could be inline expansion or modal overlay
- File icons: Mix of 📄📁💾📋🖼️ to match "file types"

## Open Questions

1. Should the trash can appear "full" (with paper sticking out) vs "empty"?
2. Any specific quotes from the movies you want included verbatim?
3. Should items have "dates deleted" for added realism?

## Success Criteria

- Visitors discover the trash can naturally
- Each item gets a smile or chuckle
- The content feels personal and authentic to your sense of humor
- Fits seamlessly with the existing desktop aesthetic
