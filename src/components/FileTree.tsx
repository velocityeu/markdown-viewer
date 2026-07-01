import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";
import { ChevronIcon, FileIcon, FolderIcon } from "./icons";

interface DirEntry {
  name: string;
  path: string;
  is_dir: boolean;
}

interface FileTreeProps {
  rootPath: string;
  activePath: string | null;
  filter?: string;
  onSelectFile: (path: string) => void;
}

interface TreeNodeProps {
  entry: DirEntry;
  depth: number;
  activePath: string | null;
  filter: string;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
  onSelectFile: (path: string) => void;
}

function normalizePath(path: string) {
  return path.replace(/\//g, "\\").toLowerCase();
}

function pathsEqual(left: string, right: string) {
  return normalizePath(left) === normalizePath(right);
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

function matchesFilter(name: string, filter: string) {
  if (!filter.trim()) {
    return true;
  }
  return name.toLowerCase().includes(filter.trim().toLowerCase());
}

function TreeNode({
  entry,
  depth,
  activePath,
  filter,
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
    if (!matchesFilter(entry.name, filter)) {
      return null;
    }

    const isActive = activePath ? pathsEqual(activePath, entry.path) : false;
    return (
      <button
        type="button"
        className={`tree-item file ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 24}px` }}
        title={entry.path}
        onClick={() => onSelectFile(entry.path)}
      >
        <FileIcon size={15} className="tree-svg" />
        <span className="tree-label">{entry.name}</span>
      </button>
    );
  }

  const visibleChildren = children.filter(
    (child) => child.is_dir || matchesFilter(child.name, filter),
  );
  const hasVisibleChildren = visibleChildren.length > 0;
  const folderMatches = matchesFilter(entry.name, filter);

  if (filter && !folderMatches && !hasVisibleChildren && !isExpanded) {
    return null;
  }

  return (
    <div className="tree-folder">
      <button
        type="button"
        className="tree-item folder"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        title={entry.path}
        onClick={() => onToggle(entry.path)}
      >
        <ChevronIcon expanded={isExpanded} className="tree-chevron" />
        <FolderIcon size={15} className="tree-svg" />
        <span className="tree-label">{entry.name}</span>
      </button>

      {isExpanded && (
        <div className="tree-children">
          {isLoading && (
            <div className="tree-loading" style={{ paddingLeft: `${(depth + 1) * 16 + 24}px` }}>
              Loading...
            </div>
          )}
          {!isLoading && visibleChildren.length === 0 && (
            <div className="tree-empty" style={{ paddingLeft: `${(depth + 1) * 16 + 24}px` }}>
              No markdown files
            </div>
          )}
          {visibleChildren.map((child) => (
            <TreeNode
              key={child.path}
              entry={child}
              depth={depth + 1}
              activePath={activePath}
              filter={filter}
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

export function FileTree({
  rootPath,
  activePath,
  filter = "",
  onSelectFile,
}: FileTreeProps) {
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
  const visibleRootEntries = rootEntries.filter(
    (entry) => entry.is_dir || matchesFilter(entry.name, filter),
  );

  return (
    <div className="file-tree">
      <button
        type="button"
        className={`tree-item folder root ${expandedPaths.has(rootPath) ? "expanded" : ""}`}
        title={rootPath}
        onClick={() => handleToggle(rootPath)}
      >
        <ChevronIcon expanded={expandedPaths.has(rootPath)} className="tree-chevron" />
        <FolderIcon size={15} className="tree-svg" />
        <span className="tree-label">{rootName}</span>
      </button>

      {expandedPaths.has(rootPath) && (
        <div className="tree-children">
          {isLoading && <div className="tree-loading">Loading...</div>}
          {!isLoading && visibleRootEntries.length === 0 && (
            <div className="tree-empty">No markdown files in this folder</div>
          )}
          {visibleRootEntries.map((entry) => (
            <TreeNode
              key={entry.path}
              entry={entry}
              depth={1}
              activePath={activePath}
              filter={filter}
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