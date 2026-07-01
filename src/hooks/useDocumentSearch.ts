import { useCallback, useEffect, useState } from "react";

export function useDocumentSearch(enabled: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled) {
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, enabled, isOpen]);

  return {
    isOpen,
    query,
    setQuery,
    openSearch,
    closeSearch,
  };
}