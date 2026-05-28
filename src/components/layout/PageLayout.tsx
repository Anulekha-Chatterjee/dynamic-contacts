import { useMemo, useState } from 'react';
import type {
  AppConfig,
  ContactFieldValue,
  ContactRecord,
  LayoutColumn,
  ResolvedContactField,
} from '../../types/config';
import { buildGridTemplateColumns } from '../../utils/buildGridTemplateColumns';
import { getContactDisplayName } from '../../utils/resolveFields';
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

type LayoutMode = 'balanced' | 'conversation';

const LAYOUT_MODES: Array<{ id: LayoutMode; label: string }> = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'conversation', label: 'Conversation' },
];

function getRuntimeColumns(columns: LayoutColumn[], layoutMode: LayoutMode) {
  if (layoutMode === 'balanced') return columns;

  return columns.map((column) =>
    column.component === 'conversations'
      ? { ...column, width: '100%', visible: true }
      : { ...column, visible: false },
  );
}

function isColumnVisible(column: LayoutColumn, panels: PanelVisibility): boolean {
  if (!column.visible) return false;
  if (column.component === 'contact' && !panels.contactPanelOpen) return false;
  if (column.component === 'notes' && !panels.notesPanelOpen) return false;
  return true;
}

function renderColumn(
  config: AppConfig,
  contacts: ContactRecord[],
  column: LayoutColumn,
  panels: PanelVisibility,
  contactIndex: number,
  onPreviousContact: () => void,
  onNextContact: () => void,
  onContactPanelBack: () => void,
  onContactFieldUpdate: (
    contactId: string,
    field: ResolvedContactField,
    value: ContactFieldValue,
  ) => void,
  onContactTagsChange: (contactId: string, tags: string[]) => void,
  onNotesPanelClose: () => void,
) {
  if (!isColumnVisible(column, panels)) return null;

  switch (column.component) {
    case 'contact':
      return (
        <ContactPanel
          key={column.id}
          contacts={contacts}
          contactFields={config.contactFields}
          contactIndex={contactIndex}
          onPreviousContact={onPreviousContact}
          onNextContact={onNextContact}
          onBackClick={onContactPanelBack}
          onContactFieldUpdate={onContactFieldUpdate}
          onContactTagsChange={onContactTagsChange}
        />
      );
    case 'conversations':
      return (
        <ConversationsPanel
          key={column.id}
          config={config.conversations}
          contactId={contacts[contactIndex]?.id}
          contactName={contacts[contactIndex] ? getContactDisplayName(contacts[contactIndex]) : ''}
        />
      );
    case 'notes':
      return (
        <NotesPanel
          key={column.id}
          config={config.notes}
          contactId={contacts[contactIndex]?.id}
          onCloseClick={onNotesPanelClose}
        />
      );
    default:
      return null;
  }
}

export function PageLayout({ config }: PageLayoutProps) {
  const { layout } = config;
  const [contacts, setContacts] = useState(config.contactData.contacts);
  const [contactIndex, setContactIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('balanced');
  const [contactPanelOpen, setContactPanelOpen] = useState(true);
  const [notesPanelOpen, setNotesPanelOpen] = useState(true);

  const panelVisibility = useMemo<PanelVisibility>(
    () => ({ contactPanelOpen, notesPanelOpen }),
    [contactPanelOpen, notesPanelOpen],
  );

  const runtimeColumns = useMemo(
    () => getRuntimeColumns(layout.columns, layoutMode),
    [layout.columns, layoutMode],
  );

  const visibleColumns = useMemo(
    () => runtimeColumns.filter((c) => isColumnVisible(c, panelVisibility)),
    [runtimeColumns, panelVisibility],
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
    setContactIndex((index) => Math.min(contacts.length - 1, index + 1));
  }

  function updateContactField(
    contactId: string,
    field: ResolvedContactField,
    value: ContactFieldValue,
  ) {
    setContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              values: {
                ...contact.values,
                [field.key]: value,
              },
            }
          : contact,
      ),
    );
  }

  function updateContactTags(contactId: string, tags: string[]) {
    setContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              tags,
            }
          : contact,
      ),
    );
  }

  const isFirstContact = contactIndex === 0;
  const isLastContact = contactIndex === contacts.length - 1;

  return (
    <div className="crm-page">
      {!contactPanelOpen && (
        <PanelReopenStrip
          label="Contact Details"
          side="start"
          onClick={toggleContactPanel}
        />
      )}
      <div className="crm-page__workspace">
        <div className="layout-toggle" aria-label="Layout mode">
          {LAYOUT_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`layout-toggle__button ${
                layoutMode === mode.id ? 'layout-toggle__button--active' : ''
              }`}
              onClick={() => setLayoutMode(mode.id)}
              aria-pressed={layoutMode === mode.id}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="crm-page__grid" style={{ gridTemplateColumns }}>
          {runtimeColumns.map((column) =>
            renderColumn(
              config,
              contacts,
              column,
              panelVisibility,
              contactIndex,
              goToPreviousContact,
              goToNextContact,
              toggleContactPanel,
              updateContactField,
              updateContactTags,
              toggleNotesPanel,
            ),
          )}
        </div>
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
