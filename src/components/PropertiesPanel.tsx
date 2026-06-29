import type { SelectedElementInfo } from "../types/viewer";

interface PropertiesPanelProps {
  selection: SelectedElementInfo | null;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Properties</p>
        <h2>Selected object</h2>
      </div>

      {selection ? (
        <>
          <div className="selection-meta">
            <span>Express ID: {selection.expressId}</span>
            {selection.name ? <span>Name: {selection.name}</span> : null}
            {selection.type ? <span>Type: {selection.type}</span> : null}
          </div>
          <dl className="properties-list">
            {Object.entries(selection.properties).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="panel-placeholder">Click a model element in the viewport to inspect its available IFC properties.</p>
      )}
    </section>
  );
}
