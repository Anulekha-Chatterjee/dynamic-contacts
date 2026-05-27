import { useMemo, useState } from 'react';
import type { AppConfig, LayoutColumn } from '../../types/config';
import { buildGridTemplateColumns } from '../../utils/buildGridTemplateColumns';
import { ContactPanel } from '../contact/ContactPanel';
import { ConversationsPanel } from '../conversations/ConversationsPanel';
import { NotesPanel } from '../notes/NotesPanel';
import { PanelReopenStrip } from './PanelReopenStrip';
import { UtilitySidebar } from './UtilitySidebar';
import './PageLayout.css';

interface PanelVisibility {
  contactPanelOpen: boolean;
  notesPanelOpen: boolean;
}

interface PageLayoutProps {
  config: AppConfig;
}

function isColumnVisible(column: LayoutColumn, panels: PanelVisibility): boolean {
  if (!column.visible) return false;
  if (column.component === 'contact' && !panels.contactPanelOpen) return false;
  if (column.component === 'notes' && !panels.notesPanelOpen) return false;
  return true;
}

function renderColumn(
  config: AppConfig,
  column: LayoutColumn,
  panels: PanelVisibility,
  onContactPanelBack: () => void,
  onNotesPanelClose: () => void,
) {
  if (!isColumnVisible(column, panels)) return null;

  switch (column.component) {
    case 'contact':
      return (
        <ContactPanel
          key={column.id}
          contacts={config.contactData.contacts}
          contactFields={config.contactFields}
          onBackClick={onContactPanelBack}
        />
      );
    case 'conversations':
      return <ConversationsPanel key={column.id} config={config.conversations} />;
    case 'notes':
      return (
        <NotesPanel
          key={column.id}
          config={config.notes}
          onCloseClick={onNotesPanelClose}
        />
      );
    default:
      return null;
  }
}

export function PageLayout({ config }: PageLayoutProps) {
  const { layout } = config;
  const [contactPanelOpen, setContactPanelOpen] = useState(true);
  const [notesPanelOpen, setNotesPanelOpen] = useState(true);

  const panelVisibility = useMemo<PanelVisibility>(
    () => ({ contactPanelOpen, notesPanelOpen }),
    [contactPanelOpen, notesPanelOpen],
  );

  const visibleColumns = useMemo(
    () => layout.columns.filter((c) => isColumnVisible(c, panelVisibility)),
    [layout.columns, panelVisibility],
  );

  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(visibleColumns),
    [visibleColumns],
  );

  function toggleContactPanel() {
    setContactPanelOpen((open) => !open);
  }

  function toggleNotesPanel() {
    setNotesPanelOpen((open) => !open);
  }

  return (
    <div className="crm-page">
      {!contactPanelOpen && (
        <PanelReopenStrip
          label="Contact Details"
          side="start"
          onClick={toggleContactPanel}
        />
      )}
      <div className="crm-page__grid" style={{ gridTemplateColumns }}>
        {layout.columns.map((column) =>
          renderColumn(config, column, panelVisibility, toggleContactPanel, toggleNotesPanel),
        )}
      </div>
      {!notesPanelOpen && (
        <PanelReopenStrip label={config.notes.title} side="end" onClick={toggleNotesPanel} />
      )}
      <UtilitySidebar config={layout.utilitySidebar} />
    </div>
  );
}
