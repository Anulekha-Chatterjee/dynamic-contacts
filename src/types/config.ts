export type ContactFieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'date'
  | 'single_select'
  | 'multi_select'
  | 'country';

export type ContactFieldValue = string | string[];

export interface LayoutColumn {
  id: string;
  component: string;
  width: string;
  visible: boolean;
  collapsible?: boolean;
  reopenLabel?: string;
  reopenSide?: 'start' | 'end';
}

export interface LayoutModeConfig {
  id: string;
  label: string;
  columns: LayoutColumn[];
}

export interface PageLayoutConfig {
  columns: LayoutColumn[];
  modes?: LayoutModeConfig[];
  utilitySidebar: {
    visible: boolean;
    activeIconId?: string;
    icons: Array<{ id: string; label: string; icon: string }>;
  };
}

export interface ContactRecord {
  id: string;
  owner: string;
  followers: string[];
  tags: string[];
  values: Record<string, ContactFieldValue>;
}

export interface ContactDataConfig {
  contacts: ContactRecord[];
}

export interface ContactFieldSchema {
  id: string;
  key: string;
  label: string;
  type: ContactFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  countryCode?: string;
}

export interface ContactFieldFolder {
  id: string;
  label: string;
  defaultExpanded?: boolean;
  actions?: {
    addField?: {
      enabled: boolean;
      label?: string;
    };
  };
  fields: ContactFieldSchema[];
}

export interface ContactFieldsConfig {
  version?: number;
  searchPlaceholder?: string;
  folders: ContactFieldFolder[];
}

export interface ResolvedContactField extends ContactFieldSchema {
  rawValue?: ContactFieldValue;
  displayValue: string;
}

export interface ResolvedContactFieldFolder extends Omit<ContactFieldFolder, 'fields'> {
  fields: ResolvedContactField[];
}

export interface NoteMention {
  text: string;
  userId?: string;
}

export interface Note {
  id: string;
  content: string;
  mentions?: NoteMention[];
  timestamp: string;
}

export interface NotesFieldsConfig {
  view: {
    addAction?: {
      enabled: boolean;
      label: string;
    };
    composer?: {
      enabled: boolean;
      placeholder: string;
      rows?: number;
    };
    mentions?: {
      enabled: boolean;
      users: string[];
    };
    closeAction?: {
      enabled: boolean;
    };
    emptyState?: string;
  };
}

export interface NotesDataConfig {
  title: string;
  notes: Note[];
  byContactId?: Record<string, Note[]>;
}

export interface ConversationEmail {
  id: string;
  type: 'email';
  subject: string;
  sender: { name: string };
  recipient: string;
  timestamp: string;
  body: string;
  links?: Array<{ label: string; url: string }>;
  starred?: boolean;
}

export interface ConversationChat {
  id: string;
  type: 'chat';
  channel: 'whatsapp' | 'sms';
  sender: string;
  message: string;
  timestamp: string;
  replyTo?: {
    id: string;
    label: string;
  };
}

export type ConversationItem = ConversationEmail | ConversationChat;

export interface ConversationThreadConfig {
  items: ConversationItem[];
  composer?: {
    placeholder: string;
    typingIndicator?: string;
  };
}

export interface ConversationsFieldsConfig {
  view: {
    showHeaderIcon?: boolean;
    emptyState?: string;
    email?: {
      showAvatar?: boolean;
      showStarAction?: boolean;
      showMoreAction?: boolean;
      showExpandAction?: boolean;
      showReplyAction?: boolean;
    };
    chat?: {
      showChannelIcon?: boolean;
      showReplyPreview?: boolean;
    };
    composer?: {
      enabled: boolean;
      showChannelButton?: boolean;
      showAiAssist?: boolean;
      sendOnEnter?: boolean;
    };
  };
}

export interface ConversationsDataConfig {
  title: string;
  byContactId: Record<string, ConversationThreadConfig>;
  composer: {
    placeholder: string;
    typingIndicator?: string;
  };
}

export interface AppConfig {
  layout: PageLayoutConfig;
  contactData: ContactDataConfig;
  contactFields: ContactFieldsConfig;
  notesData: NotesDataConfig;
  notesFields: NotesFieldsConfig;
  conversationsData: ConversationsDataConfig;
  conversationsFields: ConversationsFieldsConfig;
}
