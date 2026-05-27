import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { ConversationItem, ConversationsConfig } from '../../types/config';
import { AvatarInitials } from '../common/AvatarInitials';
import {
  IconChevron,
  IconMore,
  IconPaperclip,
  IconSend,
  IconSmile,
  IconStar,
} from '../icons/Icons';
import './ConversationsPanel.css';

interface ConversationsPanelProps {
  config: ConversationsConfig;
}

type EmailConversationItem = Extract<ConversationItem, { type: 'email' }>;
type ChatConversationItem = Extract<ConversationItem, { type: 'chat' }>;

function EmailItem({
  item,
  onReply,
}: {
  item: EmailConversationItem;
  onReply: (item: EmailConversationItem) => void;
}) {
  const paragraphs = item.body.split('\n');
  return (
    <article className="email-card">
      <div className="email-card__subject">
        <span>{item.subject}</span>
        <button type="button" aria-label="Expand">⤢</button>
      </div>
      <div className="email-card__meta">
        <AvatarInitials name={item.sender.name} size="xl" />
        <div className="email-card__sender">
          <strong>{item.sender.name}</strong>
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

function ChatItem({ item }: { item: ChatConversationItem }) {
  return (
    <div className="chat-bubble">
      {item.channel === 'whatsapp' && <span className="chat-bubble__icon">💬</span>}
      <div className="chat-bubble__content">
        <span className="chat-bubble__sender">{item.sender}:</span> {item.message}
        <span className="chat-bubble__time">{item.timestamp}</span>
      </div>
    </div>
  );
}

export function ConversationsPanel({ config }: ConversationsPanelProps) {
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [items, setItems] = useState(config.items);
  const [message, setMessage] = useState('');
  const [replyTarget, setReplyTarget] = useState<EmailConversationItem | null>(null);

  function toggleMobilePanel() {
    setMobileCollapsed((collapsed) => !collapsed);
  }

  function handleReply(item: EmailConversationItem) {
    setReplyTarget(item);
    setMobileCollapsed(false);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  }

  function clearReplyTarget() {
    setReplyTarget(null);
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
      timestamp: replyTarget ? `Just now · Re: ${replyTarget.subject}` : 'Just now',
    };

    setItems((currentItems) => [...currentItems, newMessage]);
    setMessage('');
    setReplyTarget(null);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage();
    }
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
          {config.title}
          <IconChevron className={mobileCollapsed ? '' : 'expanded'} />
        </button>
      </header>

      <div className="conversations-panel__feed">
        {items.map((item) =>
          item.type === 'email' ? (
            <EmailItem key={item.id} item={item} onReply={handleReply} />
          ) : (
            <ChatItem key={item.id} item={item} />
          ),
        )}
      </div>

      <footer className="conversations-panel__composer">
        {config.composer.typingIndicator && (
          <p className="typing-indicator">{config.composer.typingIndicator}</p>
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
            ✉
          </button>
          <textarea
            ref={composerRef}
            placeholder={
              replyTarget ? `Reply to ${replyTarget.sender.name}...` : config.composer.placeholder
            }
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleComposerKeyDown}
          />
          <div className="composer-box__tools">
            <button type="button" aria-label="Attach">
              <IconPaperclip />
            </button>
            <button type="button" aria-label="Emoji">
              <IconSmile />
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
