import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import conversationsData from '../../data/conversations/data.json';
import conversationsFields from '../../data/conversations/fields.json';
import type { ConversationsDataConfig, ConversationsFieldsConfig } from '../../types/config';
import { ConversationsPanel } from './ConversationsPanel';

const OLIVIA_ID = '9f64cfc7-2f7e-4f76-bc75-55d9dfc50e3a';
const MARCUS_ID = '21c5e6cc-1c38-48d8-8b63-02ab2a321f3f';
const PRIYA_ID = '5f6be7e1-7e29-4c24-9fb4-6f3442a1999e';
const typedConversationsData = conversationsData as ConversationsDataConfig;
const typedConversationsFields = conversationsFields as ConversationsFieldsConfig;

describe('ConversationsPanel', () => {
  it('renders a different conversation thread for each contact', () => {
    const { rerender } = render(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={OLIVIA_ID}
      />,
    );

    expect(
      screen.getByText('Set up a new time to follow up on your vehicle inquiry'),
    ).toBeInTheDocument();

    rerender(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={MARCUS_ID}
      />,
    );

    expect(screen.getByText('BMW inspection availability')).toBeInTheDocument();
    expect(
      screen.queryByText('Set up a new time to follow up on your vehicle inquiry'),
    ).not.toBeInTheDocument();
  });

  it('sends messages and keeps them scoped to the active contact', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={MARCUS_ID}
      />,
    );

    await user.type(screen.getByPlaceholderText('Message Marcus...'), 'I can send that today');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText(/I can send that today/)).toBeInTheDocument();

    rerender(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={OLIVIA_ID}
      />,
    );

    expect(screen.queryByText(/I can send that today/)).not.toBeInTheDocument();

    rerender(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={MARCUS_ID}
      />,
    );

    expect(screen.getByText(/I can send that today/)).toBeInTheDocument();
  });

  it('sets reply context when replying to an email', async () => {
    const user = userEvent.setup();

    render(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={PRIYA_ID}
        contactName="Priya Sharma"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reply' }));

    expect(screen.getByText('Replying to: Tesla SUV test drive')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Reply to Priya Sharma...')).toHaveFocus();
  });

  it('adds a reply link to sent replies', async () => {
    const user = userEvent.setup();

    render(
      <ConversationsPanel
        data={typedConversationsData}
        fields={typedConversationsFields}
        contactId={PRIYA_ID}
        contactName="Priya Sharma"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reply' }));
    await user.type(screen.getByPlaceholderText('Reply to Priya Sharma...'), 'That works for me');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(
      screen.getByRole('button', { name: 'Replying to Tesla SUV test drive' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/That works for me/)).toBeInTheDocument();
  });

  it('uses field config to hide optional conversation controls', () => {
    const customFields: ConversationsFieldsConfig = {
      view: {
        ...typedConversationsFields.view,
        showHeaderIcon: false,
        email: {
          ...typedConversationsFields.view.email,
          showReplyAction: false,
          showStarAction: false,
          showMoreAction: false,
          showExpandAction: false,
        },
        composer: {
          ...typedConversationsFields.view.composer,
          enabled: false,
        },
      },
    };

    render(
      <ConversationsPanel
        data={typedConversationsData}
        fields={customFields}
        contactId={OLIVIA_ID}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Star' })).not.toBeInTheDocument();
  });
});
