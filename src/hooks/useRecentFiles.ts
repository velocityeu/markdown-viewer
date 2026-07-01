import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "markdown-viewer-recent-files";
const MAX_RECENT = 8;

function readStoredFiles(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  useEffect(() => {
    setRecentFiles(readStoredFiles());
  }, []);

  const addRecentFile = useCallback((path: string) => {
    setRecentFiles((current) => {
      const next = [path, ...current.filter((entry) => entry !== path)].slice(
        0,
        MAX_RECENT,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentFiles, addRecentFile };
}