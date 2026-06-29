import { Box3, Mesh, Object3D } from "three";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { ModelStats, SelectedElementInfo, ViewerActions, ViewerStatus } from "../types/viewer";
import { frameBounds, getDefaultCameraPosition, getDefaultCameraTarget } from "../viewer/cameraUtils";
import { createScene } from "../viewer/createScene";
import { disposeModel } from "../viewer/disposeModel";
import { loadIfcModel } from "../viewer/loadIfcModel";
import { clearHighlight, createPicker, highlightSelection } from "../viewer/selection";
import { EmptyState } from "./EmptyState";

interface ViewerCanvasProps {
  file: File | null;
  onStatsChange: (stats: ModelStats | null) => void;
  onSelectionChange: (selection: SelectedElementInfo | null) => void;
  onStatusChange: (status: ViewerStatus) => void;
  status: ViewerStatus;
}

export const ViewerCanvas = forwardRef<ViewerActions, ViewerCanvasProps>(function ViewerCanvas(
  { file, onStatsChange, onSelectionChange, onStatusChange, status },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<ReturnType<typeof createScene> | null>(null);
  const currentModelRef = useRef<Object3D | null>(null);
  const currentModelBoundsRef = useRef<Box3 | null>(null);
  const selectedMeshRef = useRef<Mesh | null>(null);
  const pickerRef = useRef(createPicker());
  const selectionInfoResolverRef = useRef<((expressId: number) => Promise<SelectedElementInfo>) | null>(null);
  const cleanupIfcRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    fitToView: () => {
      const viewer = sceneRef.current;
      const bounds = currentModelBoundsRef.current;
      if (!viewer || !bounds) {
        return;
      }

      const framed = frameBounds(viewer.camera, bounds);
      viewer.camera.position.copy(framed.position);
      viewer.controls.target.copy(framed.target);
      viewer.controls.update();
    },
    resetCamera: () => {
      const viewer = sceneRef.current;
      if (!viewer) {
        return;
      }

      viewer.camera.position.copy(getDefaultCameraPosition());
      viewer.controls.target.copy(getDefaultCameraTarget());
      viewer.controls.update();
    }
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const viewer = createScene(container);
    sceneRef.current = viewer;

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) {
        return;
      }

      const { camera, renderer } = sceneRef.current;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const handlePointerDown = async (event: PointerEvent) => {
      const containerNode = containerRef.current;
      const viewerScene = sceneRef.current;
      const model = currentModelRef.current;
      const resolveSelection = selectionInfoResolverRef.current;

      if (!containerNode || !viewerScene || !model || !resolveSelection) {
        return;
      }

      const result = pickerRef.current.pick(event, containerNode, viewerScene.camera, [model]);
      if (!result || result.expressId === null) {
        clearHighlight(selectedMeshRef.current);
        selectedMeshRef.current = null;
        onSelectionChange(null);
        return;
      }

      highlightSelection(result.mesh, selectedMeshRef.current);
      selectedMeshRef.current = result.mesh;
      const selection = await resolveSelection(result.expressId);
      onSelectionChange(selection);
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      viewer.dispose();
      sceneRef.current = null;
    };
  }, [onSelectionChange]);

  useEffect(() => {
    const viewer = sceneRef.current;
    if (!viewer) {
      return;
    }

    clearHighlight(selectedMeshRef.current);
    selectedMeshRef.current = null;
    onSelectionChange(null);
    onStatsChange(null);
    selectionInfoResolverRef.current = null;
    cleanupIfcRef.current?.();
    cleanupIfcRef.current = null;

    if (currentModelRef.current) {
      viewer.scene.remove(currentModelRef.current);
      disposeModel(currentModelRef.current);
      currentModelRef.current = null;
      currentModelBoundsRef.current = null;
    }

    if (!file) {
      onStatusChange({ isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    onStatusChange({ isLoading: true, error: null });

    loadIfcModel(file)
      .then((loaded) => {
        if (cancelled) {
          loaded.dispose();
          disposeModel(loaded.model);
          return;
        }

        viewer.scene.add(loaded.model);
        currentModelRef.current = loaded.model;
        currentModelBoundsRef.current = new Box3().setFromObject(loaded.model);
        selectionInfoResolverRef.current = loaded.getSelectionInfo;
        cleanupIfcRef.current = loaded.dispose;
        onStatsChange(loaded.stats);
        onStatusChange({ isLoading: false, error: null });

        const framed = frameBounds(viewer.camera, currentModelBoundsRef.current);
        viewer.camera.position.copy(framed.position);
        viewer.controls.target.copy(framed.target);
        viewer.controls.update();
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "The IFC file could not be parsed by the demo viewer.";
        onStatusChange({ isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [file, onSelectionChange, onStatsChange, onStatusChange]);

  return (
    <section className="viewer-shell">
      <div ref={containerRef} className="viewer-canvas" />
      {status.isLoading || status.error || !file ? <EmptyState loading={status.isLoading} error={status.error} /> : null}
      <div className="viewer-badge">
        <span>Local-only processing</span>
        <span>No backend</span>
        <span>No upload</span>
      </div>
      <div className="viewer-tip">
        Drag with the mouse to orbit, pan, and inspect the model. Click geometry to load properties.
      </div>
    </section>
  );
});
