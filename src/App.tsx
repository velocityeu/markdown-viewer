import { ActivityBar, type ActivityView } from "./components/ActivityBar";
import { ContentHeader } from "./components/ContentHeader";
import { FolderOpenIcon } from "./components/icons";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { SearchBar } from "./components/SearchBar";
import { SidePanel } from "./components/SidePanel";
import { useEffect, useState } from "react";
import { useDocumentSearch } from "./hooks/useDocumentSearch";
import { useFolderBrowser } from "./hooks/useFolderBrowser";
import { useMarkdownFile } from "./hooks/useMarkdownFile";
import { useRecentFiles } from "./hooks/useRecentFiles";
import { useTheme } from "./hooks/useTheme";
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
  const { preference: theme, setThemePreference } = useTheme();
  const [activeView, setActiveView] = useState<ActivityView>("explorer");
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(() => {
    try {
      return localStorage.getItem("markdown-viewer-explorer-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const showSidePanel =
    !sidePanelCollapsed && (activeView === "explorer" || activeView === "settings");

  const toggleExplorer = () => {
    if (activeView === "explorer" && !sidePanelCollapsed) {
      setSidePanelCollapsed(true);
      localStorage.setItem("markdown-viewer-explorer-collapsed", "true");
      return;
    }

    setActiveView("explorer");
    setSidePanelCollapsed(false);
    localStorage.setItem("markdown-viewer-explorer-collapsed", "false");
  };

  const collapseSidePanel = () => {
    setSidePanelCollapsed(true);
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
    setSidePanelCollapsed(false);
    localStorage.setItem("markdown-viewer-explorer-collapsed", "false");
  };

  const showSearch = isOpen && document && activeView === "search";

  return (
    <div className={`app ${isDragging ? "is-dragging" : ""}`}>
      <div className="shell">
        <ActivityBar
          activeView={activeView}
          sidePanelCollapsed={sidePanelCollapsed}
          onToggleExplorer={toggleExplorer}
          onChangeView={setActiveView}
          onOpenSettings={handleOpenSettings}
        />

        <div className={`side-panel-wrap ${showSidePanel ? "" : "collapsed"}`}>
          <SidePanel
            activeView={activeView}
            folderPath={folderPath}
            activePath={document?.path ?? null}
            recentFiles={recentFiles}
            theme={theme}
            onThemeChange={setThemePreference}
            onOpenFolder={() => void openFolder()}
            onOpenFile={() => void openFileDialog()}
            onSelectFile={handleSelectFile}
            onCloseFolder={closeFolder}
            onCollapse={collapseSidePanel}
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
                    Tip: use the Explorer panel on the left, or change theme in Settings.
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