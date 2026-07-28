# Hearth — Dream Home AI Agent

Design a dream home in 3D with **manual tools**, **text prompts**, and **interior design** once the structure is complete.

## Features

- **Prompt mode** — Describe bedrooms, baths, style, and extras; Hearth generates a 3D floor plan.
- **Manual mode** — Add and size rooms, reposition them, tint walls/floors, toggle roof and wall opacity.
- **Interior mode** — Unlocks after you complete the model. Auto-furnish with style palettes (Scandinavian, coastal, industrial, etc.) or place furniture by hand.

## Stack

- Next.js (App Router) + TypeScript
- React Three Fiber / Three.js for the 3D studio
- Zustand for client state
- Built-in rule-based design agent (no API key required)

## Run locally

```bash
cd dream-home-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then enter the studio.

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm run dev`  | Development server |
| `npm run build`| Production build   |
| `npm run start`| Start production   |
| `npm run lint` | ESLint             |

## Example prompts

- “A modern 3-bedroom home with open kitchen, office, and patio”
- “Cozy Scandinavian cottage with 2 bedrooms”
- “Furnish in warm Scandinavian style” (after structure is complete)
