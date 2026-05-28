import { describe, expect, it } from 'vitest';
import { formatFieldValue } from './formatFieldValue';

describe('formatFieldValue', () => {
  it('returns an empty string for missing values', () => {
    expect(formatFieldValue(undefined, 'short_text')).toBe('');
  });

  it('joins multi-value fields with commas', () => {
    expect(formatFieldValue(['Toyota', '', 'Honda'], 'multi_select')).toBe('Toyota, Honda');
  });

  it('formats valid date values for display', () => {
    expect(formatFieldValue('2026-06-12', 'date')).toBe('Jun 12, 2026');
  });

  it('leaves invalid dates as their original text', () => {
    expect(formatFieldValue('not-a-date', 'date')).toBe('not-a-date');
  });
});
