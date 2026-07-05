# Verification Notes

This repo is intended to provide public, clean-room proof of front-end/BIM viewer skills without exposing private project files or employer assets.

## What Reviewers Can Verify

| Area | Evidence |
| --- | --- |
| React application structure | `src/App.tsx`, `src/components/*` |
| TypeScript modeling | `src/types/viewer.ts` |
| Three.js scene setup | `src/viewer/createScene.ts` |
| IFC loading boundary | `src/viewer/loadIfcModel.ts` |
| Object selection flow | `src/viewer/selection.ts` |
| Safe property rendering | `src/utils/safeProperties.ts` |
| Model cleanup | `src/viewer/disposeModel.ts` |

## Local Checks

```bash
npm install
npm run build
```

Expected result: TypeScript compilation and Vite production build complete successfully.

Last local check:

- Date: 2026-07-06
- Command: `npm run build`
- Result: Passed
- Note: Vite reports a large JavaScript bundle because IFC and Three.js viewer dependencies are heavy. For a production viewer, the next optimization would be route-level or loader-level code splitting.

## Privacy and Confidentiality Controls

- IFC files are selected locally in the browser.
- No model file is uploaded to a server.
- No backend, database, telemetry, or external project API is used.
- No real employer model, client data, internal source code, production screenshot, or proprietary workflow is included.

## Portfolio Value

This project demonstrates that I can translate construction/BIM-style operational needs into a usable browser interface: model loading, navigation, selection feedback, model statistics, and dashboard-style supporting panels.
