import { useMemo, useState } from 'react';
import type { ContactConfig, FieldsConfig } from '../../types/config';
import { resolveFieldFolders } from '../../utils/resolveFields';
import { AvatarInitials } from '../common/AvatarInitials';
import { IconBack, IconChevron, IconFilter, IconPhone, IconSearch } from '../icons/Icons';
import { FieldFolder } from './FieldFolder';
import './ContactPanel.css';

const PAGINATION = { current: 1, total: 356 };
const ACTION_TABS = [
  { id: 'all', label: 'All Fields', active: true },
  { id: 'dnd', label: 'DND' },
  { id: 'actions', label: 'Actions' },
] as const;
const FIELDS_SEARCH_PLACEHOLDER = 'Search Fields and Folders';
const MORE_TAGS_COUNT = 15;

interface ContactPanelProps {
  contact: ContactConfig;
  fields: FieldsConfig;
}

export function ContactPanel({ contact, fields }: ContactPanelProps) {
  const [activeTab, setActiveTab] = useState<string>(ACTION_TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const fullName = `${contact.firstName} ${contact.lastName}`;

  const resolvedFolders = useMemo(
    () => resolveFieldFolders(fields, contact),
    [fields, contact],
  );

  const visibleFolders = useMemo(() => {
    if (!searchQuery.trim()) return resolvedFolders;
    const q = searchQuery.toLowerCase();
    return resolvedFolders.filter(
      (folder) =>
        folder.label.toLowerCase().includes(q) ||
        folder.fields.some(
          (f) =>
            f.label.toLowerCase().includes(q) ||
            (f.value ?? '').toLowerCase().includes(q),
        ),
    );
  }, [resolvedFolders, searchQuery]);

  return (
    <aside className="panel contact-panel">
      <header className="contact-panel__top">
        <button type="button" className="contact-panel__back" aria-label="Go back">
          <IconBack />
          <span>Contact Details</span>
        </button>
        <div className="contact-panel__pagination">
          <span>
            {PAGINATION.current} of {PAGINATION.total}
          </span>
          <button type="button" aria-label="Previous contact">
            ‹
          </button>
          <button type="button" aria-label="Next contact">
            ›
          </button>
        </div>
      </header>

      <div className="contact-panel__profile">
        <AvatarInitials name={fullName} size="lg" className="contact-panel__avatar" />
        <div className="contact-panel__name-row">
          <h1 className="contact-panel__name">{fullName}</h1>
          {contact.phone && (
            <button type="button" className="contact-panel__call" aria-label="Call contact">
              <IconPhone />
            </button>
          )}
        </div>
      </div>

      <div className="contact-panel__meta">
        <div className="meta-row">
          <span className="meta-row__label">Owner</span>
          <div className="meta-row__value">
            <AvatarInitials name={contact.owner} size="sm" />
            <span>{contact.owner}</span>
          </div>
        </div>
        <div className="meta-row">
          <span className="meta-row__label">Followers</span>
          <div className="meta-row__value meta-row__followers">
            {contact.followers.map((follower) => (
              <AvatarInitials
                key={follower}
                name={follower}
                size="md"
                className="follower-avatar"
              />
            ))}
            <IconChevron size={14} />
          </div>
        </div>
        <div className="meta-row">
          <span className="meta-row__label">Tags</span>
          <div className="meta-row__tags">
            {contact.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" aria-label={`Remove ${tag}`}>
                  ×
                </button>
              </span>
            ))}
            <span className="tag tag--more">+{MORE_TAGS_COUNT}</span>
            <button type="button" className="tag-add" aria-label="Add tag">
              +
            </button>
          </div>
        </div>
      </div>

      <div className="contact-panel__tabs">
        {ACTION_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="contact-panel__search">
        <IconSearch className="search-icon" />
        <input
          type="search"
          placeholder={FIELDS_SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" className="filter-btn" aria-label="Filter fields">
          <IconFilter />
        </button>
      </div>

      <div className="contact-panel__folders">
        {visibleFolders.map((folder) => (
          <FieldFolder key={folder.id} folder={folder} searchQuery={searchQuery} />
        ))}
      </div>
    </aside>
  );
}
