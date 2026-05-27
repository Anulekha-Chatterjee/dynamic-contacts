import { useMemo, useState } from 'react';
import type { ContactFieldsConfig, ContactRecord } from '../../types/config';
import {
  getContactDisplayName,
  getContactPhone,
  resolveFieldFolders,
} from '../../utils/resolveFields';
import { AvatarInitials } from '../common/AvatarInitials';
import { IconBack, IconChevron, IconFilter, IconPhone, IconSearch } from '../icons/Icons';
import { FieldFolder } from './FieldFolder';
import './ContactPanel.css';

const ACTION_TABS = [
  { id: 'all', label: 'All Fields' },
  { id: 'dnd', label: 'DND' },
  { id: 'actions', label: 'Actions' },
] as const;
const MORE_TAGS_COUNT = 15;

interface ContactPanelProps {
  contacts: ContactRecord[];
  contactFields: ContactFieldsConfig;
  onBackClick: () => void;
}

export function ContactPanel({ contacts, contactFields, onBackClick }: ContactPanelProps) {
  const [contactIndex, setContactIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>(ACTION_TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const contact = contacts[contactIndex];
  const fullName = contact ? getContactDisplayName(contact) : '';
  const phone = contact ? getContactPhone(contact) : '';

  const resolvedFolders = useMemo(
    () => (contact ? resolveFieldFolders(contactFields, contact) : []),
    [contactFields, contact],
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
            f.displayValue.toLowerCase().includes(q),
        ),
    );
  }, [resolvedFolders, searchQuery]);

  const searchPlaceholder =
    contactFields.searchPlaceholder ?? 'Search Fields and Folders';

  function goToPrevious() {
    setContactIndex((i) => Math.max(0, i - 1));
  }

  function goToNext() {
    setContactIndex((i) => Math.min(contacts.length - 1, i + 1));
  }

  if (!contact) {
    return (
      <aside className="panel contact-panel">
        <header className="contact-panel__top">
          <button
            type="button"
            className="contact-panel__back"
            onClick={onBackClick}
            aria-label="Hide contact details"
          >
            <IconBack />
            <span>Contact Details</span>
          </button>
        </header>
        <div className="contact-panel__scroll">
          <p className="contact-panel__empty">No contacts available.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="panel contact-panel">
      <div className="contact-panel__scroll">
      <header className="contact-panel__top">
        <button
          type="button"
          className="contact-panel__back"
          onClick={onBackClick}
          aria-label="Hide contact details"
          aria-expanded={true}
        >
          <IconBack />
          <span>Contact Details</span>
        </button>
        <div className="contact-panel__pagination">
          <span>
            {contactIndex + 1} of {contacts.length}
          </span>
          <button
            type="button"
            aria-label="Previous contact"
            onClick={goToPrevious}
            disabled={contactIndex === 0}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next contact"
            onClick={goToNext}
            disabled={contactIndex === contacts.length - 1}
          >
            ›
          </button>
        </div>
      </header>

      <div className="contact-panel__profile">
        <AvatarInitials name={fullName} size="lg" className="contact-panel__avatar" />
        <div className="contact-panel__name-row">
          <h1 className="contact-panel__name">{fullName}</h1>
          {phone && (
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
          placeholder={searchPlaceholder}
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
      </div>
    </aside>
  );
}
