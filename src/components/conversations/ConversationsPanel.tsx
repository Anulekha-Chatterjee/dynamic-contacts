import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import type { ConversationItem, ConversationsConfig } from '../../types/config';
import { AvatarInitials } from '../common/AvatarInitials';
import { IconChevron, IconConversation, IconMail, IconMore, IconSend, IconStar } from '../icons/Icons';
import './ConversationsPanel.css';

interface ConversationsPanelProps {
  config: ConversationsConfig;
  contactId?: string;
  contactName?: string;
}

type EmailConversationItem = Extract<ConversationItem, { type: 'email' }>;
type ChatConversationItem = Extract<ConversationItem, { type: 'chat' }>;

function EmailItem({
  item,
  displayName,
  onReply,
}: {
  item: EmailConversationItem;
  displayName?: string;
  onReply: (item: EmailConversationItem) => void;
}) {
  const paragraphs = item.body.split('\n');
  const senderName = displayName || item.sender.name;

  return (
    <article className="email-card" id={`conversation-${item.id}`}>
      <div className="email-card__subject">
        <span>{item.subject}</span>
        <button type="button" aria-label="Expand">⤢</button>
      </div>
      <div className="email-card__meta">
        <AvatarInitials name={senderName} size="xl" />
        <div className="email-card__sender">
          <strong>{senderName}</strong>
          <span>{item.recipient}</span>
        </div>
        <span className="email-card__time">{item.timestamp}</span>
        <div className="email-card__actions">
          <button type="button" aria-label="Star">
            <IconStar filled={item.starred} />
          </button>
          <button type="button" aria-label="More">
            <IconMore />
          </button>
        </div>
      </div>
      <div className="email-card__body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {item.links?.map((link) => (
          <a key={link.label} href={link.url} className="email-card__link">
            {link.label}
          </a>
        ))}
      </div>
      <button type="button" className="email-card__reply" onClick={() => onReply(item)}>
        Reply
      </button>
    </article>
  );
}

function ChatItem({
  item,
  contactName,
  onReplyLinkClick,
}: {
  item: ChatConversationItem;
  contactName?: string;
  onReplyLinkClick: (itemId: string) => void;
}) {
  const senderName = item.sender === 'You' ? item.sender : contactName || item.sender;

  return (
    <div className="chat-bubble" id={`conversation-${item.id}`}>
      {item.channel === 'whatsapp' && <span className="chat-bubble__icon">💬</span>}
      <div className="chat-bubble__content">
        {item.replyTo && (
          <button
            type="button"
            className="chat-bubble__reply-link"
            onClick={() => onReplyLinkClick(item.replyTo?.id ?? '')}
          >
            Replying to {item.replyTo.label}
          </button>
        )}
        <span className="chat-bubble__sender">{senderName}:</span> {item.message}
        <span className="chat-bubble__time">{item.timestamp}</span>
      </div>
    </div>
  );
}

function getContactFirstName(contactName?: string) {
  return contactName?.trim().split(/\s+/)[0] ?? '';
}

