import layoutConfig from '../data/layout.json';
import contactDataConfig from '../data/contacts/data.json';
import contactFieldsConfig from '../data/contacts/fields.json';
import notesDataConfig from '../data/notes/data.json';
import notesFieldsConfig from '../data/notes/fields.json';
import conversationsDataConfig from '../data/conversations/data.json';
import conversationsFieldsConfig from '../data/conversations/fields.json';
import type {
  AppConfig,
  ContactDataConfig,
  ContactFieldsConfig,
  ConversationsDataConfig,
  ConversationsFieldsConfig,
  NotesDataConfig,
  NotesFieldsConfig,
  PageLayoutConfig,
} from '../types/config';

export const config: AppConfig = {
  layout: layoutConfig as PageLayoutConfig,
  contactData: contactDataConfig as ContactDataConfig,
  contactFields: contactFieldsConfig as ContactFieldsConfig,
  notesData: notesDataConfig as NotesDataConfig,
  notesFields: notesFieldsConfig as NotesFieldsConfig,
  conversationsData: conversationsDataConfig as ConversationsDataConfig,
  conversationsFields: conversationsFieldsConfig as ConversationsFieldsConfig,
};
