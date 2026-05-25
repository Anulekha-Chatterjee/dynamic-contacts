import { useMemo, useState } from 'react';
import type { ContactConfig, FieldsConfig } from '../../types/config';
import { IconBack, IconChevron, IconFilter, IconPhone, IconSearch } from '../icons/Icons';
import { FieldFolder } from './FieldFolder';
import './ContactPanel.css';

interface ContactPanelProps {
  contact: ContactConfig;
  fields: FieldsConfig;
}

export function ContactPanel({ contact, fields }: ContactPanelProps) {
  const [activeTab, setActiveTab] = useState(
    contact.actionTabs.find((t) => t.active)?.id ?? contact.actionTabs[0]?.id,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const fullName = `${contact.profile.firstName} ${contact.profile.lastName}`;

  const visibleFolders = useMemo(() => {
    if (!searchQuery.trim()) return fields.folders;
    const q = searchQuery.toLowerCase();
    return fields.folders.filter(
      (folder) =>
        folder.label.toLowerCase().includes(q) ||
        folder.fields.some(
          (f) => f.label.toLowerCase().includes(q) || f.value.toLowerCase().includes(q),
        ),
    );
  }, [fields.folders, searchQuery]);

  return (
    <aside className="panel contact-panel">
      <header className="contact-panel__top">
        <button type="button" className="contact-panel__back" aria-label="Go back">
          <IconBack />
          <span>Contact Details</span>
        </button>
        <div className="contact-panel__pagination">
          <span>
            {contact.pagination.current} of {contact.pagination.total}
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
        <img src={contact.profile.avatarUrl} alt="" className="contact-panel__avatar" />
        <div className="contact-panel__name-row">
          <h1 className="contact-panel__name">{fullName}</h1>
          {contact.profile.phoneAction.enabled && (
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
            <img src={contact.owner.avatarUrl} alt="" />
            <span>{contact.owner.name}</span>
          </div>
        </div>
        <div className="meta-row">
          <span className="meta-row__label">Followers</span>
          <div className="meta-row__value meta-row__followers">
            {contact.followers.map((f) => (
              <img key={f.id} src={f.avatarUrl} alt="" className="follower-avatar" />
            ))}
            <IconChevron size={14} />
          </div>
        </div>
        <div className="meta-row">
          <span className="meta-row__label">Tags</span>
          <div className="meta-row__tags">
            {contact.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.label}
                {tag.removable && <button type="button" aria-label={`Remove ${tag.label}`}>×</button>}
              </span>
            ))}
            {contact.moreTagsCount != null && (
              <span className="tag tag--more">+{contact.moreTagsCount}</span>
            )}
            <button type="button" className="tag-add" aria-label="Add tag">
              +
            </button>
          </div>
        </div>
      </div>

      <div className="contact-panel__tabs">
        {contact.actionTabs.map((tab) => (
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
          placeholder={contact.fieldsSearch.placeholder}
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
