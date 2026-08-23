---
name: job-tracker-app
description: Scaffold and build a local-first Job Application Tracker — a single-page React + Vite app with a Kanban board (Wishlist, Applied, Follow-up, Interview, Offer, Rejected), drag-and-drop cards, tags, interview-round tracking, follow-up reminders, an archive, and an analytics view — all persisted client-side in IndexedDB via the `idb` library. Use this skill whenever the user asks to build a job tracker, application tracker, job search Kanban board, or any local-only job-hunt dashboard — even if they don't mention React, Vite, or IndexedDB by name. Also use it if the user wants to extend, restyle, or debug an existing project that matches this spec (job cards, application status columns, resume tags, days-since-applied, interview rounds, follow-up dates).
---

# Job Tracker App

Build a local-first, no-backend Job Application Tracker: a single-page React app (Vite) with a drag-and-drop Kanban board, where every job application is a card that moves through hiring stages. All state lives in the browser via IndexedDB — nothing is sent to a server.

Treat this file as the full product spec. Don't ask the user to re-specify data fields, columns, or stack choices already defined here — only ask about things genuinely left open (see "Open questions" at the end).

## Tech stack (fixed — do not substitute)

- **React 18+**, functional components and hooks only (no class components)
- **Vite** for scaffolding and dev/build tooling
- **Tailwind CSS** for styling
- **`idb`** npm package as the IndexedDB wrapper (not raw `indexedDB.open`, not `localforage`, not `Dexie` unless the user explicitly asks to swap it)
- **`@dnd-kit/core`** for drag-and-drop (preferred over `react-beautiful-dnd`, which is unmaintained and breaks on React 18 StrictMode) — only switch if the user explicitly asks for `react-beautiful-dnd`
- No backend, no auth, no external API calls. Everything must work fully offline after first load.

## Scaffolding steps

