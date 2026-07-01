import { useEffect, useRef, useState } from "react";

interface SearchHighlightProps {
  query: string;
  children: React.ReactNode;
}

function clearHighlights(root: HTMLElement) {
  root.querySelectorAll("mark.search-hit").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) {
      return;
    }

    parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
    parent.normalize();
  });
}

function highlightMatches(root: HTMLElement, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return 0;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.textContent &&
      node.parentElement &&
      !node.parentElement.closest("mark.search-hit")
    ) {
      textNodes.push(node as Text);
    }
  }

  let matchCount = 0;

  textNodes.forEach((textNode) => {
    const source = textNode.textContent ?? "";
    const lower = source.toLowerCase();
    let startIndex = 0;
    const fragments: Array<string | HTMLElement> = [];
    let found = lower.indexOf(needle, startIndex);

    if (found === -1) {
      return;
    }

    while (found !== -1) {
      if (found > startIndex) {
        fragments.push(source.slice(startIndex, found));
      }

      const mark = document.createElement("mark");
      mark.className = "search-hit";
      mark.textContent = source.slice(found, found + needle.length);
      fragments.push(mark);
      matchCount += 1;

      startIndex = found + needle.length;
      found = lower.indexOf(needle, startIndex);
    }

    if (startIndex < source.length) {
      fragments.push(source.slice(startIndex));
    }

    const parent = textNode.parentNode;
    if (!parent) {
      return;
    }

    fragments.forEach((fragment) => {
      parent.insertBefore(
        typeof fragment === "string"
          ? document.createTextNode(fragment)
          : fragment,
        textNode,
      );
    });
    parent.removeChild(textNode);
  });

  return matchCount;
}

export function SearchHighlight({ query, children }: SearchHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return;
    }

    clearHighlights(root);
    setMatchCount(highlightMatches(root, query));
  }, [children, query]);

  return (
    <div ref={containerRef} className="search-highlight-root">
      {children}
      <span className="visually-hidden" aria-live="polite">
        {matchCount}
      </span>
    </div>
  );
}

export function useSearchMatchCount(query: string, content: string) {
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      setMatchCount(0);
      return;
    }

    const matches = content.toLowerCase().split(needle).length - 1;
    setMatchCount(Math.max(0, matches));
  }, [content, query]);

  return matchCount;
}