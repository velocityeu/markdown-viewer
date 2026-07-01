import type { ThemePreference } from "../hooks/useTheme";
import { ExplorerPanel } from "./ExplorerPanel";
import { SettingsPanel } from "./SettingsPanel";
import type { ActivityView } from "./ActivityBar";

interface SidePanelProps {
  activeView: ActivityView;
  folderPath: string | null;
  activePath: string | null;
  recentFiles: string[];
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  onOpenFolder: () => void;
  onOpenFile: () => void;
  onSelectFile: (path: string) => void;
  onCloseFolder: () => void;
  onCollapse: () => void;
}

export function SidePanel({
  activeView,
  folderPath,
  activePath,
  recentFiles,
  theme,
  onThemeChange,
  onOpenFolder,
  onOpenFile,
  onSelectFile,
  onCloseFolder,
  onCollapse,
}: SidePanelProps) {
  if (activeView === "settings") {
    return (
      <SettingsPanel theme={theme} onThemeChange={onThemeChange} onCollapse={onCollapse} />
    );
  }

  return (
    <ExplorerPanel
      folderPath={folderPath}
      activePath={activePath}
      recentFiles={recentFiles}
      onOpenFolder={onOpenFolder}
      onOpenFile={onOpenFile}
      onSelectFile={onSelectFile}
      onCloseFolder={onCloseFolder}
      onCollapse={onCollapse}
    />
  );
}