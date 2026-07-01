import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getMatches } from "@tauri-apps/plugin-cli";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useState } from "react";

export interface MarkdownDocument {
  content: string;
  path: string;
  directory: string;
}

interface UseMarkdownFileResult {
  document: MarkdownDocument | null;
  error: string | null;
  isLoading: boolean;
  isDragging: boolean;
  openFileDialog: () => Promise<void>;
  loadFile: (path: string) => Promise<void>;
}

export function useMarkdownFile(): UseMarkdownFileResult {
  const [document, setDocument] = useState<MarkdownDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loadFile = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await invoke<MarkdownDocument>("read_markdown_file", { path });
      setDocument(result);
    } catch (loadError) {
      setError(String(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openFileDialog = useCallback(async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "Markdown", extensions: ["md"] }],
    });

    if (typeof selected === "string") {
      await loadFile(selected);
    }
  }, [loadFile]);

  useEffect(() => {
    let isMounted = true;
    const unlisteners: Array<() => void> = [];

    const setupListeners = async () => {
      const matches = await getMatches();
      const cliPath = matches.args.file?.value;
      if (typeof cliPath === "string" && cliPath.length > 0) {
        void loadFile(cliPath);
      }

      const openFileUnlisten = await listen<string>("open-file", (event) => {
        if (isMounted) {
          void loadFile(event.payload);
        }
      });
      unlisteners.push(openFileUnlisten);

      const dragDropUnlisten = await getCurrentWindow().onDragDropEvent((event) => {
        if (!isMounted) {
          return;
        }

        if (event.payload.type === "over") {
          setIsDragging(true);
        } else if (event.payload.type === "drop") {
          setIsDragging(false);
          const markdownPath = event.payload.paths.find((path) =>
            path.toLowerCase().endsWith(".md"),
          );
          if (markdownPath) {
            void loadFile(markdownPath);
          }
        } else {
          setIsDragging(false);
        }
      });
      unlisteners.push(dragDropUnlisten);
    };

    void setupListeners();

    return () => {
      isMounted = false;
      unlisteners.forEach((unlisten) => unlisten());
    };
  }, [loadFile]);

  return {
    document,
    error,
    isLoading,
    isDragging,
    openFileDialog,
    loadFile,
  };
}