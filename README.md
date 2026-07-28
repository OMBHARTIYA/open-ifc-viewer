# Open IFC Viewer Case Study

Open IFC Viewer Case Study is a clean-room, browser-based IFC model viewer built for portfolio and learning purposes.

The project demonstrates how a web application can load a local IFC file, render it in a 3D viewport, support basic object selection, and display model/object information in a dashboard-style interface.

## Reviewer Value

This repo is designed to show the public-safe version of my BIM/model-linked reporting skills:

- local IFC loading without server upload
- browser-based 3D scene setup and navigation
- selected-object inspection and model statistics
- dashboard-style UI around model data
- privacy-first architecture for sensitive construction files

The purpose is to demonstrate the viewer architecture and model-inspection workflow without publishing employer models, client assets, internal APIs, or confidential dashboard logic.

## Clean-Room Disclaimer

This project was created from scratch as a portfolio case study.

It does not contain employer-owned source code, confidential implementation details, real company project files, real BIM models, real API endpoints, customer-owned operational records, real project identifiers, private screenshots, or internal architecture from any company system.

The project is inspired only by the general concept of a web-based IFC/BIM viewer.

## Data and Privacy Disclaimer

IFC files are loaded and parsed in the browser, and the selected model file is
not uploaded to a server. The app does not use a backend, database, telemetry,
or project-data API. It currently downloads the open-source `web-ifc`
WebAssembly runtime from `unpkg.com`, so an internet connection is required
unless that runtime is self-hosted.

## Features

- Local IFC file upload
- Browser-based 3D model viewing
- Orbit camera controls
- Grid and axes helpers
- Object selection and highlighting
- Basic properties panel
- Model statistics panel
- Reset camera button
- Fit model to view button
- Loading and error states
- Responsive dashboard-style UI
- No application backend required
- Model file remains in the browser

## Proof for Reviewers

- [Architecture summary](./docs/architecture.md): component and rendering-layer overview.
- [Verification notes](./docs/verification.md): build command, reviewable files, and confidentiality controls.
- [Clean-room note](./docs/clean-room-note.md): what is intentionally excluded from the public repo.

## Tech Stack

- Vite
- React
- TypeScript
- Three.js
- Open-source IFC loading library
- Plain CSS

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
