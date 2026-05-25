import type { FieldDefinition } from '../../types/config';
import { FlagUS } from '../icons/Icons';
import './ContactPanel.css';

interface FieldRowProps {
  field: FieldDefinition;
}

export function FieldRow({ field }: FieldRowProps) {
  return (
    <div className="field-row">
      <label className="field-row__label">{field.label}</label>
      <div className="field-row__value">
        {field.type === 'phone' && field.countryCode === 'US' && (
          <FlagUS className="field-row__flag" />
        )}
        {field.type === 'email' && field.value ? (
          <a href={`mailto:${field.value}`} className="field-row__link">
            {field.value}
          </a>
        ) : (
          <span>{field.value ?? '—'}</span>
        )}
      </div>
    </div>
  );
}
