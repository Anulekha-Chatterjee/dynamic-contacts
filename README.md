# Dynamic Contact Details Page

A config-driven CRM contact details view built for a take-home assignment. The UI layout, contact fields/folders, and notes are rendered from static JSON files—simulating how real CRMs define custom pages.

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
│   ├── contact.json
│   ├── fields.json
│   ├── notes.json
│   └── conversations.json
├── types/          # TypeScript contracts for all config shapes
├── config/         # Loads and exports typed config
└── components/
    ├── layout/     # Page grid + utility sidebar
    ├── contact/    # Profile, metadata, dynamic field folders
    ├── conversations/
    └── notes/
```

### Config-driven rendering

| JSON file | Purpose |
|-----------|---------|
| `layout.json` | Column widths, which panels appear, utility sidebar icons |
| `contact.json` | Profile, owner, followers, tags, action tabs, search placeholder |
| `fields.json` | Collapsible folders and field definitions (type-aware: phone, email, etc.) |
| `notes.json` | Note cards with optional @mentions |
| `conversations.json` | Email threads and chat bubbles (middle column) |

`PageLayout` reads `layout.json` and maps each column's `component` key to the correct panel. `FieldFolder` and `FieldRow` render entirely from `fields.json`—add a folder or field in JSON and it appears without code changes.

### Customization example

Add a new folder in `src/data/fields.json`:

```json
{
  "id": "custom",
  "label": "Custom Fields",
  "defaultExpanded": true,
  "fields": [
    { "key": "leadSource", "label": "Lead Source", "value": "Website", "type": "text" }
  ]
}
```

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
- [x] UI aligned with provided screenshot
- [x] Search/filter fields by folder or label
