# Gachi Café 🐱☕

Mobile-first ordering demo for a cat-themed coffee shop.

- **Customer:** browse menu → customise & add to cart → place order → get a queue number and live status
- **Staff:** see all of today's orders and move them through `new → making → ready → done`

## Tech stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) for routing
- Plain CSS, one file per component, [BEM](https://getbem.com) class names
- ESLint + Prettier

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173 (also exposed on your LAN for testing on a phone)
```

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start the dev server           |
| `npm run build`   | Production build into `dist/`  |
| `npm run preview` | Preview the production build   |
| `npm run lint`    | Run ESLint                     |
| `npm run format`  | Format all files with Prettier |

## Routes

| Path              | Page                        |
| ----------------- | --------------------------- |
| `/`               | Menu (customer)             |
| `/queue/:orderId` | Queue number & order status |
| `/staff`          | Staff order board           |

## Project structure

```
src/
├── main.jsx                 # Entry: global styles, router, providers
├── App.jsx                  # Route definitions
├── components/
│   ├── common/              # Reusable UI (BottomSheet, Toast, QuantityStepper, …)
│   ├── menu/                # Customer menu & cart
│   ├── queue/               # Queue ticket & order summary
│   └── staff/               # Staff board
├── pages/                   # One component per route
├── context/                 # Cart state (Context + reducer)
├── hooks/                   # Custom hooks (useCart, useOrders, useToast, …)
├── services/
│   └── orderService.js      # Order data layer (the only place that touches storage)
├── constants/               # Order statuses, order types, storage keys
├── data/
│   └── menu.js              # Menu items, categories, option groups
├── utils/                   # Pure helpers (formatting, pricing, storage, …)
└── styles/
    └── global.css           # Design tokens, reset, shared UI primitives
```

### Conventions

- Components: `PascalCase.jsx` with a matching `PascalCase.css` next to it.
- Hooks: `useSomething.js`. Utilities and services: `camelCase.js`.
- All colours, radii and shadows come from the CSS variables in `styles/global.css`.
- Code is in English; user-facing text is in Thai.
- Import from `src` with the `@/` alias, e.g. `import { useCart } from '@/hooks/useCart'`.

## Editing the menu

Everything lives in [`src/data/menu.js`](src/data/menu.js): add an object to `MENU_ITEMS`
and pick which `OPTION_GROUPS` apply to it.

The auto-sliding banner at the top of the menu is configured in
[`src/data/promotions.js`](src/data/promotions.js) — each slide is either an `item` card (linked to a menu item by `itemId`)
or a full-bleed `image` banner. Put banner images in `src/assets/promotions/`
(recommended 1200 × 480 px JPG/WebP, under 200 KB) and import them in that file.

## Data storage (demo limitation)

Orders are stored in the browser's `localStorage`, so customer and staff screens only stay
in sync **between tabs on the same device**. To run it across devices, replace the internals of
[`src/services/orderService.js`](src/services/orderService.js) with a real backend
(e.g. Supabase); the UI only depends on that file's exported functions.

## Deployment

The app uses `BrowserRouter`, so the host must serve `index.html` for unknown paths
(SPA fallback). Vercel and Netlify handle this with a one-line rewrite rule.