1. `npm create vite@latest <project-name> -- --template react`
2. Install deps: `npm install idb @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
3. Install and configure Tailwind for the Vite project (`tailwindcss`, `postcss`, `autoprefixer`; `tailwind.config.js` content globs pointing at `index.html` and `src/**/*.{js,jsx}`).
4. Confirm the project runs (`npm run dev`) before layering on features — get an empty board rendering first, then add IndexedDB, then drag-and-drop, then the rest.

## Data model

Each job card is one IndexedDB record with this shape:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (uuid) | auto | primary key |
| `company` | string | yes | |
| `role` | string | yes | job title |
| `linkedinUrl` | string (URL) | no | link to the job posting; rendered as a clickable link/icon; validate it's a well-formed URL if present |
| `resume` | string | no | free text + dropdown of previously-used values (see below) |
| `coverLetter` | string | no | same pattern as `resume` — free text + dropdown of previously-used values |
| `dateApplied` | ISO date string | yes | auto-set to today on creation, user-editable afterward |
| `salaryRange` | string | no | free text, e.g. "₹25-30 LPA" or "$150-180K" — don't try to parse/validate this as a number |
| `notes` | string | no | free textarea, for anything not covered by a dedicated field |
| `status` | enum | yes | one of the six column keys below; defaults to `wishlist` on creation |
| `archived` | boolean | yes | defaults `false`; see Archive below |
| `followUpDate` | ISO date string | no | next date the user plans to follow up |
| `tags` | string[] | no | freeform labels, e.g. "Remote", "Referral", "Dream Company" |
| `contact` | object | no | `{ name, email, linkedinUrl }` — the recruiter/referrer, distinct from the job posting URL above |
| `jobDescription` | string | no | raw pasted JD text, kept as a snapshot since postings often get taken down |
| `interviewRounds` | array | no | `[{ id, stage, date, notes }]` — see Interview round tracker below |

**Resume / cover letter dropdowns**: derive the list of selectable values from the distinct `resume` / `coverLetter` values already stored across all cards (plus whatever the user is currently typing, so they can add a new one). Don't hardcode a fixed list for either.

## Kanban columns (in this order, left to right)

1. `wishlist` — Wishlist: saved jobs not yet applied to
2. `applied` — Applied: application submitted
3. `followup` — Follow-up: followed up with recruiter/referral
4. `interview` — Interview: in interview rounds
5. `offer` — Offer: offer received
6. `rejected` — Rejected: got a rejection

Each column header shows its title and a live count of cards in it. Each column scrolls independently (fixed-height board, internal `overflow-y-auto` per column) so the page itself doesn't scroll horizontally on laptop/tablet widths.

`archived` cards are hidden from all six columns regardless of `status` — see Archive below for where they live instead.

## Core features (build all of these)

- **Drag-and-drop** cards between columns using `@dnd-kit/core` (`DndContext` + `useDraggable`/`useDroppable`, or `@dnd-kit/sortable` for within-column ordering). On drop, update the card's `status` and persist to IndexedDB immediately.
- **Add job**: a modal or slide-over form with fields for all of the data model above. Defaults `status` to whichever column the "+" was clicked from (or `wishlist` if global), and `dateApplied` to today.
- **Edit job**: inline edit or reopen the same modal pre-filled. Any change persists immediately.
- **Delete job**: require a confirmation step (e.g. a confirm dialog or a two-click "Delete? / Confirm" affordance) before removing the IndexedDB record. This is a true hard delete — separate from Archive below, which is the softer, reversible option and should generally be offered first/more prominently in the UI.
- **Card display**: company name, role, resume tag (small pill/badge), tag chips (if any), days since applied (compute from `dateApplied` to today, e.g. "12d"), a clickable LinkedIn icon/link (only rendered if `linkedinUrl` is set), and an overdue indicator (see Follow-up reminders below).
- **Search/filter bar**: filters visible cards live by substring match on `company` or `role`, across all columns simultaneously (don't require the user to pick a column first). Extend it with an optional tag filter (select one or more tags to narrow the board) since tags are cheap to filter on once they exist.
- **Persistence**: every CRUD operation (add/edit/delete/move) writes to IndexedDB before or immediately after updating React state, so a page refresh always reflects the latest board. Don't batch writes or debounce them — job tracking data is low-volume, so instant persistence matters more than write-batching performance.

## Additional features (build these too, alongside core)

- **Follow-up reminders**: use the `followUpDate` field. On each card, if `followUpDate` has passed (or if the card has sat in `applied` for 7+ days with no `followUpDate` set), show a small red dot / badge on the card. Surface a simple "Needs follow-up" count somewhere visible (e.g. a small banner or badge near the search bar) so the user doesn't have to scan every column.
- **Interview round tracker**: for cards with `interviewRounds`, let the user add/edit/remove rounds (e.g. "Phone Screen", "Technical", "Onsite" — free text stage names, not a fixed enum, since interview processes vary by company) each with its own date and short notes. Show this as an expandable section within the card's edit modal, and optionally a compact "2/3 rounds done" indicator on the card face itself.
- **Contact/recruiter field**: a small sub-form for `contact` (name, email, LinkedIn profile URL) inside the add/edit modal, kept visually distinct from the general `notes` textarea. All three sub-fields are optional independently of each other.
- **Tags/labels**: freeform tag input (type + press Enter/comma to add a chip) on the add/edit form. Render existing tags across the board as small colored chips — assign a color per tag deterministically (e.g. hash the tag string to pick from a fixed palette) so the same tag always renders the same color without the user having to configure it.
- **Archive (soft delete)**: an "Archive" action on each card sets `archived: true` instead of deleting the record. Archived cards disappear from the six Kanban columns and live in a separate, clearly-labeled "Archived" view/tab (a simple filtered list is fine — it doesn't need its own Kanban layout). From that view, the user can restore (`archived: false`, back to its last `status`) or permanently delete. Make Archive the default/primary destructive action in the UI, with hard Delete as a secondary, more-confirmed option.

## Nice-to-have features (include if the user hasn't said to skip them; keep them simple)

- **Light/dark mode toggle**: Tailwind `dark:` classes, toggle stored in `localStorage` (this one piece of UI preference is fine in `localStorage` — it's not job data, so it doesn't need to go in IndexedDB).
- **Export JSON**: dump all IndexedDB records (including archived ones) as a downloadable `.json` file (use a `Blob` + temporary `<a download>` link).
- **Import JSON**: file input that reads a previously-exported JSON file and bulk-writes records back into IndexedDB. Validate shape loosely before importing (required fields present) and warn the user if the file looks malformed rather than silently corrupting the store.
- **Sort within column**: newest/oldest toggle per column (or global), sorting by `dateApplied`.
- **Analytics/stats view**: a separate tab/page computing simple stats client-side from existing IndexedDB data — no new storage needed. Include at minimum: applications this week/this month (count by `dateApplied`), response rate (share of `applied` cards that ever reached `interview` or `offer`), rejection rate (share reaching `rejected`), and average days from `dateApplied` to the date a card entered `interview`/`offer`/`rejected` (approximate this using the card's current `status` and last-updated timestamp if you're not tracking full status-change history — see the Timeline idea below as a future upgrade rather than building it now).
- **Calendar view**: a small monthly calendar plotting `followUpDate`s and any `interviewRounds[].date`s as dots/events on their respective days; clicking a day/event opens that card.
- **Duplicate detection**: before saving a new card, check existing (non-archived) records for a case-insensitive match on `company` + `role`. If found, warn the user ("You already have an application for this role at this company — add anyway?") rather than silently blocking — some users genuinely reapply.
- **Job description snapshot**: a textarea in the add/edit form for pasting the raw JD (`jobDescription` field above). Display it collapsed/truncated on the card's expanded view, not on the card face, to avoid cluttering the board.

If a nice-to-have would require real complexity (e.g. the user asks for cloud sync, multi-device, or auth), flag that it's out of scope for this local-first spec rather than quietly building it.

## UI/UX guidance

- Clean, minimal, professional — closer to Linear/Trello than a dense enterprise dashboard. Generous whitespace, restrained color palette, no heavy borders/shadows everywhere.
- Give each card a subtle left-border (or top-border) accent color keyed to its column/status (e.g. gray for wishlist, blue for applied, amber for follow-up, purple for interview, green for offer, red for rejected) — keep it as a thin accent, not a full-card color wash.
- Tag chips should be visually secondary to the status accent color — small, rounded, low-saturation — so the board doesn't turn into a wall of competing colors once cards have both a status accent and several tags.
- Responsive: usable at both laptop and tablet widths. On narrow viewports, prefer horizontally-scrollable columns over stacking all six vertically (stacking six full-height columns on a tablet portrait view is generally worse UX than horizontal scroll).
- Form validation: `company` and `role` are required — block save and show inline errors if either is empty; everything else is optional.
- Keep the add/edit modal manageable as fields grow: group related fields visually (core info, then contact, then tags, then interview rounds, then JD snapshot/notes) rather than one long flat form — consider collapsible sections for the less-frequently-used blocks (interview rounds, JD snapshot).

## File structure (suggested)

```
src/
  main.jsx
  App.jsx
  db/
    db.js          # idb open/init, schema, get/put/delete helpers
  components/
    Board.jsx
    Column.jsx
    JobCard.jsx
    JobFormModal.jsx
    SearchBar.jsx
    ThemeToggle.jsx
    ImportExport.jsx
    ArchiveView.jsx
    AnalyticsView.jsx
    CalendarView.jsx
    TagChip.jsx
  hooks/
    useJobs.js      # loads/subscribes to IndexedDB state
