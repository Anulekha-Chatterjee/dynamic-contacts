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

export interface ContactConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  businessName: string;
  streetAddress: string;
  city: string;
  country: string;
  owner: string;
  followers: string[];
  tags: string[];
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  countryCode?: string;
  value?: string;
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

export interface ConversationsConfig {
  title: string;
  items: ConversationItem[];
  composer: {
    placeholder: string;
    typingIndicator?: string;
  };
}
