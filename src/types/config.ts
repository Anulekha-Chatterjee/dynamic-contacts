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
  component: 'contact' | 'conversations' | 'notes';
  width: string;
  visible: boolean;
}

export interface PageLayoutConfig {
  columns: LayoutColumn[];
  utilitySidebar: {
    visible: boolean;
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

export interface NotesConfig {
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
}

export type ConversationItem = ConversationEmail | ConversationChat;

export interface ConversationThreadConfig {
  items: ConversationItem[];
  composer?: {
    placeholder: string;
    typingIndicator?: string;
  };
}

export interface ConversationsConfig {
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
  notes: NotesConfig;
  conversations: ConversationsConfig;
}
