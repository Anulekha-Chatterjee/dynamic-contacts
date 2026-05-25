import layoutConfig from '../data/layout.json';
import contactConfig from '../data/contact.json';
import fieldsConfig from '../data/fields.json';
import notesConfig from '../data/notes.json';
import conversationsConfig from '../data/conversations.json';
import type {
  ContactConfig,
  ConversationsConfig,
  FieldsConfig,
  NotesConfig,
  PageLayoutConfig,
} from '../types/config';

export const config = {
  layout: layoutConfig as PageLayoutConfig,
  contact: contactConfig as ContactConfig,
  fields: fieldsConfig as FieldsConfig,
  notes: notesConfig as NotesConfig,
  conversations: conversationsConfig as ConversationsConfig,
};
