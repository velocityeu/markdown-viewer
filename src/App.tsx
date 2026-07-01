import { openUrl } from "@tauri-apps/plugin-opener";
import { FileTree } from "./components/FileTree";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { SearchBar } from "./components/SearchBar";
import { useEffect } from "react";
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
  const {
    folderPath,
    sidebarOpen,
    openFolder,
    setFolderFromFile,
    closeFolder,
    toggleSidebar,
  } = useFolderBrowser();
  const { isOpen, query, setQuery, openSearch, closeSearch } = useDocumentSearch(
    Boolean(document),
  );
  const matchCount = useSearchMatchCount(query, document?.content ?? "");

  useEffect(() => {
    if (document?.path) {
      addRecentFile(document.path);
      if (!folderPath) {
        setFolderFromFile(document.path);
      }
    }
  }, [addRecentFile, document?.path, folderPath, setFolderFromFile]);

  const openDefaultAppsSettings = async () => {
    await openUrl("ms-settings:defaultapps");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectFile = (path: string) => {
    void loadFile(path);
  };

  return (
    <div className={`app ${isDragging ? "is-dragging" : ""}`}>
      <header className="toolbar">
        <div className="toolbar-left">
          <button type="button" className="toolbar-button" onClick={() => void openFileDialog()}>
            Open file
          </button>
          <button type="button" className="toolbar-button" onClick={() => void openFolder()}>
            Open folder
          </button>

          {folderPath && (
            <button type="button" className="toolbar-button subtle" onClick={toggleSidebar}>
              {sidebarOpen ? "Hide tree" : "Show tree"}
            </button>
          )}

          {recentFiles.length > 0 && (
            <details className="recent-menu">
              <summary className="toolbar-button subtle">Recent</summary>
              <div className="recent-list">
                {recentFiles.map((path) => (
                  <button
                    key={path}
                    type="button"
                    className="recent-item"
                    title={path}
                    onClick={() => void loadFile(path)}
                  >
                    {getFileName(path)}
                  </button>
                ))}
              </div>
            </details>
          )}

          {document && (
            <>
              <button type="button" className="toolbar-button subtle" onClick={openSearch}>
                Search
              </button>
              <button type="button" className="toolbar-button subtle" onClick={handlePrint}>
                Print
              </button>
            </>
          )}

          <button
            type="button"
            className="toolbar-button subtle"
            onClick={() => void openDefaultAppsSettings()}
          >
            Set as default
          </button>
        </div>

        <div className="toolbar-title" title={document?.path ?? folderPath ?? "Markdown Viewer"}>
          {document ? getFileName(document.path) : folderPath ? getFileName(folderPath) : "Markdown Viewer"}
        </div>

        <div className="toolbar-right">
          <button type="button" className="toolbar-button" onClick={zoomOut} title="Zoom out (Ctrl -)">
            -
          </button>
          <button
            type="button"
            className="toolbar-button zoom-label"
            onClick={resetZoom}
            title="Reset zoom (Ctrl 0)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" className="toolbar-button" onClick={zoomIn} title="Zoom in (Ctrl +)">
            +
          </button>
        </div>
      </header>

      {isOpen && document && (
        <SearchBar
          query={query}
          matchCount={matchCount}
          onChange={setQuery}
          onClose={closeSearch}
        />
      )}

      <div className="workspace">
        {folderPath && sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title" title={folderPath}>
                {getFileName(folderPath)}
              </span>
              <button
                type="button"
                className="sidebar-close"
                title="Close folder"
                onClick={closeFolder}
              >
                ×
              </button>
            </div>
            <FileTree
              rootPath={folderPath}
              activePath={document?.path ?? null}
              onSelectFile={handleSelectFile}
            />
          </aside>
        )}

        <main className="viewer-shell">
          {isLoading && <div className="status-banner">Loading markdown...</div>}
          {error && <div className="status-banner error">{error}</div>}

          {!document && !isLoading && !error && (
            <section className="empty-state">
              <h1>Markdown Viewer</h1>
              <p>
                Open a `.md` file or folder to browse markdown with the file tree, drag a file here,
                or double-click a Markdown file in Explorer.
              </p>
              <div className="empty-actions">
                <button type="button" className="primary-button" onClick={() => void openFileDialog()}>
                  Open file
                </button>
                <button type="button" className="primary-button secondary" onClick={() => void openFolder()}>
                  Open folder
                </button>
              </div>
              <p className="hint">Zoom with Ctrl + mouse wheel, Ctrl + Plus/Minus, or Ctrl + 0 to reset.</p>
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

      {isDragging && <div className="drop-overlay">Drop Markdown file to open</div>}
    </div>
  );
}

export default App;