export function ConversationsPanel({
  config,
  contactId = 'default',
  contactName,
}: ConversationsPanelProps) {
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [itemsByContactId, setItemsByContactId] = useState<Record<string, ConversationItem[]>>(
    () => ({}),
  );
  const [messageByContactId, setMessageByContactId] = useState<Record<string, string>>({});
  const [replyTargetByContactId, setReplyTargetByContactId] = useState<
    Record<string, EmailConversationItem | null>
  >({});
  const threadConfig = config.byContactId[contactId];
  const composerConfig = threadConfig?.composer ?? config.composer;
  const seedItems = useMemo(() => threadConfig?.items ?? [], [threadConfig?.items]);
  const items = itemsByContactId[contactId] ?? seedItems;
  const message = messageByContactId[contactId] ?? '';
  const replyTarget = replyTargetByContactId[contactId] ?? null;
  const firstName = getContactFirstName(contactName);
  const typingIndicator = composerConfig.typingIndicator && firstName
    ? `${firstName} is typing...`
    : composerConfig.typingIndicator;
  const placeholder = firstName ? `Message ${firstName}...` : composerConfig.placeholder;

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    if (typeof feed.scrollTo === 'function') {
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
    } else {
      feed.scrollTop = feed.scrollHeight;
    }
  }, [contactId, items.length]);

  function toggleMobilePanel() {
    setMobileCollapsed((collapsed) => !collapsed);
  }

  function handleReply(item: EmailConversationItem) {
    setReplyTargetByContactId((currentTargets) => ({
      ...currentTargets,
      [contactId]: item,
    }));
    setMobileCollapsed(false);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  }

  function clearReplyTarget() {
    setReplyTargetByContactId((currentTargets) => ({
      ...currentTargets,
      [contactId]: null,
    }));
  }

  function handleSubmitMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const newMessage: ChatConversationItem = {
      id: `chat-${Date.now()}`,
      type: 'chat',
      channel: 'sms',
      sender: 'You',
      message: trimmedMessage,
      timestamp: 'Just now',
      replyTo: replyTarget
        ? {
            id: replyTarget.id,
            label: replyTarget.subject,
          }
        : undefined,
    };

    setItemsByContactId((currentItemsByContactId) => ({
      ...currentItemsByContactId,
      [contactId]: [...items, newMessage],
    }));
    setMessageByContactId((currentMessages) => ({
      ...currentMessages,
      [contactId]: '',
    }));
    clearReplyTarget();
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage();
    }
  }

  function scrollToConversationItem(itemId: string) {
    if (!itemId) return;

    document.getElementById(`conversation-${itemId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  return (
    <main
      className={`panel conversations-panel ${
        mobileCollapsed ? 'panel--mobile-collapsed' : ''
      }`}
    >
      <header className="conversations-panel__header">
        <button
          type="button"
          className="conversations-panel__title"
          onClick={toggleMobilePanel}
          aria-expanded={!mobileCollapsed}
        >
          <IconConversation />
          {config.title}
          <IconChevron className={mobileCollapsed ? '' : 'expanded'} />
        </button>
      </header>

      <div className="conversations-panel__feed" ref={feedRef}>
        {items.map((item) =>
          item.type === 'email' ? (
            <EmailItem
              key={item.id}
              item={item}
              displayName={contactName}
              onReply={handleReply}
            />
          ) : (
            <ChatItem
              key={item.id}
              item={item}
              contactName={firstName}
              onReplyLinkClick={scrollToConversationItem}
            />
          ),
        )}
      </div>

      <footer className="conversations-panel__composer">
        {typingIndicator && (
          <p className="typing-indicator">{typingIndicator}</p>
        )}
        {replyTarget && (
          <div className="reply-context">
            <span>Replying to: {replyTarget.subject}</span>
            <button type="button" aria-label="Clear reply" onClick={clearReplyTarget}>
              ×
            </button>
          </div>
        )}
        <form className="composer-box" onSubmit={handleSubmitMessage}>
          <button type="button" className="composer-box__channel" aria-label="Message type">
            <IconMail size={16} />
          </button>
          <textarea
            ref={composerRef}
            placeholder={
              replyTarget
                ? `Reply to ${contactName || replyTarget.sender.name}...`
                : placeholder
            }
            rows={1}
            value={message}
            onChange={(event) =>
              setMessageByContactId((currentMessages) => ({
                ...currentMessages,
                [contactId]: event.target.value,
              }))
            }
            onKeyDown={handleComposerKeyDown}
          />
          <div className="composer-box__tools">
            <button type="button" className="composer-box__sparkle" aria-label="AI assist">
              ✨
            </button>
            <button
              type="submit"
              className="composer-box__send"
              aria-label="Send"
              disabled={!message.trim()}
            >
              <IconSend />
            </button>
          </div>
        </form>
      </footer>
    </main>
  );
}
