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
      {config.icons.map((icon) => {
        const isActive = icon.id === config.activeIconId;

        return (
          <button
            key={icon.id}
            type="button"
            className={
              isActive
                ? 'utility-sidebar__button utility-sidebar__button--active'
                : 'utility-sidebar__button'
            }
            title={icon.label}
            aria-label={icon.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <UtilityIcon name={icon.icon} />
          </button>
        );
      })}
    </nav>
  );
}
