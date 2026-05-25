import type { Note, NotesConfig } from '../../types/config';
import './NotesPanel.css';

interface NotesPanelProps {
  config: NotesConfig;
}

function NoteContent({ note }: { note: Note }) {
  if (!note.mentions?.length) {
    return <p>{note.content}</p>;
  }

  const mention = note.mentions[0];
  const idx = note.content.indexOf(mention.text.replace('@', ''));
  if (idx === -1) {
    return (
      <p>
        {note.content}
        <span className="note-mention">{mention.text}</span>
      </p>
    );
  }

  return (
    <p>
      {note.content}
      <span className="note-mention">{mention.text}</span>
    </p>
  );
}

export function NotesPanel({ config }: NotesPanelProps) {
  return (
    <aside className="panel notes-panel">
      <header className="notes-panel__header">
        <h2>{config.title}</h2>
        <div className="notes-panel__actions">
          <button type="button" className="btn-add">
            + Add
          </button>
          <button type="button" className="btn-close" aria-label="Close notes">
            ×
          </button>
        </div>
      </header>

      <div className="notes-panel__list">
        {config.notes.map((note) => (
          <article key={note.id} className="note-card">
            <NoteContent note={note} />
            <time>{note.timestamp}</time>
          </article>
        ))}
      </div>
    </aside>
  );
}
