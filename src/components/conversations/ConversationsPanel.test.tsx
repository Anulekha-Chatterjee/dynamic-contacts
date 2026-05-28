import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import conversationsConfig from '../../data/conversations.json';
import { ConversationsPanel } from './ConversationsPanel';

const OLIVIA_ID = '9f64cfc7-2f7e-4f76-bc75-55d9dfc50e3a';
const MARCUS_ID = '21c5e6cc-1c38-48d8-8b63-02ab2a321f3f';
const PRIYA_ID = '5f6be7e1-7e29-4c24-9fb4-6f3442a1999e';

describe('ConversationsPanel', () => {
  it('renders a different conversation thread for each contact', () => {
    const { rerender } = render(
      <ConversationsPanel config={conversationsConfig} contactId={OLIVIA_ID} />,
    );

    expect(
      screen.getByText('Set up a new time to follow up on your vehicle inquiry'),
    ).toBeInTheDocument();

    rerender(<ConversationsPanel config={conversationsConfig} contactId={MARCUS_ID} />);

    expect(screen.getByText('BMW inspection availability')).toBeInTheDocument();
    expect(
      screen.queryByText('Set up a new time to follow up on your vehicle inquiry'),
    ).not.toBeInTheDocument();
  });

  it('sends messages and keeps them scoped to the active contact', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ConversationsPanel config={conversationsConfig} contactId={MARCUS_ID} />,
    );

    await user.type(screen.getByPlaceholderText('Message Marcus...'), 'I can send that today');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText(/I can send that today/)).toBeInTheDocument();

    rerender(<ConversationsPanel config={conversationsConfig} contactId={OLIVIA_ID} />);

    expect(screen.queryByText(/I can send that today/)).not.toBeInTheDocument();

    rerender(<ConversationsPanel config={conversationsConfig} contactId={MARCUS_ID} />);

    expect(screen.getByText(/I can send that today/)).toBeInTheDocument();
  });

  it('sets reply context when replying to an email', async () => {
    const user = userEvent.setup();

    render(<ConversationsPanel config={conversationsConfig} contactId={PRIYA_ID} />);

    await user.click(screen.getByRole('button', { name: 'Reply' }));

    expect(screen.getByText('Replying to: Tesla SUV test drive')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Reply to Priya Sharma...')).toHaveFocus();
  });
});
