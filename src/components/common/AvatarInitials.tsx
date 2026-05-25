import { getInitials } from '../../utils/getInitials';
import './AvatarInitials.css';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarInitialsProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  return (
    <span
      className={`avatar-initials avatar-initials--${size} ${className}`.trim()}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
