export type PropertyRecord = Record<string, string | number | boolean | null>;

export interface SelectedElementInfo {
  expressId: number;
  name?: string;
  type?: string;
  properties: PropertyRecord;
}

export interface ModelStats {
  fileName: string;
  fileSizeBytes: number;
  entityCount: number;
  meshCount: number;
  bounds: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ViewerStatus {
  isLoading: boolean;
  error: string | null;
}

export interface ViewerActions {
  fitToView: () => void;
  resetCamera: () => void;
}
