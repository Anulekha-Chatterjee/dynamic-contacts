import { useState } from 'react';
import type { FieldFolder as FieldFolderType } from '../../types/config';
import { IconChevron } from '../icons/Icons';
import { FieldRow } from './FieldRow';
import './ContactPanel.css';

interface FieldFolderProps {
  folder: FieldFolderType;
  searchQuery: string;
}

function folderMatchesSearch(folder: FieldFolderType, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (folder.label.toLowerCase().includes(q)) return true;
  return folder.fields.some(
    (f) =>
      f.label.toLowerCase().includes(q) || (f.value ?? '').toLowerCase().includes(q),
  );
}

export function FieldFolder({ folder, searchQuery }: FieldFolderProps) {
  const [expanded, setExpanded] = useState(folder.defaultExpanded);

  if (!folderMatchesSearch(folder, searchQuery)) return null;

  const visibleFields = searchQuery
    ? folder.fields.filter(
        (f) =>
          f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (f.value ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          folder.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : folder.fields;

  if (visibleFields.length === 0 && searchQuery) return null;

  return (
    <section className="field-folder">
      <header className="field-folder__header">
        <div className="field-folder__toggle">
          <button
            type="button"
            className="field-folder__title-btn"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            <span className="field-folder__title">{folder.label}</span>
            <IconChevron className={`field-folder__chevron ${expanded ? 'expanded' : ''}`} />
          </button>
          <button type="button" className="field-folder__add">
            + Add
          </button>
        </div>
      </header>
      {expanded && (
        <div className="field-folder__body">
          {visibleFields.map((field) => (
            <FieldRow key={field.key} field={field} />
          ))}
        </div>
      )}
    </section>
  );
}
