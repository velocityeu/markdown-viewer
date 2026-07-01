import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";

interface DirEntry {
  name: string;
  path: string;
  is_dir: boolean;
}

interface FileTreeProps {
  rootPath: string;
  activePath: string | null;
  onSelectFile: (path: string) => void;
}

interface TreeNodeProps {
  entry: DirEntry;
  depth: number;
  activePath: string | null;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
  onSelectFile: (path: string) => void;
}

function normalizePath(path: string) {
  return path.replace(/\//g, "\\").toLowerCase();
}

function getParentPath(filePath: string) {
  const separator = filePath.includes("\\") ? "\\" : "/";
  const parts = filePath.split(/[\\/]/);
  parts.pop();
  return parts.join(separator);
}

function isWithinRoot(filePath: string, rootPath: string) {
  const normalizedFile = normalizePath(filePath);
  const normalizedRoot = normalizePath(rootPath);
  return (
    normalizedFile === normalizedRoot ||
    normalizedFile.startsWith(`${normalizedRoot}\\`)
  );
}

function TreeNode({
  entry,
  depth,
  activePath,
  expandedPaths,
  onToggle,
  onSelectFile,
}: TreeNodeProps) {
  const [children, setChildren] = useState<DirEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isExpanded = expandedPaths.has(entry.path);

  useEffect(() => {
    if (!entry.is_dir || !isExpanded) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void invoke<DirEntry[]>("list_directory", { path: entry.path })
      .then((result) => {
        if (!cancelled) {
          setChildren(result);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [entry.is_dir, entry.path, isExpanded]);

  if (!entry.is_dir) {
    const isActive = activePath === entry.path;
    return (
      <button
        type="button"
        className={`tree-item file ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${depth * 14 + 28}px` }}
        title={entry.path}
        onClick={() => onSelectFile(entry.path)}
      >
        <span className="tree-icon">📄</span>
        <span className="tree-label">{entry.name}</span>
      </button>
    );
  }

  return (
    <div className="tree-folder">
      <button
        type="button"
        className="tree-item folder"
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        title={entry.path}
        onClick={() => onToggle(entry.path)}
      >
        <span className="tree-chevron">{isExpanded ? "▾" : "▸"}</span>
        <span className="tree-icon">📁</span>
        <span className="tree-label">{entry.name}</span>
      </button>

      {isExpanded && (
        <div className="tree-children">
          {isLoading && (
            <div className="tree-loading" style={{ paddingLeft: `${(depth + 1) * 14 + 28}px` }}>
              Loading...
            </div>
          )}
          {!isLoading && children.length === 0 && (
            <div className="tree-empty" style={{ paddingLeft: `${(depth + 1) * 14 + 28}px` }}>
              No markdown files
            </div>
          )}
          {children.map((child) => (
            <TreeNode
              key={child.path}
              entry={child}
              depth={depth + 1}
              activePath={activePath}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ rootPath, activePath, onSelectFile }: FileTreeProps) {
  const [rootEntries, setRootEntries] = useState<DirEntry[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => new Set([rootPath]));
  const [isLoading, setIsLoading] = useState(true);

  const loadRoot = useCallback(async () => {
    setIsLoading(true);
    try {
      const entries = await invoke<DirEntry[]>("list_directory", { path: rootPath });
      setRootEntries(entries);
    } finally {
      setIsLoading(false);
    }
  }, [rootPath]);

  useEffect(() => {
    void loadRoot();
    setExpandedPaths(new Set([rootPath]));
  }, [loadRoot, rootPath]);

  useEffect(() => {
    if (!activePath || !isWithinRoot(activePath, rootPath)) {
      return;
    }

    setExpandedPaths((current) => {
      const next = new Set(current);
      let parent = getParentPath(activePath);

      while (isWithinRoot(parent, rootPath)) {
        next.add(parent);
        if (normalizePath(parent) === normalizePath(rootPath)) {
          break;
        }
        parent = getParentPath(parent);
      }

      next.add(rootPath);
      return next;
    });
  }, [activePath, rootPath]);

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const rootName = rootPath.split(/[\\/]/).pop() || rootPath;

  return (
    <div className="file-tree">
      <button
        type="button"
        className={`tree-item folder root ${expandedPaths.has(rootPath) ? "expanded" : ""}`}
        title={rootPath}
        onClick={() => handleToggle(rootPath)}
      >
        <span className="tree-chevron">{expandedPaths.has(rootPath) ? "▾" : "▸"}</span>
        <span className="tree-icon">📂</span>
        <span className="tree-label">{rootName}</span>
      </button>

      {expandedPaths.has(rootPath) && (
        <div className="tree-children">
          {isLoading && <div className="tree-loading">Loading...</div>}
          {!isLoading && rootEntries.length === 0 && (
            <div className="tree-empty">No markdown files in this folder</div>
          )}
          {rootEntries.map((entry) => (
            <TreeNode
              key={entry.path}
              entry={entry}
              depth={1}
              activePath={activePath}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}