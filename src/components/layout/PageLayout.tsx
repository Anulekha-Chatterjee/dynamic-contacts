import { config } from '../../config/loadConfig';
import type { LayoutColumn } from '../../types/config';
import { ContactPanel } from '../contact/ContactPanel';
import { ConversationsPanel } from '../conversations/ConversationsPanel';
import { NotesPanel } from '../notes/NotesPanel';
import { UtilitySidebar } from './UtilitySidebar';
import './PageLayout.css';

function renderColumn(column: LayoutColumn) {
  if (!column.visible) return null;

  switch (column.component) {
    case 'contact':
      return <ContactPanel key={column.id} contact={config.contact} fields={config.fields} />;
    case 'conversations':
      return <ConversationsPanel key={column.id} config={config.conversations} />;
    case 'notes':
      return <NotesPanel key={column.id} config={config.notes} />;
    default:
      return null;
  }
}

export function PageLayout() {
  const { layout } = config;

  return (
    <div className="crm-page">
      <div
        className="crm-page__grid"
        style={{
          gridTemplateColumns: layout.columns
            .filter((c) => c.visible)
            .map((c) => c.width)
            .join(' '),
        }}
      >
        {layout.columns.map((column) => renderColumn(column))}
      </div>
      <UtilitySidebar config={layout.utilitySidebar} />
    </div>
  );
}
