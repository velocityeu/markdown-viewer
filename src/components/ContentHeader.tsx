interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrint?: () => void;
}

export function ContentHeader({
  title,
  subtitle,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPrint,
}: ContentHeaderProps) {
  return (
    <header className="content-header">
      <div className="content-tab">
        <span className="content-tab-label">{title}</span>
        {subtitle && <span className="content-tab-path" title={subtitle}>{subtitle}</span>}
      </div>
      <div className="content-actions">
        {onPrint && (
          <button type="button" className="ghost-btn" onClick={onPrint}>
            Print
          </button>
        )}
        <button type="button" className="ghost-btn" onClick={onZoomOut} title="Zoom out">
          −
        </button>
        <button type="button" className="ghost-btn zoom" onClick={onResetZoom} title="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" className="ghost-btn" onClick={onZoomIn} title="Zoom in">
          +
        </button>
      </div>
    </header>
  );
}