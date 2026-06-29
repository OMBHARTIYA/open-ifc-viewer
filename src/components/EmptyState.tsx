interface EmptyStateProps {
  loading: boolean;
  error: string | null;
}

export function EmptyState({ loading, error }: EmptyStateProps) {
  if (loading) {
    return (
      <div className="empty-state">
        <h2>Loading IFC model</h2>
        <p>Parsing geometry and preparing the scene. Large models can take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state error-state">
        <h2>Unable to load this IFC file</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <h2>Drop in a local IFC file to begin</h2>
      <p>
        The viewer runs entirely in the browser. Use your own test model or a public sample file from an official demo source.
      </p>
    </div>
  );
}