```

Keep the `idb` access layer (`db/db.js`) as the single place that talks to IndexedDB — components should call helper functions (`getAllJobs`, `addJob`, `updateJob`, `deleteJob`, `archiveJob`, `restoreJob`) rather than opening the database themselves. This keeps persistence logic testable and prevents duplicate DB connections.

## Delivery

Scaffold the full project (all files above, fully wired — not stubs), then run `npm run dev` (or `npm run build`) to confirm it starts/builds cleanly before handing it back. If something in the drag-and-drop or IndexedDB wiring doesn't work, fix it before presenting the result — don't leave known-broken features with a note to "fix later."

If the user asks for a smaller/faster build (e.g. "just the basics first"), it's fine to ship Core features first and add the Additional/Nice-to-have features in a follow-up pass — just say that's what you're doing rather than silently dropping items from this spec.

## Open questions (ask only if genuinely ambiguous)

- Where the project should live / what to name it, if not specified.
- Whether the user wants seed/demo data pre-populated on first load, or an empty board.
- Whether "days since applied" should still display (and how) for columns like Wishlist where nothing's been applied to yet — default assumption: show it everywhere `dateApplied` exists, since it's auto-set on creation regardless of column.
- Whether Analytics/Calendar views should be full pages/tabs or a slide-over/panel over the board — default assumption: separate tab, since the board itself is already dense.