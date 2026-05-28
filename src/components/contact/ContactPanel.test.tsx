import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import contactData from '../../data/contactData.json';
import contactFields from '../../data/contactFields.json';
import { ContactPanel } from './ContactPanel';

describe('ContactPanel', () => {
  it('shows two tags by default and expands the rest from contact data', async () => {
    const user = userEvent.setup();

    render(
      <ContactPanel
        contacts={contactData.contacts}
        contactFields={contactFields}
        contactIndex={0}
        onPreviousContact={vi.fn()}
        onNextContact={vi.fn()}
        onBackClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Shared Contact')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.queryByText('Warm Lead')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '+4' }));

    expect(screen.getByText('Warm Lead')).toBeInTheDocument();
    expect(screen.getByText('Financing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });
});
