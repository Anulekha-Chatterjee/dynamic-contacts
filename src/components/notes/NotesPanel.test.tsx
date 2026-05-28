import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import notesConfig from '../../data/notes.json';
import { NotesPanel } from './NotesPanel';

const OLIVIA_ID = '9f64cfc7-2f7e-4f76-bc75-55d9dfc50e3a';
const MARCUS_ID = '21c5e6cc-1c38-48d8-8b63-02ab2a321f3f';

describe('NotesPanel', () => {
  it('renders notes for the active contact', () => {
    render(
      <NotesPanel
        config={notesConfig}
        contactId={MARCUS_ID}
        onCloseClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Marcus wants Saturday afternoon availability for the BMW inspection.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Olivia called to confirm her appointment for next Tuesday.'),
    ).not.toBeInTheDocument();
  });

  it('adds a note with a mention selected from the dropdown', async () => {
    const user = userEvent.setup();

    render(
      <NotesPanel
        config={notesConfig}
        contactId={OLIVIA_ID}
        onCloseClick={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '+ Add' }));
    await user.type(screen.getByPlaceholderText('Add a note... use @name to mention someone'), 'Call @a');
    await user.click(screen.getByRole('button', { name: '@Aaron Site' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const addedMention = screen.getAllByText('@Aaron Site')[0];
    const addedNote = addedMention.closest('p');

    expect(addedNote).toBeInTheDocument();
    expect(addedNote).toHaveTextContent('Call @Aaron Site');
    expect(within(addedNote as HTMLElement).getByText('@Aaron Site')).toHaveClass('note-mention');
  });
});
