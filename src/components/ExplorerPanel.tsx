import { useState } from "react";
import { FileTree } from "./FileTree";
import { FileIcon, FolderOpenIcon, PanelCollapseIcon } from "./icons";

interface ExplorerPanelProps {
  folderPath: string | null;
  activePath: string | null;
  recentFiles: string[];
  onOpenFolder: () => void;
  onOpenFile: () => void;
  onSelectFile: (path: string) => void;
  onCloseFolder: () => void;
  onCollapse: () => void;
}

function getFileName(path: string) {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

export function ExplorerPanel({
  folderPath,
  activePath,
  recentFiles,
  onOpenFolder,
  onOpenFile,
  onSelectFile,
  onCloseFolder,
  onCollapse,
}: ExplorerPanelProps) {
  const [filter, setFilter] = useState("");

  return (
    <aside className="explorer-panel">
      <div className="explorer-header">
        <span className="explorer-title">Explorer</span>
        <div className="explorer-actions">
          <button type="button" className="icon-btn" title="Open folder" onClick={onOpenFolder}>
            <FolderOpenIcon size={16} />
          </button>
          <button type="button" className="icon-btn" title="Open file" onClick={onOpenFile}>
            <FileIcon size={16} />
          </button>
          <button type="button" className="icon-btn" title="Collapse Explorer" onClick={onCollapse}>
            <PanelCollapseIcon size={16} />
          </button>
        </div>
      </div>

      <div className="explorer-toolbar">
        <button type="button" className="explorer-primary-action" onClick={onOpenFolder}>
          <FolderOpenIcon size={18} />
          <span>Open folder</span>
        </button>
        <button type="button" className="explorer-secondary-action" onClick={onOpenFile}>
          Open file
        </button>
      </div>

      {folderPath ? (
        <>
          <div className="explorer-folder-bar">
            <span className="explorer-folder-name" title={folderPath}>
              {getFileName(folderPath)}
            </span>
            <button type="button" className="text-btn" onClick={onCloseFolder}>
              Close
            </button>
          </div>
          <div className="explorer-search">
            <input
              type="search"
              value={filter}
              placeholder="Filter files..."
              onChange={(event) => setFilter(event.currentTarget.value)}
            />
          </div>
          <FileTree
            rootPath={folderPath}
            activePath={activePath}
            filter={filter}
            onSelectFile={onSelectFile}
          />
        </>
      ) : (
        <div className="explorer-empty">
          <div className="explorer-empty-icon">
            <FolderOpenIcon size={32} />
          </div>
          <p>Open a folder to browse markdown files in a tree view.</p>
          <button type="button" className="explorer-primary-action full" onClick={onOpenFolder}>
            <FolderOpenIcon size={18} />
            <span>Open folder</span>
          </button>
          {recentFiles.length > 0 && (
            <div className="explorer-recent">
              <div className="explorer-recent-title">Recent files</div>
              {recentFiles.slice(0, 5).map((path) => (
                <button
                  key={path}
                  type="button"
                  className="explorer-recent-item"
                  title={path}
                  onClick={() => onSelectFile(path)}
                >
                  <FileIcon size={14} />
                  <span>{getFileName(path)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}