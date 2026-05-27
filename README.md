# Dynamic Contact Details Page

A config-driven CRM contact details view built for rendering Contacts. The UI layout, contact fields/folders, conversations, and notes are rendered from JSON through a local mock API service, simulating how real CRMs define custom pages.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Architecture

```
src/
├── data/           # JSON configuration (edit these to change the UI)
│   ├── layout.json
│   ├── contactFields.json
│   ├── contactData.json
│   ├── notes.json
│   └── conversations.json
├── types/          # TypeScript contracts for all config shapes
├── config/         # Loads and exports typed JSON seed data
├── services/       # Mock API + response caching
└── components/
    ├── layout/     # Page grid + utility sidebar
    ├── contact/    # Profile, metadata, dynamic field folders
    ├── conversations/
    └── notes/
```

### Config-driven rendering

| JSON file | Purpose |
|-----------|---------|
| `layout.json` | Column widths (%), which panels appear, utility sidebar icons (converted to `fr` at runtime) |
| `contactFields.json` | Form-style field schema (folders, keys, labels, types, options) |
| `contactData.json` | Contact records (`values` keyed by field `key`, plus owner/followers/tags) |
| `notes.json` | Note cards with optional @mentions |
| `conversations.json` | Email threads and chat bubbles (middle column) |

`fetchAppConfig` reads the local JSON seed data through a mock API boundary, simulates async latency, and caches successful responses in `localStorage`. `PageLayout` receives the loaded config and maps each column's `component` key to the correct panel. `FieldFolder` and `FieldRow` render from `contactFields.json` + values from `contactData.json`—add a field in JSON and it appears without code changes.

## Features

- JSON-driven CRM layout with Contact, Conversations, Notes, and utility sidebar panels
- Async mock API loading with localStorage response caching
- Inline contact field editing from the folder `+ Add` action
- Configurable folder actions through `contactFields.json`
- Search/filter across contact fields and folders
- Expandable contact tags: show two by default, then reveal all tags from actual contact data
- Contact pagination across mock contacts
- Conversation composer for adding new replies/messages
- Email `Reply` action that focuses the composer and shows reply context
- Notes composer for adding new notes
- Inline `@mention` parsing and highlighting in notes
- Mention suggestion dropdown with hardcoded mock users when typing `@`
- Responsive tablet/mobile layout with stacked panels
- Mobile bottom utility sidebar
- Mobile panel collapse/expand controls using matching chevron styling

### Mock API and caching

The mock API uses local JSON files as the backend seed data and caches successful responses in localStorage for fallback behavior.

- Simulates API latency before returning data
- Caches the combined app config under `dynamic-contact-details:app-config`
- Keeps API-style loading/error handling in `App.tsx`

### Editing behavior

Contact field edits, added notes, conversation replies, and expanded tags are stored in component state. They update immediately in the UI, but they intentionally do not write back to the JSON files. This keeps the app lightweight while still demonstrating interactive CRM behavior on top of mocked API data.

### Responsive behavior

Desktop uses the configured multi-column layout from `layout.json`. At tablet/mobile widths, the panels stack vertically in this order:

1. Contact Details
2. Conversations
3. Notes

The utility sidebar becomes a fixed bottom bar on smaller screens. Contact details remain expanded by default on mobile, while Conversations and Notes can collapse/expand through their header chevrons.


### Customization example

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

Then add `"leadSource": "Website"` to each contact's `values` in `contactData.json`.

Hide the notes column in `src/data/layout.json`:

```json
{ "id": "notes", "component": "notes", "width": "28%", "visible": false }
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Tech stack

- React 19 + TypeScript
- Vite
- CSS (no UI library—matches mock fidelity with custom styles)

## Assignment checklist

- [x] Modular component architecture
- [x] Page layout from JSON
- [x] Contact fields & folders from JSON
- [x] Notes from JSON
- [x] Mock API service with cached responses
- [x] Search/filter fields by folder or label
- [x] Inline contact editing
- [x] Add notes with inline mentions
- [x] Add conversation replies
- [x] Expand/collapse actual contact tags
- [x] Responsive mobile/tablet stacked layout
- [x] UI aligned with provided screenshot
