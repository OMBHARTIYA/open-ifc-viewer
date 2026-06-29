import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ViewerCanvas } from "./components/ViewerCanvas";
import type { ModelStats, SelectedElementInfo, ViewerActions, ViewerStatus } from "./types/viewer";

const INITIAL_STATUS: ViewerStatus = {
  isLoading: false,
  error: null
};

export default function App() {
  const viewerRef = useRef<ViewerActions | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [selection, setSelection] = useState<SelectedElementInfo | null>(null);
  const [status, setStatus] = useState<ViewerStatus>(INITIAL_STATUS);

  return (
    <div className="app-shell">
      <div className="app-backdrop" />
      <Header
        onFileChange={setFile}
        onFitToView={() => viewerRef.current?.fitToView()}
        onResetCamera={() => viewerRef.current?.resetCamera()}
        isBusy={status.isLoading}
      />

      <main className="app-layout">
        <ViewerCanvas
          ref={viewerRef}
          file={file}
          status={status}
          onStatsChange={setStats}
          onSelectionChange={setSelection}
          onStatusChange={setStatus}
        />
        <Sidebar stats={stats} selection={selection} />
      </main>
    </div>
  );
}
