import { useMemo, useRef, useState, type FormEvent } from 'react';
import type { Note, NoteMention, NotesConfig } from '../../types/config';
import { IconChevron } from '../icons/Icons';
import './NotesPanel.css';

interface NotesPanelProps {
  config: NotesConfig;
  onCloseClick: () => void;
}

const MENTION_OPTIONS = ['Aaron Site', 'Devon Lane'];

function NoteContent({ note }: { note: Note }) {
  if (!note.mentions?.length) {
    return <p>{note.content}</p>;
  }

  const mentionPattern = new RegExp(
    `(${note.mentions
      .map((mention) => mention.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})`,
    'g',
  );
  const parts = note.content.split(mentionPattern);

  return (
    <p>
      {parts.map((part, index) =>
        note.mentions?.some((mention) => mention.text === part) ? (
          <span key={`${part}-${index}`} className="note-mention">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

function parseMentions(value: string): NoteMention[] {
  const matches = value.match(/@[A-Za-z0-9_-]+(?:\s+[A-Za-z0-9_-]+)?/g) ?? [];
  return Array.from(new Set(matches.map((mention) => mention.trim()))).map((text) => ({
    text,
  }));
}

function getActiveMentionQuery(value: string): string | null {
  const match = value.match(/(?:^|\s)@([A-Za-z0-9_-]*)$/);
  return match ? match[1].toLowerCase() : null;
}

export function NotesPanel({ config, onCloseClick }: NotesPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [notes, setNotes] = useState(config.notes);
  const [addingNote, setAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const activeMentionQuery = getActiveMentionQuery(noteContent);
  const mentionSuggestions = useMemo(() => {
    if (activeMentionQuery === null) return [];
    return MENTION_OPTIONS.filter((name) =>
      name.toLowerCase().includes(activeMentionQuery),
    );
  }, [activeMentionQuery]);

  function handlePanelToggle() {
    setMobileCollapsed((collapsed) => !collapsed);
  }

  function handleAddNote() {
    setAddingNote(true);
    setMobileCollapsed(false);
  }

  function handleCancelNote() {
    setAddingNote(false);
    setNoteContent('');
  }

  function handleSubmitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = noteContent.trim();
    if (!content) return;

    const mentions = parseMentions(content);
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      mentions: mentions.length ? mentions : undefined,
      timestamp: 'Just now',
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    handleCancelNote();
  }

  function insertMention(name: string) {
    const nextValue = noteContent.replace(/(^|\s)@[A-Za-z0-9_-]*$/, `$1@${name} `);
    const nextCursorPosition = nextValue.length;

    setNoteContent(nextValue);
    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    }, 0);
  }

  return (
    <aside className={`panel notes-panel ${mobileCollapsed ? 'panel--mobile-collapsed' : ''}`}>
      <header className="notes-panel__header">
        <button
          type="button"
          className="notes-panel__title"
          onClick={handlePanelToggle}
          aria-expanded={!mobileCollapsed}
        >
          {config.title}
          <IconChevron className={mobileCollapsed ? '' : 'expanded'} />
        </button>
        <div className="notes-panel__actions">
          <button type="button" className="btn-add" onClick={handleAddNote}>
            + Add
          </button>
          <button
            type="button"
            className="btn-close"
            onClick={onCloseClick}
            aria-label="Hide notes"
          >
            ×
          </button>
        </div>
      </header>

      <div className="notes-panel__list">
        {addingNote && (
          <form className="note-composer" onSubmit={handleSubmitNote}>
            <label>
              <span>Note</span>
              <textarea
                ref={textareaRef}
                value={noteContent}
                placeholder="Add a note... use @name to mention someone"
                rows={4}
                onChange={(event) => setNoteContent(event.target.value)}
                autoFocus
              />
            </label>
            {mentionSuggestions.length > 0 && (
              <div className="mention-menu">
                {mentionSuggestions.map((name) => (
                  <button key={name} type="button" onClick={() => insertMention(name)}>
                    @{name}
                  </button>
                ))}
              </div>
            )}
            <div className="note-composer__actions">
              <button type="button" onClick={handleCancelNote}>
                Cancel
              </button>
              <button type="submit" disabled={!noteContent.trim()}>
                Save
              </button>
            </div>
          </form>
        )}

        {notes.map((note) => (
          <article key={note.id} className="note-card">
            <NoteContent note={note} />
            <time>{note.timestamp}</time>
          </article>
        ))}
      </div>
    </aside>
  );
}
