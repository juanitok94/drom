# Dröm Field Guide

> An interactive portfolio of spaces shaped by Dröm Construction across Asheville and Western North Carolina.

This is **not a standard website** — it's an interactive portfolio object. Part map, part field guide, part project database, part sales/proof engine. The first user is the Dröm team itself; eventually it gets shown to qualified prospects.

![Status](https://img.shields.io/badge/version-0.1-A8331F)
![Next.js](https://img.shields.io/badge/Next.js-14-1C1A17)
![TypeScript](https://img.shields.io/badge/TypeScript-5-1C1A17)
![Tailwind](https://img.shields.io/badge/Tailwind-3-1C1A17)

---

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploy to Vercel

1. Push to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Defaults work — no env vars needed.

---

## The big idea

**Internal Mode** vs **Prospect Mode** — the same data, two audiences.

- **Internal Mode** (default): shows everything — internal notes, source confidence, visibility flags, "needs confirmation" lists. For the Dröm team and PKDO.
- **Prospect Mode**: filters out anything not marked `prospect-safe`, hides internal notes, surfaces polished public summary + buyer signal. For eventual external use.

Toggle it from the top right. Try the same project in both modes.

## What's in here

- **Stylized "field" map** — corridor clusters laid out on a paper-grain canvas with a hand-drawn river and dashed corridors. Not Google Maps. Pure portfolio object.
- **Real map toggle** — Leaflet + CartoDB Positron tiles (no API key, no env vars). Projects without coordinates show a polite "not yet plotted" notice.
- **Right slide-out drawer** for project detail, with status, capabilities, buyer signal, and (in Internal Mode) an auto-generated "Confirmation Needed" checklist that lists every empty field for that project.
- **Filter chips** with live counts, plus free-text search across name, address, capabilities, notes, and prospect tags.
- **Stats bar** — quick read on completed / current build / needs confirmation counts.
- **Export** — download the currently filtered set as JSON or CSV. Useful for sending Brian a list to confirm.
- **URL state** — filter, mode, map view, and selected project are all in the URL. Shareable views work out of the box.
- **Sector patterns** — each sector has its own hand-drawn SVG pattern (wine-glass diamonds for hospitality, coffee beans for cafes, blueprint hatch for commercial up-fits, etc). Projects without photography don't feel empty — they feel intentional.

## Adding projects

Edit `src/data/drom-projects.json`. Each record:

```json
{
  "id": "kebab-case-id",
  "name": "Project Name",
  "address": "123 Some St, Asheville, NC",
  "neighborhood": "West Asheville",
  "corridor": "haywood-road",
  "lat": 35.5784,
  "lng": -82.5928,
  "status": "completed",
  "visibility": "prospect-safe",
  "featured": true,
  "sector": "hospitality",
  "categories": ["hospitality", "restaurant-bar"],
  "capabilities_shown": ["hospitality buildout", "commercial up-fit"],
  "prospect_relevance": ["restaurant owner", "hospitality operator"],
  "buyer_signal": "One-liner that explains the proof.",
  "public_summary": "Polished, prospect-safe paragraph.",
  "internal_notes": "Anything Dröm needs to confirm internally.",
  "source_confidence": "high"
}
```

Refresh — it shows up everywhere.

## Design language

The visual direction takes cues from [Atlas Branding](https://www.atlasbranding.com/) (Asheville). Key choices:

- **Editorial italic accents** (Instrument Serif) inside otherwise plain headings — Atlas's signature voice (e.g., "Dröm *Field* Guide", "Built work across *Western North Carolina*").
- **Single accent color** — `ember` (#A8331F), an Atlas-style restrained red — used sparingly for current builds, buyer-signal pull-quotes, and headline emphasis.
- **Warm cream / paper palette** — `cream`, `paper`, `bone`, against `ink` and `charcoal`. Subtle paper-grain SVG noise overlay on key surfaces.
- **Inter for body, Instrument Serif for display** — clean reading, characterful headlines.
- **Tiny caps labels** (`.label-caps`, 0.24em tracking) for section markers — pulls from architectural/field-guide tradition.

## File structure

```
/app
  layout.tsx        — fonts, metadata, global CSS
  page.tsx          — entry point
  globals.css       — base styles, paper grain, scrollbars

/src
  /components
    FieldGuideShell.tsx   — main app composition + URL state
    StylizedMap.tsx       — corridor cluster canvas
    RealMap.tsx           — Leaflet map (client-only via dynamic import)
    ProjectDrawer.tsx     — right slide-out detail
    ProjectCard.tsx       — index card
    SectorPattern.tsx     — SVG patterns per sector
    FilterBar.tsx         — chip filters with counts
    ModeToggle.tsx        — Internal/Prospect switch
    SearchInput.tsx       — free-text search
    StatsBar.tsx          — counts dashboard

  /data
    drom-projects.json    — seed data

  /lib
    utils.ts              — labels, filters, search, CSV export

  /types
    project.ts            — TS types
```

## Assumptions made

- **Coordinates** for Leo's, There There, Rowan, Golden Pineapple, and Pho Haus were approximated from addresses. Confirm exact pin placement with Brian.
- **Finest Sandwiches** is included as a `needs-confirmation` record with no address — surfaces correctly in the "Needs Confirmation" filter and the "Unknown" cluster on the stylized map.
- The "Dröm scope" for Rowan Coffee is marked medium-confidence and needs confirmation.
- Leaflet uses CartoDB's Positron light tiles — no API key, no signups, free for prototype use.

## Next recommended improvements

1. **Real project photography** — wire `image_urls[]` to actual images (Vercel Blob, Cloudinary, or a simple `/public/projects/` folder).
2. **Add `capability` and `client-type` filters** as their own dimension (currently rolled into category chips).
3. **"Send to Brian" workflow** — a button per project that opens a pre-filled email with the auto-generated "Confirmation Needed" list.
4. **Compare mode** — pin 2–3 projects side by side for sales conversations.
5. **Print/PDF view** — a clean printable layout of the current filtered set for in-person pitches.
6. **CMS layer** — when the data shape stabilizes, move JSON to Sanity or Notion so non-engineers can edit.

---

**Tone reminder for future edits**: concise, polished, Atlas-flavored. No hype. "Built work across Western North Carolina." "Each project is a proof point." Avoid the words *passionate*, *innovative*, *solutions*, *leverage*, *excited*. Use editorial italics for emphasis, not bold.
