import type { ResolvedContactField } from '../../types/config';
import { FlagUS } from '../icons/Icons';
import './ContactPanel.css';

interface FieldRowProps {
  field: ResolvedContactField;
}

export function FieldRow({ field }: FieldRowProps) {
  const { displayValue } = field;
  const isEmpty = !displayValue;

  return (
    <div className="field-row">
      <label className="field-row__label">
        {field.label}
        {field.required && <span className="field-row__required">*</span>}
      </label>
      <div className="field-row__value">
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
        {field.helpText && <span className="field-row__help">{field.helpText}</span>}
      </div>
    </div>
  );
}
