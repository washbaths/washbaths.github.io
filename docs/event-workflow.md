# Event publishing workflow

## Owner experience

Send the details in `docs/event-request.md` and attach the poster. The agent makes
the event page and homepage listing, checks them, and shows a preview. The owner
approves publication. The owner creates and maintains the Square Payment Link.
This workflow does not automate Square, change its inventory, or verify payment.

## One-time local project setup

Create a **local project** named **Washington Baths Website** in Codex, attaching
this repository folder as its primary folder. Start future event tasks inside
that project so `AGENTS.md` is discovered. Do not use a ChatGPT-only project with
uploaded copies of the website: work on the actual Git repository.

## Before each event

1. Inspect status; preserve all existing edits. Fetch origin successfully.
2. Create a fresh `event/<slug>` branch from the latest `origin/master`.
3. Confirm the required event details, including year and Portland time. Validate
   the weekday against the date. Use the supplied payment link verbatim; reject
   placeholders and ask about unexpected payment hosts.
4. Check publishing access early. Read access alone is not sufficient. If upload
   access is missing, explain the fallback once, without repeated reconnects.

## Create and check

- Copy `templates/event.html` to `events/<slug>.html`. Replace every placeholder,
  HTML-escape all supplied text/attribute values, and retain the approved layout.
  If requested, place a short description below the date. Do not invent copy.
- Store the attached image in the repository with a descriptive, unique filename.
  Prefer JPEG, PNG, or WebP. Convert TIFF/HEIC when necessary without redesigning
  or cropping the artwork; keep its aspect ratio. Aim for a practical web size
  (roughly 1600px wide is usually enough). Do not overwrite other event images.
- Add a link under `Upcoming Dates, Closures & Events` in `index.html`, in date
  order, using the current listing style and the event's root-relative URL.
  Preserve all other listings, prices, opening hours, and closure notices.
- Run `node scripts/check-event.cjs events/<slug>.html '<Square Payment Link>'`.
  This checks basic paths and content, not full HTML validity, visual appearance,
  remote Square availability, or payment behavior.
- Preview using a local HTTP server, not only a file URL, so `/` links work.
  Inspect desktop and mobile widths; check the full poster and purchase link.
- Review the diff. A normal event changes only its page, image, and homepage.
  Show the preview and await approval. Do not submit a payment during testing.

## Publish after approval

Fetch origin again and integrate current master into the event branch before
publishing. Resolve straightforward homepage insertions while preserving current
master content; do not accept one entire side blindly. Rerun checks and review
the full diff against current master. Ask the owner if the content is ambiguous.

Commit only the intended files. Push the event branch and open a pull request
targeting master, then merge only with the owner's publication approval and
passing checks/no unresolved conflicts. Never force-push master. Verify the
GitHub Pages deployment and directly check the live homepage, event, image, and
purchase URL. Report the final public URL, not merely a successful commit.

`master` was verified as the deployment branch on 2026-09-30. Recheck deployment
configuration if it changes; do not assume an arbitrary branch publishes.

## Publishing access and local tools

As tested on 2026-09-30:

- GitHub Desktop successfully pushed this repository.
- The GitHub plugin read the repository but its blob upload returned HTTP 403.
- Local command-line Git could fetch, but push lacked authentication.
- macOS's system Git was unavailable without developer tools. Desktop's bundled
  Git worked with its matching executable/helper paths selected below.

For this Mac, an agent can use these **process-local** settings without changing
global configuration (first confirm these paths still exist):

```sh
export PATH="/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin:$PATH"
export GIT_EXEC_PATH="/Applications/GitHub Desktop.app/Contents/Resources/app/git/libexec/git-core"
export GIT_TERMINAL_PROMPT=0
```

These settings provide Git, not authentication. For agent-managed publication,
configure an owner-approved GitHub CLI/credential-helper login or SSH identity,
then test an actual push to a non-production branch. Do not retrieve credentials
from GitHub Desktop, paste tokens into chat, or store credentials in this repo.
GitHub Desktop's login is not automatically available to command-line Git.

Until then: let the agent prepare/check/commit the branch locally, use Desktop's
**Push origin / Publish branch**, and create the PR. The agent can review it via
the read-capable connector. Owner approval remains necessary to make it live.
Do not ask the owner to resolve raw conflict markers when the agent can safely
prepare the resolution locally. Do not advertise fully automatic publication
until write access has actually been verified.
