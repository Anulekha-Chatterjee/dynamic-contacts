import layoutConfig from '../data/layout.json';
import contactDataConfig from '../data/contactData.json';
import contactFieldsConfig from '../data/contactFields.json';
import notesConfig from '../data/notes.json';
import conversationsConfig from '../data/conversations.json';
import type {
  AppConfig,
  ContactDataConfig,
  ContactFieldsConfig,
  ConversationsConfig,
  NotesConfig,
  PageLayoutConfig,
} from '../types/config';

export const config: AppConfig = {
  layout: layoutConfig as PageLayoutConfig,
  contactData: contactDataConfig as ContactDataConfig,
  contactFields: contactFieldsConfig as ContactFieldsConfig,
  notes: notesConfig as NotesConfig,
  conversations: conversationsConfig as ConversationsConfig,
};
