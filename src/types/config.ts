export type FieldType = 'text' | 'email' | 'phone' | 'address' | 'country';

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

export interface ContactTag {
  id: string;
  label: string;
  removable?: boolean;
}

export interface ContactConfig {
  pagination: { current: number; total: number };
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
    phoneAction: { enabled: boolean };
  };
  owner: { name: string; avatarUrl: string };
  followers: Array<{ id: string; avatarUrl: string }>;
  tags: ContactTag[];
  moreTagsCount?: number;
  actionTabs: Array<{ id: string; label: string; active?: boolean }>;
  fieldsSearch: { placeholder: string };
}

export interface FieldDefinition {
  key: string;
  label: string;
  value: string;
  type: FieldType;
  countryCode?: string;
}

export interface FieldFolder {
  id: string;
  label: string;
  defaultExpanded: boolean;
  fields: FieldDefinition[];
}

export interface FieldsConfig {
  folders: FieldFolder[];
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
}

export interface ConversationEmail {
  id: string;
  type: 'email';
  subject: string;
  sender: { name: string; avatarUrl: string };
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

export interface ConversationsConfig {
  title: string;
  items: ConversationItem[];
  composer: {
    placeholder: string;
    typingIndicator?: string;
  };
}
