import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "markdown-viewer-open-folder";

function readStoredFolder(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function useFolderBrowser() {
  const [folderPath, setFolderPath] = useState<string | null>(null);

  useEffect(() => {
    setFolderPath(readStoredFolder());
  }, []);

  const openFolder = useCallback(async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      setFolderPath(selected);
      localStorage.setItem(STORAGE_KEY, selected);
    }
  }, []);

  const setFolderFromFile = useCallback((filePath: string) => {
    const parts = filePath.split(/[\\/]/);
    if (parts.length < 2) {
      return;
    }

    parts.pop();
    const parent = parts.join(filePath.includes("\\") ? "\\" : "/");
    setFolderPath(parent);
    localStorage.setItem(STORAGE_KEY, parent);
  }, []);

  const closeFolder = useCallback(() => {
    setFolderPath(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    folderPath,
    openFolder,
    setFolderFromFile,
    closeFolder,
  };
}