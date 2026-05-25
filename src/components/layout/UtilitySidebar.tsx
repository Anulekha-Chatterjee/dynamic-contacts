import type { PageLayoutConfig } from '../../types/config';
import { UtilityIcon } from '../icons/Icons';
import './PageLayout.css';

interface UtilitySidebarProps {
  config: PageLayoutConfig['utilitySidebar'];
}

export function UtilitySidebar({ config }: UtilitySidebarProps) {
  if (!config.visible) return null;

  return (
    <nav className="utility-sidebar" aria-label="Utility navigation">
      {config.icons.map((icon) => (
        <button key={icon.id} type="button" title={icon.label} aria-label={icon.label}>
          <UtilityIcon name={icon.icon} />
        </button>
      ))}
    </nav>
  );
}
