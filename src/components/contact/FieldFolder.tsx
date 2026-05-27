import { useState } from 'react';
import type {
  ContactFieldValue,
  ResolvedContactField,
  ResolvedContactFieldFolder,
} from '../../types/config';
import { IconChevron } from '../icons/Icons';
import { FieldRow } from './FieldRow';
import './ContactPanel.css';

interface FieldFolderProps {
  folder: ResolvedContactFieldFolder;
  searchQuery: string;
  onFieldUpdate: (field: ResolvedContactField, value: ContactFieldValue) => void;
}

function folderMatchesSearch(folder: ResolvedContactFieldFolder, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (folder.label.toLowerCase().includes(q)) return true;
  return folder.fields.some(
    (f) =>
      f.label.toLowerCase().includes(q) || f.displayValue.toLowerCase().includes(q),
  );
}

export function FieldFolder({ folder, searchQuery, onFieldUpdate }: FieldFolderProps) {
  const [expanded, setExpanded] = useState(folder.defaultExpanded ?? true);
  const [editing, setEditing] = useState(false);

  if (!folderMatchesSearch(folder, searchQuery)) return null;

  const visibleFields = searchQuery
    ? folder.fields.filter(
        (f) =>
          f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.displayValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          folder.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : folder.fields;

  if (visibleFields.length === 0 && searchQuery) return null;

  const addFieldAction = folder.actions?.addField;
  const canAddField = Boolean(addFieldAction?.enabled && folder.fields.length);
  const hasNameFields = visibleFields.some(
    (field) => field.key === 'firstName' || field.key === 'lastName',
  );

  function toggleEditing() {
    setEditing((isEditing) => !isEditing);
    setExpanded(true);
  }

  return (
    <section className={`field-folder ${editing ? 'field-folder--editing' : ''}`}>
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
          {canAddField && (
            <button type="button" className="field-folder__add" onClick={toggleEditing}>
              {editing ? 'Done' : addFieldAction?.label ?? '+ Add'}
            </button>
          )}
        </div>
      </header>
      {expanded && (
        <div
          className={`field-folder__body ${
            editing || hasNameFields ? 'field-folder__body--grid' : ''
          }`}
        >
          {visibleFields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              editing={editing}
              onValueChange={onFieldUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
