import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import type {
  ConversationItem,
  ConversationsDataConfig,
  ConversationsFieldsConfig,
} from '../../types/config';
import { AvatarInitials } from '../common/AvatarInitials';
import {
  IconChevron,
  IconConversation,
  IconMail,
  IconMore,
  IconSend,
  IconStar,
} from '../icons/Icons';
import './ConversationsPanel.css';

interface ConversationsPanelProps {
  data: ConversationsDataConfig;
  fields: ConversationsFieldsConfig;
  contactId?: string;
  contactName?: string;
}

type EmailConversationItem = Extract<ConversationItem, { type: 'email' }>;
type ChatConversationItem = Extract<ConversationItem, { type: 'chat' }>;
type ConversationViewConfig = ConversationsFieldsConfig['view'];

function EmailItem({
  item,
  displayName,
  view,
  onReply,
}: {
  item: EmailConversationItem;
  displayName?: string;
  view: ConversationViewConfig;
  onReply: (item: EmailConversationItem) => void;
}) {
  const paragraphs = item.body.split('\n');
  const senderName = displayName || item.sender.name;

  return (
    <article className="email-card" id={`conversation-${item.id}`}>
      <div className="email-card__subject">
        <span>{item.subject}</span>
        {view.email?.showExpandAction !== false && (
          <button type="button" aria-label="Expand">⤢</button>
        )}
      </div>
      <div className="email-card__meta">
        {view.email?.showAvatar !== false && <AvatarInitials name={senderName} size="xl" />}
        <div className="email-card__sender">
          <strong>{senderName}</strong>
          <span>{item.recipient}</span>
        </div>
        <span className="email-card__time">{item.timestamp}</span>
        {(view.email?.showStarAction !== false || view.email?.showMoreAction !== false) && (
          <div className="email-card__actions">
            {view.email?.showStarAction !== false && (
              <button type="button" aria-label="Star">
                <IconStar filled={item.starred} />
              </button>
            )}
            {view.email?.showMoreAction !== false && (
              <button type="button" aria-label="More">
                <IconMore />
              </button>
            )}
          </div>
        )}
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
      {view.email?.showReplyAction !== false && (
        <button type="button" className="email-card__reply" onClick={() => onReply(item)}>
          Reply
        </button>
      )}
    </article>
  );
}

function ChatItem({
  item,
  contactName,
  view,
  onReplyLinkClick,
}: {
  item: ChatConversationItem;
  contactName?: string;
  view: ConversationViewConfig;
  onReplyLinkClick: (itemId: string) => void;
}) {
  const senderName = item.sender === 'You' ? item.sender : contactName || item.sender;

  return (
    <div className="chat-bubble" id={`conversation-${item.id}`}>
      {view.chat?.showChannelIcon !== false && item.channel === 'whatsapp' && (
        <span className="chat-bubble__icon">💬</span>
      )}
      <div className="chat-bubble__content">
        {view.chat?.showReplyPreview !== false && item.replyTo && (
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
  data,
  fields,
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
  const threadConfig = data.byContactId[contactId];
  const viewConfig: ConversationViewConfig = {
    showHeaderIcon: fields.view.showHeaderIcon ?? true,
    emptyState: fields.view.emptyState ?? 'No conversations yet.',
    email: {
      showAvatar: fields.view.email?.showAvatar ?? true,
      showStarAction: fields.view.email?.showStarAction ?? true,
      showMoreAction: fields.view.email?.showMoreAction ?? true,
      showExpandAction: fields.view.email?.showExpandAction ?? true,
      showReplyAction: fields.view.email?.showReplyAction ?? true,
    },
    chat: {
      showChannelIcon: fields.view.chat?.showChannelIcon ?? true,
      showReplyPreview: fields.view.chat?.showReplyPreview ?? true,
    },
    composer: {
      enabled: fields.view.composer?.enabled ?? true,
      showChannelButton: fields.view.composer?.showChannelButton ?? true,
      showAiAssist: fields.view.composer?.showAiAssist ?? true,
      sendOnEnter: fields.view.composer?.sendOnEnter ?? true,
    },
  };
  const composerConfig = threadConfig?.composer ?? data.composer;
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
    if (viewConfig.composer?.sendOnEnter !== false && event.key === 'Enter' && !event.shiftKey) {
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
          {viewConfig.showHeaderIcon !== false && <IconConversation />}
          {data.title}
          <IconChevron className={mobileCollapsed ? '' : 'expanded'} />
        </button>
      </header>

      <div className="conversations-panel__feed" ref={feedRef}>
        {items.length === 0 ? (
          <p className="conversation-empty">{viewConfig.emptyState}</p>
        ) : (
          items.map((item) =>
            item.type === 'email' ? (
              <EmailItem
                key={item.id}
                item={item}
                displayName={contactName}
                view={viewConfig}
                onReply={handleReply}
              />
            ) : (
              <ChatItem
                key={item.id}
                item={item}
                contactName={firstName}
                view={viewConfig}
                onReplyLinkClick={scrollToConversationItem}
              />
            ),
          )
        )}
      </div>

      {viewConfig.composer?.enabled !== false && (
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
            {viewConfig.composer?.showChannelButton !== false && (
              <button type="button" className="composer-box__channel" aria-label="Message type">
                <IconMail size={16} />
              </button>
            )}
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
              {viewConfig.composer?.showAiAssist !== false && (
                <button type="button" className="composer-box__sparkle" aria-label="AI assist">
                  ✨
                </button>
              )}
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
      )}
    </main>
  );
}
