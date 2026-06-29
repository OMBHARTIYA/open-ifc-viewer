import type { ModelStats as ModelStatsType } from "../types/viewer";
import { formatBytes } from "../utils/formatBytes";

interface ModelStatsProps {
  stats: ModelStatsType | null;
}

export function ModelStats({ stats }: ModelStatsProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Model statistics</p>
        <h2>Overview</h2>
      </div>

      {stats ? (
        <dl className="stats-grid">
          <div>
            <dt>File</dt>
            <dd>{stats.fileName}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{formatBytes(stats.fileSizeBytes)}</dd>
          </div>
          <div>
            <dt>Elements</dt>
            <dd>{stats.entityCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Meshes</dt>
            <dd>{stats.meshCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Width</dt>
            <dd>{stats.bounds.x} m</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>{stats.bounds.y} m</dd>
          </div>
          <div>
            <dt>Depth</dt>
            <dd>{stats.bounds.z} m</dd>
          </div>
        </dl>
      ) : (
        <p className="panel-placeholder">Upload a model to see file size, element counts, and rough model extents.</p>
      )}
    </section>
  );
}
