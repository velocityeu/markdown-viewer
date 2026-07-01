import { FilesIcon, SearchIcon, SettingsIcon } from "./icons";

export type ActivityView = "explorer" | "search" | "settings";

interface ActivityBarProps {
  activeView: ActivityView;
  explorerCollapsed: boolean;
  onToggleExplorer: () => void;
  onChangeView: (view: ActivityView) => void;
  onOpenSettings: () => void;
}

export function ActivityBar({
  activeView,
  explorerCollapsed,
  onToggleExplorer,
  onChangeView,
  onOpenSettings,
}: ActivityBarProps) {
  return (
    <nav className="activity-bar" aria-label="Primary">
      <div className="activity-bar-top">
        <button
          type="button"
          className={`activity-btn ${activeView === "explorer" && !explorerCollapsed ? "active" : ""}`}
          title={explorerCollapsed ? "Show Explorer" : "Explorer"}
          onClick={onToggleExplorer}
        >
          <FilesIcon />
        </button>
        <button
          type="button"
          className={`activity-btn ${activeView === "search" ? "active" : ""}`}
          title="Search in document (Ctrl+F)"
          onClick={() => onChangeView("search")}
        >
          <SearchIcon />
        </button>
      </div>
      <button
        type="button"
        className={`activity-btn ${activeView === "settings" ? "active" : ""}`}
        title="Settings"
        onClick={onOpenSettings}
      >
        <SettingsIcon />
      </button>
    </nav>
  );
}