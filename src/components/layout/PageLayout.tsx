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
  contactIndex: number,
  onPreviousContact: () => void,
  onNextContact: () => void,
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
          contactIndex={contactIndex}
          onPreviousContact={onPreviousContact}
          onNextContact={onNextContact}
          onBackClick={onContactPanelBack}
        />
      );
    case 'conversations':
      return (
        <ConversationsPanel
          key={column.id}
          config={config.conversations}
          contactId={config.contactData.contacts[contactIndex]?.id}
        />
      );
    case 'notes':
      return (
        <NotesPanel
          key={column.id}
          config={config.notes}
          contactId={config.contactData.contacts[contactIndex]?.id}
          onCloseClick={onNotesPanelClose}
        />
      );
    default:
      return null;
  }
}

export function PageLayout({ config }: PageLayoutProps) {
  const { layout } = config;
  const [contactIndex, setContactIndex] = useState(0);
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

  function goToPreviousContact() {
    setContactIndex((index) => Math.max(0, index - 1));
  }

  function goToNextContact() {
    setContactIndex((index) => Math.min(config.contactData.contacts.length - 1, index + 1));
  }

  const isFirstContact = contactIndex === 0;
  const isLastContact = contactIndex === config.contactData.contacts.length - 1;

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
          renderColumn(
            config,
            column,
            panelVisibility,
            contactIndex,
            goToPreviousContact,
            goToNextContact,
            toggleContactPanel,
            toggleNotesPanel,
          ),
        )}
      </div>
      {!notesPanelOpen && (
        <PanelReopenStrip label={config.notes.title} side="end" onClick={toggleNotesPanel} />
      )}
      <UtilitySidebar config={layout.utilitySidebar} />
      <div className="contact-bottom-nav" aria-label="Contact navigation">
        <button
          type="button"
          aria-label="Previous contact"
          onClick={goToPreviousContact}
          disabled={isFirstContact}
        >
          ‹
        </button>
        <span aria-hidden="true" />
        <button
          type="button"
          aria-label="Next contact"
          onClick={goToNextContact}
          disabled={isLastContact}
        >
          ›
        </button>
      </div>
    </div>
  );
}
