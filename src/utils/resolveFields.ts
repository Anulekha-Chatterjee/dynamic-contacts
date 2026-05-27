import type {
  ContactFieldsConfig,
  ContactRecord,
  ResolvedContactField,
  ResolvedContactFieldFolder,
} from '../types/config';
import { formatFieldValue } from './formatFieldValue';

function getRawFieldValue(
  contact: ContactRecord,
  key: string,
): ContactRecord['values'][string] | undefined {
  return contact.values[key];
}

export function resolveFieldFolders(
  contactFields: ContactFieldsConfig,
  contact: ContactRecord,
): ResolvedContactFieldFolder[] {
  return contactFields.folders.map((folder) => ({
    ...folder,
    fields: folder.fields.map(
      (field): ResolvedContactField => ({
        ...field,
        rawValue: getRawFieldValue(contact, field.key),
        displayValue: formatFieldValue(getRawFieldValue(contact, field.key), field.type),
      }),
    ),
  }));
}

export function getContactDisplayName(contact: ContactRecord): string {
  const first = contact.values.firstName;
  const last = contact.values.lastName;
  const firstName = typeof first === 'string' ? first : '';
  const lastName = typeof last === 'string' ? last : '';
  return `${firstName} ${lastName}`.trim() || 'Unknown Contact';
}

export function getContactPhone(contact: ContactRecord): string {
  const phone = contact.values.phone;
  return typeof phone === 'string' ? phone : '';
}
