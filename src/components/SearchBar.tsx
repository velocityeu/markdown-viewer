interface SearchBarProps {
  query: string;
  matchCount: number;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SearchBar({
  query,
  matchCount,
  onChange,
  onClose,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        autoFocus
        type="search"
        value={query}
        placeholder="Search in document"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <span className="search-count">
        {query ? `${matchCount} match${matchCount === 1 ? "" : "es"}` : "Ctrl+F"}
      </span>
      <button type="button" className="toolbar-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}