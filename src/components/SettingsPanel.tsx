import { openUrl } from "@tauri-apps/plugin-opener";
import type { ThemePreference } from "../hooks/useTheme";
import { PanelCollapseIcon } from "./icons";

interface SettingsPanelProps {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  onCollapse: () => void;
}

export function SettingsPanel({ theme, onThemeChange, onCollapse }: SettingsPanelProps) {
  return (
    <aside className="settings-panel">
      <div className="panel-header">
        <span className="panel-title">Settings</span>
        <button type="button" className="icon-btn" title="Collapse panel" onClick={onCollapse}>
          <PanelCollapseIcon size={16} />
        </button>
      </div>

      <div className="settings-section">
        <div className="settings-label">Appearance</div>
        <div className="theme-toggle" role="group" aria-label="Theme">
          {(["light", "dark", "system"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`theme-option ${theme === option ? "active" : ""}`}
              onClick={() => onThemeChange(option)}
            >
              {option === "light" ? "Light" : option === "dark" ? "Dark" : "System"}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-label">Windows</div>
        <button
          type="button"
          className="settings-action"
          onClick={() => void openUrl("ms-settings:defaultapps")}
        >
          Set as default Markdown app
        </button>
      </div>
    </aside>
  );
}