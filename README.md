# Dynamic Contact Details Page

A config-driven CRM contact details interface built with React, TypeScript, and Vite. The app renders the page layout, contact fields, grouped folders, conversations, notes, tags, and sidebar navigation from JSON seed data through a local mock API layer.

The goal is to demonstrate a dynamic CRM-style UI with clean component boundaries, mocked API loading, cached responses, reusable field rendering, per-contact state, and responsive behavior.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` - start the local Vite dev server
- `npm run test` - run unit tests with Vitest
- `npm run test:watch` - run tests in watch mode
- `npm run lint` - run ESLint
- `npm run build` - create the production build in `dist/`
- `npm run preview` - preview the production build locally

## Project Structure

```txt
src/
├── config/         # Loads typed JSON seed config
├── data/           # JSON data that drives layout, contacts, notes, conversations
├── services/       # Mock API boundary and localStorage caching
├── types/          # TypeScript contracts for config/data shapes
├── utils/          # Field resolving and formatting helpers
├── test/           # Test setup
└── components/
    ├── common/     # Shared UI primitives
    ├── contact/    # Contact profile, tags, folders, field rows
    ├── conversations/
    ├── icons/
    ├── layout/     # Page grid, utility sidebar, panel controls
    └── notes/
```

## Data Files

| File | Purpose |
| --- | --- |
| `src/data/layout.json` | Defines the three-column layout, column visibility, utility sidebar icons, and the default active sidebar item |
| `src/data/contactFields.json` | Defines contact field folders, labels, field types, options, and folder actions |
| `src/data/contactData.json` | Contains contact records, UUID-style contact IDs, owners, followers, tags, and field values |
| `src/data/conversations.json` | Stores per-contact conversation threads under `byContactId` |
| `src/data/notes.json` | Stores default notes and per-contact notes under `byContactId` |

Contact IDs are UUID-style strings instead of name-based slugs, so multiple contacts can share the same name without breaking notes or conversations.

## Key Features

- JSON-driven CRM layout with Contact Details, Conversations, Notes, and utility sidebar panels
- Mock API service that simulates async loading and caches successful responses in `localStorage`
- Dynamic field folders and rows generated from `contactFields.json`
- Inline contact editing from each folder `+ Add` action
- Deferred edit commit: field changes are drafted locally and only update shared contact state after `Done`
- First Name and Last Name render side by side in view and edit modes
- Contact tags show two by default, expand to reveal more, and can be deleted
- Contact pagination with previous/next controls
- Runtime layout toggle between balanced and conversation-focused column configs
- Per-contact conversations and per-contact notes
- Conversation composer for adding messages
- Email reply flow with focused composer, reply context, and a WhatsApp-style reply preview link on sent replies
- Conversation feed auto-scrolls to the newest message
- Contact name edits sync into the conversation panel after `Done`
- Notes composer for adding notes
- Inline `@mention` parsing in a single note textbox
- Mention dropdown with mock users while typing `@`
- Responsive tablet/mobile layout that stacks panels vertically
- Mobile utility sidebar fixed to the bottom
- Mobile panel collapse/expand controls using matching chevron styling
- Utility sidebar with Documents selected by default

## Mock API and Caching

`fetchAppConfig` in `src/services/mockApi.ts` acts as the API boundary.

It:

- waits briefly to simulate network latency
- returns the typed app config loaded from local JSON
- caches successful responses in `localStorage`
- keeps loading and error handling in `App.tsx` API-shaped, even though this project uses local mock data

The cache key is:

```txt
dynamic-contact-details:app-config
```

## State Behavior

The JSON files are seed data. Runtime interactions are stored in React state and do not write back to JSON.

- Contact field edits are stored at the page level after `Done`
- Tag deletions update the active contact in page state
- New notes are stored per contact in the Notes panel state
- New conversation messages are stored per contact in the Conversations panel state
- Reply context is cleared after a message is sent

This keeps the app lightweight while still showing realistic CRM interactions on top of mocked API data.

## Responsive Behavior

Desktop uses the configured multi-column layout from `layout.json`.

The layout mode toggle can switch the desktop layout at runtime:

- `Balanced` uses the default JSON column widths
- `Conversation` applies an alternate JSON-shaped layout that hides Contact Details and Notes, then expands Conversations to the full workspace

On tablet/mobile widths, panels stack vertically:

1. Contact Details
2. Conversations
3. Notes

The utility sidebar moves to a fixed bottom bar. Contact Details stays expanded by default on mobile, while Conversations and Notes can collapse or expand through their header chevrons.

## Utility Sidebar

The right-side utility sidebar represents secondary CRM navigation:

- Activity
- Network
- Tasks
- Documents
- Calendar

`Documents` is selected by default through `activeIconId` in `layout.json`. The icons are visual navigation scaffolding for this assignment and do not open separate routes yet.

## Contact Tabs

The Contact panel includes CRM-style tabs:

- `All Fields` - the active implemented view showing all dynamic field folders
- `DND` - intended for do-not-disturb/contact preference settings
- `Actions` - intended for quick CRM actions such as scheduling, assigning, or follow-up tasks

Only `All Fields` is currently functionally implemented. The other tabs are present to match the CRM-style UI pattern and can be wired later if needed.

## Customization Examples

Add a field in `src/data/contactFields.json`:

```json
{
  "id": "fld-lead-source",
  "key": "leadSource",
  "label": "Lead Source",
  "type": "single_select",
  "options": ["Website", "Referral", "Walk-in"]
}
```

Then add the matching value to a contact in `src/data/contactData.json`:

```json
{
  "values": {
    "leadSource": "Website"
  }
}
```

Hide a panel in `src/data/layout.json`:

```json
{
  "id": "notes",
  "component": "notes",
  "width": "28%",
  "visible": false
}
```

Change the active utility sidebar icon:

```json
{
  "utilitySidebar": {
    "activeIconId": "docs"
  }
}
```

## Testing

The project includes unit tests for the major interactive behavior:

- field formatting and field-folder resolving
- contact tag expansion and deletion
- deferred field editing
- per-contact conversations
- sending messages and reply preview links
- per-contact notes and mentions
- page-level contact navigation syncing contact details, notes, and conversations
- runtime layout switching between balanced and full conversation-focus configs

Run:

```bash
npm run test
```

## Deployment

This is a Vite app, so production deployment uses:

```txt
Build command: npm run build
Output directory: dist
```

For Vercel or Netlify:

1. Push the repo to GitHub.
2. Import the repo.
3. Use the Vite defaults.
4. Deploy from the connected branch.

Before deploying:

```bash
npm run test
npm run lint
npm run build
```

## Known Issues / Intentional Scope

- Runtime edits are stored in React state only. Contact edits, deleted tags, added notes, and sent messages do not write back to the JSON seed files.
- `DND` and `Actions` are CRM-style tabs included for layout fidelity, but only `All Fields` is currently wired as a functional view.
- Utility sidebar icons are visual navigation scaffolding. `Documents` is highlighted by default, but the sidebar does not open separate routes or panels.
- The mock API uses local JSON files and simulated latency instead of a real backend service.

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest
- Testing Library
- CSS modules by component stylesheet convention

## Assignment Checklist

- [x] Code organization and modular component structure
- [x] Mock API boundary
- [x] Cached mock API responses
- [x] Dynamic rendering from JSON
- [x] Nested/grouped field folders
- [x] Per-contact conversations and notes
- [x] Reusable contact field rows and folders
- [x] Inline contact editing
- [x] Deferred save behavior for contact edits
- [x] Tag expansion and deletion
- [x] Add notes with inline mentions
- [x] Add conversation messages and replies
- [x] Reply preview link for sent replies
- [x] Responsive mobile/tablet stacked layout
- [x] Runtime layout toggle simulating a JSON layout switch
- [x] Mobile bottom utility sidebar
- [x] Hover/active states and consistent UI styling
- [x] Unit tests for core behavior
