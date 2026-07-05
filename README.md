# Open IFC Viewer Demo

Open IFC Viewer Demo is a clean-room, browser-based IFC model viewer built for portfolio and learning purposes.

The project demonstrates how a web application can load a local IFC file, render it in a 3D viewport, support basic object selection, and display model/object information in a dashboard-style interface.

## Clean-Room Disclaimer

This project was created from scratch as a portfolio demo.

It does not contain employer-owned source code, confidential implementation details, real company project files, real BIM models, real API endpoints, real client data, real project identifiers, private screenshots, or internal architecture from any company system.

The project is inspired only by the general concept of a web-based IFC/BIM viewer.

## Data and Privacy Disclaimer

IFC files are loaded locally in the browser. This demo does not upload model files to a server. It does not use a backend, database, telemetry, or external API for model processing.

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
- No backend required
- No model upload required

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
