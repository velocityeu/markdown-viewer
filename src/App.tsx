import { openUrl } from "@tauri-apps/plugin-opener";
import { ActivityBar, type ActivityView } from "./components/ActivityBar";
import { ContentHeader } from "./components/ContentHeader";
import { ExplorerPanel } from "./components/ExplorerPanel";
import { FolderOpenIcon } from "./components/icons";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { SearchBar } from "./components/SearchBar";
import { useEffect, useState } from "react";
import { useDocumentSearch } from "./hooks/useDocumentSearch";
import { useFolderBrowser } from "./hooks/useFolderBrowser";
import { useMarkdownFile } from "./hooks/useMarkdownFile";
import { useRecentFiles } from "./hooks/useRecentFiles";
import { useSearchMatchCount } from "./components/SearchHighlight";
import { useZoom } from "./hooks/useZoom";
import "./App.css";

function getFileName(path: string) {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

function App() {
  const { document, error, isLoading, isDragging, openFileDialog, loadFile } =
    useMarkdownFile();
  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();
  const { recentFiles, addRecentFile } = useRecentFiles();
  const { folderPath, openFolder, setFolderFromFile, closeFolder } = useFolderBrowser();
  const { isOpen, query, setQuery, openSearch, closeSearch } = useDocumentSearch(
    Boolean(document),
  );
  const matchCount = useSearchMatchCount(query, document?.content ?? "");
  const [activeView, setActiveView] = useState<ActivityView>("explorer");
  const [explorerCollapsed, setExplorerCollapsed] = useState(() => {
    try {
      return localStorage.getItem("markdown-viewer-explorer-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleExplorer = () => {
    if (activeView === "explorer" && !explorerCollapsed) {
      setExplorerCollapsed(true);
      localStorage.setItem("markdown-viewer-explorer-collapsed", "true");
      return;
    }

    setActiveView("explorer");
    setExplorerCollapsed(false);
    localStorage.setItem("markdown-viewer-explorer-collapsed", "false");
  };

  const collapseExplorer = () => {
    setExplorerCollapsed(true);
    localStorage.setItem("markdown-viewer-explorer-collapsed", "true");
  };

  useEffect(() => {
    if (document?.path) {
      addRecentFile(document.path);
      if (!folderPath) {
        setFolderFromFile(document.path);
      }
    }
  }, [addRecentFile, document?.path, folderPath, setFolderFromFile]);

  useEffect(() => {
    if (activeView === "search" && document) {
      openSearch();
    } else if (activeView === "search" && !document) {
      closeSearch();
    }
  }, [activeView, closeSearch, document, openSearch]);

  const handleSelectFile = (path: string) => {
    void loadFile(path);
  };

  const handleOpenSettings = () => {
    setActiveView("settings");
    void openUrl("ms-settings:defaultapps");
  };

  const showSearch = isOpen && document && activeView === "search";

  return (
    <div className={`app ${isDragging ? "is-dragging" : ""}`}>
      <div className="shell">
        <ActivityBar
          activeView={activeView}
          explorerCollapsed={explorerCollapsed}
          onToggleExplorer={toggleExplorer}
          onChangeView={setActiveView}
          onOpenSettings={handleOpenSettings}
        />

        <div
          className={`explorer-panel-wrap ${explorerCollapsed || activeView !== "explorer" ? "collapsed" : ""}`}
        >
          <ExplorerPanel
            folderPath={folderPath}
            activePath={document?.path ?? null}
            recentFiles={recentFiles}
            onOpenFolder={() => void openFolder()}
            onOpenFile={() => void openFileDialog()}
            onSelectFile={handleSelectFile}
            onCloseFolder={closeFolder}
            onCollapse={collapseExplorer}
          />
        </div>

        <div className="main-panel">
          <ContentHeader
            title={document ? getFileName(document.path) : "Welcome"}
            subtitle={document?.path}
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onPrint={document ? () => window.print() : undefined}
          />

          {showSearch && (
            <SearchBar
              query={query}
              matchCount={matchCount}
              onChange={setQuery}
              onClose={() => {
                closeSearch();
                setActiveView("explorer");
              }}
            />
          )}

          <main className="viewer-shell">
            {isLoading && <div className="status-banner">Loading markdown...</div>}
            {error && <div className="status-banner error">{error}</div>}

            {!document && !isLoading && !error && activeView === "search" && (
              <section className="welcome-state">
                <div className="welcome-card">
                  <h1>Search</h1>
                  <p>Open a markdown file first, then press Ctrl+F or use the search icon.</p>
                  <button type="button" className="welcome-btn primary" onClick={() => setActiveView("explorer")}>
                    Go to Explorer
                  </button>
                </div>
              </section>
            )}

            {!document && !isLoading && !error && activeView !== "search" && (
              <section className="welcome-state">
                <div className="welcome-card">
                  <div className="welcome-icon">
                    <FolderOpenIcon size={40} />
                  </div>
                  <h1>Markdown Viewer</h1>
                  <p>
                    Open a folder to browse your notes with an Explorer-style tree, or open a single
                    markdown file to start reading.
                  </p>
                  <div className="welcome-actions">
                    <button
                      type="button"
                      className="welcome-btn primary"
                      onClick={() => void openFolder()}
                    >
                      <FolderOpenIcon size={18} />
                      Open folder
                    </button>
                    <button
                      type="button"
                      className="welcome-btn"
                      onClick={() => void openFileDialog()}
                    >
                      Open file
                    </button>
                  </div>
                  <p className="welcome-hint">
                    Tip: use the Explorer panel on the left — the purple <strong>Open folder</strong> button is always there.
                  </p>
                </div>
              </section>
            )}

            {document && (
              <div className="viewer-scroll">
                <MarkdownViewer
                  content={document.content}
                  baseDirectory={document.directory}
                  zoom={zoom}
                  searchQuery={query}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {isDragging && <div className="drop-overlay">Drop markdown file to open</div>}
    </div>
  );
}

export default App;