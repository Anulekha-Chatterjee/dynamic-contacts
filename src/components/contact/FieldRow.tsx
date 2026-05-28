import type { ContactFieldValue, ResolvedContactField } from '../../types/config';
import { FlagUS, IconEdit, IconPhone } from '../icons/Icons';
import './ContactPanel.css';

interface FieldRowProps {
  field: ResolvedContactField;
  editing?: boolean;
  value?: ContactFieldValue;
  onValueChange?: (field: ResolvedContactField, value: ContactFieldValue) => void;
}

function getInputType(field: ResolvedContactField): string {
  if (field.type === 'date') return 'date';
  if (field.type === 'email') return 'email';
  if (field.type === 'url') return 'url';
  if (field.type === 'number') return 'number';
  if (field.type === 'phone') return 'tel';
  return 'text';
}

function getEditableValue(field: ResolvedContactField): string {
  if (!field.rawValue) return '';
  return Array.isArray(field.rawValue) ? field.rawValue.join(', ') : String(field.rawValue);
}

function parseEditableValue(field: ResolvedContactField, value: string): ContactFieldValue {
  if (field.type === 'multi_select') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}

export function FieldRow({ field, editing = false, value, onValueChange }: FieldRowProps) {
  const { displayValue } = field;
  const isEmpty = !displayValue;
  const editableValue =
    value === undefined ? getEditableValue(field) : Array.isArray(value) ? value.join(', ') : value;
  const isNameField = field.key === 'firstName' || field.key === 'lastName';
  const isFullWidth =
    field.type === 'phone' ||
    field.type === 'email' ||
    field.type === 'url' ||
    field.type === 'long_text';
  const shouldSpanFullWidth = isFullWidth || (!editing && !isNameField);

  function handleChange(value: string) {
    onValueChange?.(field, parseEditableValue(field, value));
  }

  return (
    <div
      className={`field-row ${editing ? 'field-row--editing' : ''} ${
        shouldSpanFullWidth ? 'field-row--full' : ''
      }`}
    >
      <label className="field-row__label">
        {field.label}
        {field.required && <span className="field-row__required">*</span>}
      </label>
      <div className="field-row__value">
        {editing ? (
          <>
            {field.type === 'phone' && field.countryCode === 'US' && (
              <FlagUS className="field-row__flag" />
            )}
            {field.type === 'single_select' && field.options?.length ? (
              <select
                className="field-row__control"
                value={editableValue}
                onChange={(event) => handleChange(event.target.value)}
              >
                <option value="">Select value</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'long_text' ? (
              <textarea
                className="field-row__control field-row__control--textarea"
                value={editableValue}
                placeholder={field.placeholder ?? field.label}
                rows={2}
                onChange={(event) => handleChange(event.target.value)}
              />
            ) : (
              <input
                className="field-row__control"
                type={getInputType(field)}
                value={editableValue}
                placeholder={field.placeholder ?? field.label}
                onChange={(event) => handleChange(event.target.value)}
              />
            )}
            {field.type === 'phone' && (
              <span className="field-row__quick-actions" aria-hidden="true">
                <IconEdit />
                <span className="field-row__call-icon">
                  <IconPhone size={15} />
                </span>
              </span>
            )}
          </>
        ) : (
          <>
            {field.type === 'phone' && field.countryCode === 'US' && !isEmpty && (
              <FlagUS className="field-row__flag" />
            )}
            {field.type === 'email' && displayValue ? (
              <a href={`mailto:${displayValue}`} className="field-row__link">
                {displayValue}
              </a>
            ) : field.type === 'url' && displayValue ? (
              <a href={displayValue} target="_blank" rel="noreferrer" className="field-row__link">
                {displayValue}
              </a>
            ) : field.type === 'long_text' ? (
              <span className="field-row__multiline">{isEmpty ? '—' : displayValue}</span>
            ) : (
              <span>{isEmpty ? '—' : displayValue}</span>
            )}
          </>
        )}
        {field.helpText && <span className="field-row__help">{field.helpText}</span>}
      </div>
    </div>
  );
}
