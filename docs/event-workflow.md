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

Verified on 2026-09-30:

- Apple Command Line Tools are installed; standard `git` now works.
- Codex recognizes the Washington Baths Website local project as a Git repository.
- GitHub CLI is installed at `/Users/asherwoodworth/.local/bin/gh` and signed in
  as `washbaths`, with the credential stored in the macOS keyring.
- A real Git push of `chore/event-publishing-workflow` succeeded. Agent-managed
  branch uploads are working; no GitHub Desktop handoff is normally needed.
- The GitHub plugin previously returned HTTP 403 for writes. Prefer local Git
  and GitHub CLI rather than relying on that plugin's write access.

Use `git` normally and the absolute GitHub CLI path above if `gh` is not on PATH.
For checks, use `node` if available; on this Mac the bundled runtime is currently
`/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node`. Confirm it exists
before using it. These machine-specific paths are conveniences, not website
dependencies. Other machines can use their own installed Git, GitHub CLI and Node.

Check authentication with `gh auth status` (never `gh auth token`). Network or
sandbox restrictions can make this check fail even when login is valid; obtain
the required permission and retry before asking the owner to sign in again.
Never retrieve Desktop credentials, paste tokens into chat, or store credentials
in this public repository. Request permission before changing authentication.

GitHub Desktop remains a fallback if CLI access stops working. Owner approval
is still required before merging or publishing. Resolve clear homepage conflicts
locally rather than asking the owner to edit conflict markers. If permissions
or authentication block publication, state the limitation without claiming success.
