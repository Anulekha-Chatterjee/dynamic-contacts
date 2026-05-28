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
        onContactFieldUpdate={vi.fn()}
        onContactTagsChange={vi.fn()}
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

  it('commits edited fields only after Done is clicked', async () => {
    const user = userEvent.setup();
    const onContactFieldUpdate = vi.fn();
    const { container } = render(
      <ContactPanel
        contacts={contactData.contacts}
        contactFields={contactFields}
        contactIndex={0}
        onPreviousContact={vi.fn()}
        onNextContact={vi.fn()}
        onBackClick={vi.fn()}
        onContactFieldUpdate={onContactFieldUpdate}
        onContactTagsChange={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: '+ Add' })[0]);
    const firstNameInput = container.querySelector<HTMLInputElement>('.field-row__control');

    expect(firstNameInput).not.toBeNull();

    await user.clear(firstNameInput as HTMLInputElement);
    await user.type(firstNameInput as HTMLInputElement, 'Ava');

    expect(onContactFieldUpdate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Done' }));

    expect(onContactFieldUpdate).toHaveBeenCalledWith(
      contactData.contacts[0].id,
      expect.objectContaining({ key: 'firstName' }),
      'Ava',
    );
    expect(onContactFieldUpdate).toHaveBeenCalledTimes(1);
  });

  it('removes a tag from the active contact', async () => {
    const user = userEvent.setup();
    const onContactTagsChange = vi.fn();

    render(
      <ContactPanel
        contacts={contactData.contacts}
        contactFields={contactFields}
        contactIndex={0}
        onPreviousContact={vi.fn()}
        onNextContact={vi.fn()}
        onBackClick={vi.fn()}
        onContactFieldUpdate={vi.fn()}
        onContactTagsChange={onContactTagsChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove VIP' }));

    expect(onContactTagsChange).toHaveBeenCalledWith(
      contactData.contacts[0].id,
      expect.not.arrayContaining(['VIP']),
    );
  });
});
