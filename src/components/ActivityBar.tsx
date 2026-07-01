import { FilesIcon, SearchIcon, SettingsIcon } from "./icons";

export type ActivityView = "explorer" | "search" | "settings";

interface ActivityBarProps {
  activeView: ActivityView;
  onChangeView: (view: ActivityView) => void;
  onOpenSettings: () => void;
}

export function ActivityBar({ activeView, onChangeView, onOpenSettings }: ActivityBarProps) {
  return (
    <nav className="activity-bar" aria-label="Primary">
      <div className="activity-bar-top">
        <button
          type="button"
          className={`activity-btn ${activeView === "explorer" ? "active" : ""}`}
          title="Explorer"
          onClick={() => onChangeView("explorer")}
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