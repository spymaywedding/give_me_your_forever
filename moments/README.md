# Moments gallery — manifest.json

Every photo in the "Moments" slider on the wedding site is listed in `manifest.json`.
The site does NOT read this folder automatically — whenever you add or remove a photo
file here, you must also update `manifest.json` to match, or it won't show up.

## Format

```json
[
  { "file": "1.jpg", "position": "center 30%" },
  { "file": "6.jpg", "order": 1 },
  { "file": "2.jpg" }
]
```

- `"file"` — the image filename in this folder (required).
- `"order"` — optional. Give a photo a fixed position (1 = first slide, 2 = second, ...).
  Leave it out and the photo's position is shuffled randomly each time someone
  opens the page, mixed in around whichever photos ARE pinned.
- `"position"` — optional. Nudges which part of the photo is visible inside the
  slide's crop, using a CSS `object-position` value: `"horizontal% vertical%"`.
  Default is `"center center"` (50% 50%).
  - Lower the vertical number (e.g. `"center 30%"`) to shift the crop **up**
    (shows more of the top of the photo, crops more off the bottom).
  - Raise it (e.g. `"center 70%"`) to shift the crop **down**.
  - Lower the horizontal number to shift **left**, raise it to shift **right**.

## Adding a new photo

1. Drop the image file into this `moments/` folder (keep file sizes reasonable —
   ask Claude to resize/compress if it's more than a couple MB).
2. Add a line to `manifest.json`: `{ "file": "yourfile.jpg" }` (unpinned/random)
   or `{ "file": "yourfile.jpg", "order": 3 }` (pinned to slide #3).
3. Save. Refresh the site — no other changes needed.

## Removing a photo

Delete its entry from `manifest.json` (the image file itself can stay or go).
