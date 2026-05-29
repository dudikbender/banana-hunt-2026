# Banana Hunt 2026

A mobile-first scavenger hunt around Fenway Park. Hunt for bananas on the map, peel them when you visit a spot, and track your progress as you explore.

Built for **Boston Banana Hunt 2026: Going Yard** — locations center on the Cisco Brewing outpost with stops at nearby bars and venues.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Mapbox GL** — full-screen interactive map with custom style
- **Zustand** — map viewport, hunt progress, and participant state
- **shadcn/ui** — dialog, card, button, inputs
- **Resend** — optional mailing-list signup when participants provide an email
- **Tailwind CSS v4**

## Features

- Full-screen Mapbox map centered on the hunt area
- **Outpost** marker (home icon) at Cisco Brewing — not listed in the sidebar
- **Banana** markers for each hunt location — tap to open **Unpeel** / **Refresh**
- Peeled bananas turn brown and flip upside down; progress persists in the hunt store
- Live **user location** dot on the map (browser geolocation)
- Collapsible bottom panel on mobile; full-height location list when expanded
- Join dialog collects name (required) and email (optional)
- Email subscribers are added to a Resend segment via `/api/participants/subscribe`
- **Log out** clears participant data, hunt progress, and resets the map to the outpost

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Yes | [Mapbox access token](https://account.mapbox.com/access-tokens/) |
| `RESEND_API_KEY` | No* | [Resend API key](https://resend.com/api-keys) |
| `RESEND_SEGMENT_ID` | No* | Segment ID from Resend Dashboard → Segments |

\*Required only if you want email signups synced to Resend. Without them, participants can still join; mailing-list subscription is skipped.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Allow location access when prompted to see your position on the map.

## Project structure

```
src/
├── app/
│   ├── api/participants/subscribe/   # Resend audience API route
│   └── page.tsx                    # Map + panel + join dialog
├── components/
│   ├── map/                        # Map, markers, location panel
│   ├── participant/                # Join dialog
│   └── ui/                         # shadcn components
├── data/locations.ts               # Outpost + hunt stop coordinates
├── lib/                            # Map markers, Resend, subscribe client
└── stores/
    ├── map-store.ts                # Viewport, selection, user location
    ├── hunt-store.ts               # Visited / unvisited locations
    └── participant-store.ts        # Name, email (persisted to localStorage)
```

## Adding or editing locations

Edit `src/data/locations.ts`:

- `HOME_LOCATION` — the outpost (map only, house icon)
- `HUNT_LOCATIONS` — banana stops shown in the panel and on the map

Each location needs `id`, `name`, `description`, `longitude`, and `latitude`.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Deploy

Deploy to [Vercel](https://vercel.com) or any Node host that supports Next.js. Set the same environment variables in your hosting provider's dashboard.
