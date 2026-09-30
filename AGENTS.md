# Washington Baths website

This is the public raw-HTML site for washingtonbaths.com. Preserve its existing
appearance and architecture. Do not introduce a framework, CMS, build requirement,
or new dependency stack. Everything committed here is public; never add secrets.

## Event requests

Read `docs/event-workflow.md` before creating or publishing an event. Use
`templates/event.html` and the approved `events/unless-screening.html` design.
The owner supplies the Square Payment Link; do not create Square checkout orders,
request Square credentials, or add inventory counters or payment JavaScript.
Do not modify `squarePay/`, the existing events application, or unrelated pages.

Before editing, inspect the working tree and fetch origin. Start each new event
on a fresh `event/<slug>` branch from the latest `origin/master`. Never reuse a
merged event branch. Preserve unrelated local changes; do not reset or overwrite
them. If fetching fails, report that freshness is unverified before proceeding.

Collect name, date including year, time in America/New_York, Square link, and
poster. Description and slug are optional. Ask only for missing required facts;
do not infer event facts from conflicting poster text without confirmation.

Create the page and web-ready poster, add the homepage link in date order, run
the event checker, and inspect a browser preview at desktop and mobile widths.
Show a preview for approval. Do not merge or publish without explicit approval.
Before publishing, refresh master and preserve all intervening website edits.
Handle routine conflicts yourself when intent is clear; ask about ambiguous
content rather than asking the owner to edit conflict markers.

Publishing requires verified write access. A successful read or plugin connection
does not prove write access. Prefer configured local Git; use GitHub Desktop as
the fallback. Never extract Desktop credentials or put tokens in commands/files.
After approved publication, verify the live page, poster, and homepage link. Do
not claim a completed Square payment or inventory test unless actually performed.
