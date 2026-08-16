# Surprise Me 🌴

A cocktail finder: tell it which ingredients you have, and it shows you drinks you can make — putting the ones you can make *right now* first, and "almost there" drinks (missing an ingredient or two) below.

This is the **frontend** (React + Vite). It talks to a separate backend API — see [Backend](#backend).

## Features

- **Build an inventory** of ingredients as removable chips, with autocomplete suggestions and full keyboard navigation (↑/↓ to highlight, Enter to pick).
- **Results grouped by makeability** — a "Ready to make" section first, then "Almost there" cards that show exactly which ingredients you're missing.
- **Pantry staples are assumed** — the backend treats salt, ice, water, sugar, pepper, lime and egg as always on hand, so a drink isn't flagged as un-makeable just because it needs salt.
- **Your inventory persists** across visits via `localStorage`.
- **Graceful image fallback** — a themed placeholder shows if a drink photo fails to load.
- **Responsive, sunset-themed UI** with a frosted-glass panel and subtle animated background art. No UI framework — just hand-written CSS.

## Tech stack

- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- Plain CSS (design tokens via CSS custom properties)
- ESLint + Prettier

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ (Vite 6 requirement).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev
```

### Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint |

## Backend

The app fetches cocktails from a separate service, [`cocktails.nodejs`](https://github.com/MachoBandido08/cocktails.nodejs) — an Express + SQLite API hosted on Render.

- **Endpoint:** `GET /drinks/:ingredients` where `:ingredients` is a comma-separated, URL-encoded list.
- **Example:** `/drinks/tequila,triple%20sec` returns drinks ranked by how much of each you can make, annotated with `makeable` and `missing` fields.

The API base URL is currently set inline in [`src/App.jsx`](src/App.jsx). To point at a local backend, change that URL (moving it to a `.env` variable via `import.meta.env` is a natural improvement).

## Project structure

```
src/
├── App.jsx          # Main component: search, inventory, results
├── App.css          # All styling (theme tokens, layout, components)
├── ingredients.js   # Static list of common ingredients for suggestions
├── PalmIcon.jsx     # The title's palm-tree SVG
└── main.jsx         # React entry point
public/
└── decor/           # Background motif SVGs (citrus, leaf, glass, bottle)
```

## Notes

- Drink images are **hot-linked** from external sources, so some may 404 — the placeholder handles that. Self-hosting the images would be more robust but has licensing considerations.
- Ingredient matching is whole-word, so "gin" matches "Gin" but not "oriGINal".
