import type { ChangeEvent } from "react";

interface HeaderProps {
  onFileChange: (file: File | null) => void;
  onResetCamera: () => void;
  onFitToView: () => void;
  isBusy: boolean;
}

export function Header({ onFileChange, onResetCamera, onFitToView, isBusy }: HeaderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Clean-room portfolio case study</p>
        <h1>Open IFC Viewer Case Study</h1>
        <p className="header-copy">
          Load a local IFC file in the browser, inspect geometry, and review object data without uploading anything to a server.
        </p>
      </div>

      <div className="header-actions">
        <label className="button button-primary">
          <input type="file" accept=".ifc" onChange={handleChange} hidden />
          Upload IFC
        </label>
        <button type="button" className="button" onClick={onFitToView} disabled={isBusy}>
          Fit model
        </button>
        <button type="button" className="button" onClick={onResetCamera} disabled={isBusy}>
          Reset camera
        </button>
      </div>
    </header>
  );
}
