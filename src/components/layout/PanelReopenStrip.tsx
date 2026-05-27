import './PageLayout.css';

interface PanelReopenStripProps {
  label: string;
  side: 'start' | 'end';
  onClick: () => void;
}

export function PanelReopenStrip({ label, side, onClick }: PanelReopenStripProps) {
  return (
    <button
      type="button"
      className={`panel-reopen panel-reopen--${side}`}
      onClick={onClick}
      aria-label={`Show ${label}`}
    >
      <span className="panel-reopen__chevron" aria-hidden>
        {side === 'start' ? '›' : '‹'}
      </span>
      <span className="panel-reopen__label">{label}</span>
    </button>
  );
}
