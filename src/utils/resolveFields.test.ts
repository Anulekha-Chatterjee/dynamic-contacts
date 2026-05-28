import { describe, expect, it } from 'vitest';
import type { ContactFieldsConfig, ContactRecord } from '../types/config';
import {
  getContactDisplayName,
  getContactPhone,
  resolveFieldFolders,
} from './resolveFields';

const contactFields: ContactFieldsConfig = {
  folders: [
    {
      id: 'contact',
      label: 'Contact',
      fields: [
        { id: 'first', key: 'firstName', label: 'First Name', type: 'short_text' },
        { id: 'last', key: 'lastName', label: 'Last Name', type: 'short_text' },
        { id: 'date', key: 'testDriveDate', label: 'Test Drive', type: 'date' },
      ],
    },
  ],
};

const contact: ContactRecord = {
  id: 'contact-1',
  owner: 'Devon Lane',
  followers: [],
  tags: [],
  values: {
    firstName: 'Olivia',
    lastName: 'John',
    phone: '(555) 123-4567',
    testDriveDate: '2026-06-12',
  },
};

describe('resolveFields', () => {
  it('resolves raw and display values from a contact record', () => {
    const [folder] = resolveFieldFolders(contactFields, contact);
    const testDriveDate = folder.fields.find((field) => field.key === 'testDriveDate');

    expect(testDriveDate?.rawValue).toBe('2026-06-12');
    expect(testDriveDate?.displayValue).toBe('Jun 12, 2026');
  });

  it('builds the display name and phone from contact values', () => {
    expect(getContactDisplayName(contact)).toBe('Olivia John');
    expect(getContactPhone(contact)).toBe('(555) 123-4567');
  });
});
