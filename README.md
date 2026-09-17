# Nodemic

A browser-based workbench for building and sharing epidemic models.

Design your own compartment model on a visual canvas, adjust parameters with live sliders, and watch the simulation update instantly. Every model can be shared as a link, forked, or embedded.

> **Status:** Early development. Landing page and navigation are live. The editor MVP is in progress.

## Features

**MVP (in progress)**
- Visual model builder: add compartments and transitions as nodes and edges
- Live simulation with parameter sliders
- Share links, forking, and embeds
- Public model library

**Planned**
- TBD

## Tech Stack

- [Next.js](https://nextjs.org/) + React + TypeScript
- [React Flow](https://reactflow.dev/) for the model canvas
- Client-side ODE simulation in TypeScript (planned)
- [Supabase](https://supabase.com/) for model storage and share links (planned)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/<your-username>/nodemic.git
cd nodemic
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/            # Pages and routes
components/     # Shared/reusable components (Navbar, Footer, etc.)
lib/            # Helper functions (Math, equations, etc.)
public/         # Static assets
```

## How It Works

You build a model on the canvas by adding compartments (e.g. S, I, R) as nodes and connecting them with flows as edges. Each flow has a rate, like how fast susceptible people become infected.

That canvas is saved as JSON, which is what gets stored and shared.

To run the simulation, Nodemic reads the model and turns each compartment into an ordinary differential equation. A compartment changes based on what flows into it and what flows out of it. The equations are solved in the browser, so the chart updates as soon as you move a parameter slider.

See the Methods page in the app for details on the numerical methods used.

## Roadmap

- [x] Landing page and navbar
- [ ] Visual model editor
- [ ] Live simulation
- [ ] Share / fork / embed
- [ ] Public model library
- [ ] Data fitting
