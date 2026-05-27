import type { ContactFieldType, ContactFieldValue } from '../types/config';

export function formatFieldValue(
  value: ContactFieldValue | undefined,
  type: ContactFieldType,
): string {
  if (value === undefined || value === null) return '';

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }

  const text = String(value).trim();
  if (!text) return '';

  if (type === 'date') {
    const parsed = Date.parse(text);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  return text;
}
