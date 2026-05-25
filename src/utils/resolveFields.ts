import type { ContactConfig, FieldFolder, FieldsConfig } from '../types/config';

const CONTACT_FIELD_KEYS = new Set([
  'firstName',
  'lastName',
  'phone',
  'email',
  'address',
  'businessName',
  'streetAddress',
  'city',
  'country',
]);

function getContactFieldValue(contact: ContactConfig, key: string): string {
  if (!CONTACT_FIELD_KEYS.has(key)) return '';
  const value = contact[key as keyof ContactConfig];
  return typeof value === 'string' ? value : '';
}

export function resolveFieldFolders(
  fields: FieldsConfig,
  contact: ContactConfig,
): FieldFolder[] {
  return fields.folders.map((folder) => ({
    ...folder,
    fields: folder.fields.map((field) => ({
      ...field,
      value: getContactFieldValue(contact, field.key),
    })),
  }));
}
