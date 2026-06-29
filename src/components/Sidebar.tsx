import type { ModelStats, SelectedElementInfo } from "../types/viewer";
import { ModelStats as ModelStatsPanel } from "./ModelStats";
import { PropertiesPanel } from "./PropertiesPanel";

interface SidebarProps {
  stats: ModelStats | null;
  selection: SelectedElementInfo | null;
}

export function Sidebar({ stats, selection }: SidebarProps) {
  return (
    <aside className="sidebar">
      <ModelStatsPanel stats={stats} />
      <PropertiesPanel selection={selection} />
    </aside>
  );
}
