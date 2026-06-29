# Architecture Summary

The app is organized into three layers:

```text
React UI Components
        ↓
Viewer Utilities
        ↓
Three.js / IFC Loader
```

The React layer handles layout, upload controls, dashboard panels, loading states, and selection-driven UI updates.

The viewer utilities layer owns scene creation, camera framing, selection highlighting, IFC loading, and model disposal.

The rendering layer uses Three.js together with an open-source IFC loader so models can be rendered entirely in the browser.
