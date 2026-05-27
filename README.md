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
│   ├── contactFields.json
│   ├── contactData.json
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
| `layout.json` | Column widths (%), which panels appear, utility sidebar icons (converted to `fr` at runtime) |
| `contactFields.json` | Form-style field schema (folders, keys, labels, types, options) |
| `contactData.json` | Contact records (`values` keyed by field `key`, plus owner/followers/tags) |
| `notes.json` | Note cards with optional @mentions |
| `conversations.json` | Email threads and chat bubbles (middle column) |

`PageLayout` reads `layout.json` and maps each column's `component` key to the correct panel. `FieldFolder` and `FieldRow` render from `contactFields.json` + values from `contactData.json`—add a field in JSON and it appears without code changes.

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
- [x] UI aligned with provided screenshot
- [x] Search/filter fields by folder or label
