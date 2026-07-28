# Hearth — Dream Home AI Agent

Design a dream home in 3D with **manual tools**, **text prompts**, and **interior design** once the structure is complete.

## Features

- **Prompt mode** — Describe bedrooms, baths, style, and extras; Hearth generates a 3D floor plan.
- **Manual mode** — Add and size rooms, reposition them, tint walls/floors, toggle roof and wall opacity.
- **Interior mode** — Unlocks after you complete the model. Auto-furnish with style palettes or place items by hand.
  - **Appliances** — Fridge, dishwasher, stove, oven, microwave, range hood, coffee maker, toaster, washer/dryer
  - **Furniture** — Cabinets, island, pantry, stools, tables, and room furniture
  - **Utensils** — Stock kitchen cabinets with plates, bowls, cups, pots, pans, cutlery, spice racks, and more

## Stack

- Next.js (App Router) + TypeScript
- React Three Fiber / Three.js for the 3D studio
- Zustand for client state
- Built-in rule-based design agent (no API key required)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then enter the studio at `/studio`.

## Scripts

| Command         | Description        |
|-----------------|--------------------|
| `npm run dev`   | Development server |
| `npm run build` | Production build   |
| `npm run start` | Start production   |
| `npm run lint`  | ESLint             |

## Example prompts

- “A modern 3-bedroom home with open kitchen, office, and patio”
- “Cozy Scandinavian cottage with 2 bedrooms”
- “Furnish in warm Scandinavian style” (after structure is complete)
