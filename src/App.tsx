import { openUrl } from "@tauri-apps/plugin-opener";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { SearchBar } from "./components/SearchBar";
import { useEffect } from "react";
import { useDocumentSearch } from "./hooks/useDocumentSearch";
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
  const { isOpen, query, setQuery, openSearch, closeSearch } = useDocumentSearch(
    Boolean(document),
  );
  const matchCount = useSearchMatchCount(query, document?.content ?? "");

  useEffect(() => {
    if (document?.path) {
      addRecentFile(document.path);
    }
  }, [addRecentFile, document?.path]);

  const openDefaultAppsSettings = async () => {
    await openUrl("ms-settings:defaultapps");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`app ${isDragging ? "is-dragging" : ""}`}>
      <header className="toolbar">
        <div className="toolbar-left">
          <button type="button" className="toolbar-button" onClick={() => void openFileDialog()}>
            Open
          </button>

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

        <div className="toolbar-title" title={document?.path ?? "Markdown Viewer"}>
          {document ? getFileName(document.path) : "Markdown Viewer"}
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

      <main className="viewer-shell">
        {isLoading && <div className="status-banner">Loading markdown...</div>}
        {error && <div className="status-banner error">{error}</div>}

        {!document && !isLoading && !error && (
          <section className="empty-state">
            <h1>Markdown Viewer</h1>
            <p>Open a `.md` file, drag one here, or double-click a Markdown file in Explorer.</p>
            <button type="button" className="primary-button" onClick={() => void openFileDialog()}>
              Open Markdown file
            </button>
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

      {isDragging && <div className="drop-overlay">Drop Markdown file to open</div>}
    </div>
  );
}

export default App;