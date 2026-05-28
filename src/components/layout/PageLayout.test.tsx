import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { config } from '../../config/loadConfig';
import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
  it('keeps contact, conversations, and notes in sync when navigating contacts', async () => {
    const user = userEvent.setup();

    render(<PageLayout config={config} />);

    expect(screen.getAllByText('Olivia John').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Set up a new time to follow up on your vehicle inquiry'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Olivia called to confirm her appointment for next Tuesday. She prefers morning slots between 9-11 AM.'),
    ).toBeInTheDocument();

    const nextButtons = screen.getAllByRole('button', { name: 'Next contact' });
    await user.click(nextButtons[nextButtons.length - 1]);

    expect(screen.getAllByText('Marcus Lee').length).toBeGreaterThan(0);
    expect(screen.getByText('BMW inspection availability')).toBeInTheDocument();
    expect(
      screen.getByText('Marcus wants Saturday afternoon availability for the BMW inspection.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Set up a new time to follow up on your vehicle inquiry'),
    ).not.toBeInTheDocument();
  });
});
