import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type {
  AppConfig,
  ContactFieldValue,
  ContactRecord,
  LayoutColumn,
  LayoutModeConfig,
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

interface PageLayoutProps {
  config: AppConfig;
}

interface PanelRendererProps {
  config: AppConfig;
  contacts: ContactRecord[];
  column: LayoutColumn;
  contactIndex: number;
  onPreviousContact: () => void;
  onNextContact: () => void;
  onContactPanelBack: () => void;
  onContactFieldUpdate: (
    contactId: string,
    field: ResolvedContactField,
    value: ContactFieldValue,
  ) => void;
  onContactTagsChange: (contactId: string, tags: string[]) => void;
  onNotesPanelClose: () => void;
}

function getLayoutModes(layoutColumns: LayoutColumn[], modes?: LayoutModeConfig[]) {
  return modes?.length
    ? modes
    : [{ id: 'default', label: 'Default', columns: layoutColumns }];
}

function isColumnVisible(column: LayoutColumn, collapsedColumnIds: Set<string>): boolean {
  if (!column.visible) return false;
  if (collapsedColumnIds.has(column.id)) return false;
  return true;
}

function UnsupportedPanel({ column }: { column: LayoutColumn }) {
  return (
    <section className="panel unsupported-panel">
      <strong>Unsupported panel</strong>
      <span>{column.component}</span>
    </section>
  );
}

const panelRegistry: Record<string, (props: PanelRendererProps) => ReactElement> = {
  contact: ({
    config,
    contacts,
    column,
    contactIndex,
    onPreviousContact,
    onNextContact,
    onContactPanelBack,
    onContactFieldUpdate,
    onContactTagsChange,
  }) => (
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
  ),
  conversations: ({ config, contacts, column, contactIndex }) => (
    <ConversationsPanel
      key={column.id}
      config={config.conversations}
      contactId={contacts[contactIndex]?.id}
      contactName={contacts[contactIndex] ? getContactDisplayName(contacts[contactIndex]) : ''}
    />
  ),
  notes: ({ config, contacts, column, contactIndex, onNotesPanelClose }) => (
    <NotesPanel
      key={column.id}
      config={config.notes}
      contactId={contacts[contactIndex]?.id}
      onCloseClick={onNotesPanelClose}
    />
  ),
};

function renderColumn(
  config: AppConfig,
  contacts: ContactRecord[],
  column: LayoutColumn,
  collapsedColumnIds: Set<string>,
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
  if (!isColumnVisible(column, collapsedColumnIds)) return null;

  const renderPanel = panelRegistry[column.component];
  if (!renderPanel) return <UnsupportedPanel key={column.id} column={column} />;

  return renderPanel({
    config,
    contacts,
    column,
    contactIndex,
    onPreviousContact,
    onNextContact,
    onContactPanelBack,
    onContactFieldUpdate,
    onContactTagsChange,
    onNotesPanelClose,
  });
}

export function PageLayout({ config }: PageLayoutProps) {
  const { layout } = config;
  const layoutModes = useMemo(
    () => getLayoutModes(layout.columns, layout.modes),
    [layout.columns, layout.modes],
  );
  const [contacts, setContacts] = useState(config.contactData.contacts);
  const [contactIndex, setContactIndex] = useState(0);
  const [layoutModeId, setLayoutModeId] = useState(layoutModes[0].id);
  const [collapsedColumnIds, setCollapsedColumnIds] = useState<Set<string>>(() => new Set());

  const activeLayoutMode = useMemo(
    () => layoutModes.find((mode) => mode.id === layoutModeId) ?? layoutModes[0],
    [layoutModeId, layoutModes],
  );
  const runtimeColumns = activeLayoutMode.columns;

  const visibleColumns = useMemo(
    () => runtimeColumns.filter((column) => isColumnVisible(column, collapsedColumnIds)),
    [runtimeColumns, collapsedColumnIds],
  );

  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(visibleColumns),
    [visibleColumns],
  );

  function toggleColumn(columnId: string) {
    setCollapsedColumnIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(columnId)) {
        nextIds.delete(columnId);
      } else {
        nextIds.add(columnId);
      }

      return nextIds;
    });
  }

  function selectLayoutMode(modeId: string) {
    setLayoutModeId(modeId);
    setCollapsedColumnIds(new Set());
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
  const collapsedStartColumns = runtimeColumns.filter(
    (column) =>
      column.collapsible &&
      column.visible &&
      collapsedColumnIds.has(column.id) &&
      column.reopenSide !== 'end',
  );
  const collapsedEndColumns = runtimeColumns.filter(
    (column) =>
      column.collapsible &&
      column.visible &&
      collapsedColumnIds.has(column.id) &&
      column.reopenSide === 'end',
  );

  return (
    <div className="crm-page">
      {collapsedStartColumns.map((column) => (
        <PanelReopenStrip
          key={column.id}
          label={column.reopenLabel ?? column.id}
          side={column.reopenSide ?? 'start'}
          onClick={() => toggleColumn(column.id)}
        />
      ))}
      <div className="crm-page__workspace">
        <div className="layout-toggle" aria-label="Layout mode">
          {layoutModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`layout-toggle__button ${
                layoutModeId === mode.id ? 'layout-toggle__button--active' : ''
              }`}
              onClick={() => selectLayoutMode(mode.id)}
              aria-pressed={layoutModeId === mode.id}
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
              collapsedColumnIds,
              contactIndex,
              goToPreviousContact,
              goToNextContact,
              () => toggleColumn(column.id),
              updateContactField,
              updateContactTags,
              () => toggleColumn(column.id),
            ),
          )}
        </div>
      </div>
      {collapsedEndColumns.map((column) => (
        <PanelReopenStrip
          key={column.id}
          label={column.reopenLabel ?? column.id}
          side="end"
          onClick={() => toggleColumn(column.id)}
        />
      ))}
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
