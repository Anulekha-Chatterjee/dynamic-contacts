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

function EmailItem({ item }: { item: Extract<ConversationItem, { type: 'email' }> }) {
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
      <button type="button" className="email-card__reply">
        Reply
      </button>
    </article>
  );
}

function ChatItem({ item }: { item: Extract<ConversationItem, { type: 'chat' }> }) {
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
  return (
    <main className="panel conversations-panel">
      <header className="conversations-panel__header">
        <button type="button" className="conversations-panel__title">
          {config.title}
          <IconChevron />
        </button>
      </header>

      <div className="conversations-panel__feed">
        {config.items.map((item) =>
          item.type === 'email' ? (
            <EmailItem key={item.id} item={item} />
          ) : (
            <ChatItem key={item.id} item={item} />
          ),
        )}
      </div>

      <footer className="conversations-panel__composer">
        {config.composer.typingIndicator && (
          <p className="typing-indicator">{config.composer.typingIndicator}</p>
        )}
        <div className="composer-box">
          <button type="button" className="composer-box__channel" aria-label="Message type">
            ✉
          </button>
          <textarea placeholder={config.composer.placeholder} rows={2} />
          <div className="composer-box__tools">
            <button type="button" aria-label="Attach">
              <IconPaperclip />
            </button>
            <button type="button" aria-label="Emoji">
              <IconSmile />
            </button>
            <button type="button" className="composer-box__send" aria-label="Send">
              <IconSend />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
