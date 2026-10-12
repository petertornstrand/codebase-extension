# Codebase Extension

A Firefox and Chrome extension that improves the
[Codebase](https://www.codebasehq.com/) project management application. It
restyles the ticket page, adds a project scoped search, shows a summary of
recent activity on the dashboard and more.

It is the browser extension version of the
[Codebase userscript](https://github.com/petertornstrand/codebase-userscript)
(now archived), and has the same features, described under
[Features](#features). The extension adds a settings page (no editing of a
userscript manager's value storage), notifications through the browser, and
installs without a userscript manager.

The ticket page improvements depend on the
[Codebase API Gateway](https://github.com/petertornstrand/cbapi) (CB API), a
separate project that sits between the extension and the Codebase API. You need
a running gateway to use them, see [Requirements](#requirements).

It is written with [Preact](https://preactjs.com/) (through `preact/compat`, so
the code and libraries use the React API) and built with [Vite](https://vite.dev/)
as a Manifest V3 extension.

The extension runs on Codebase accounts at `https://<account>.codebasehq.com/`.
An account on its own domain (such as `https://code.example.com/`) is added in
the settings, see [Configuration](#configuration).

## Features

### Modern look

The whole interface gets a GitHub inspired look: a restyled site header and
navigation, mono colour icons (GitHub Octicons) instead of Codebase's icon
font and bitmaps, rounded comment cards and boxes, buttons, tabs, pagination
and tables. It is applied with CSS on top of Codebase's own markup, so the
original links and scripts keep working.

### Avatars

Codebase's grey placeholder avatar, which people without a picture get, is
replaced everywhere (feed, comments, members, participants) by their initials
on a colour that follows their name. A placeholder is recognised by how the
image looks: bright, grey and flat. Real pictures are left alone.

### Ticket page

Ticket pages are rebuilt using data from the Codebase API (see
[Configuration](#configuration)).

#### New ticket header

- Adds the ticket ID before the title.
- Adds a **Copy ticket reference** button (`#123 Subject`) for easy pasting
  into time tracking entries.
- Adds a **Copy ticket link** button that copies a Markdown link,
  `[#123 Subject](url)`.
- Adds a **Last comment** button that scrolls the latest comment into view.
  The copy and last comment actions are icon buttons next to the title.
- Makes the header sticky.
- Updates the styling of the status and priority fields.
- Shows a loading skeleton, with the title and placeholders for the sidebar,
  while the ticket data is fetched.

#### Comments and timeline

- Comment cards with a header, the author's Codebase avatar and an icon button
  for "Edit this update".
- Ticket changes (status, assignee...) are listed as timeline events with the
  same spacing whatever the type of change.
- The ticket detail tabs (Change Details, Progress and Deadlines...) and the
  "Post a response" box match the rest of the interface.

#### New sidebar

Replaces the right sidebar with a modern looking and information dense version
based on the GitHub issue sidebar.

- **Reporter** and the date the ticket was reported.
- **Ticket properties**: type, status, priority and so on, plus **Access**
  (Public or Private).
- **Participants**: all users who have taken part in the ticket, shown with
  their regular Codebase avatars. Hovering an avatar displays additional user
  information.
- **Milestone**: a compact version that does not use more space than needed,
  with due date and project manager.
- **Referenced tickets**: lists all tickets referenced in the ticket.
- **Blockers**: moves the hidden "Blockers" feature into plain sight.
- **Tags**: moved into the sidebar. Tags with the prefix `alert:` are
  highlighted.
- **Branch**: displays the branch associated with the ticket, based on a tag
  named like `branch:1023-branch-name`.
- **Notifications**: shows only the relevant action, Subscribe or Unsubscribe.
  The state and the action use Codebase's own Notifications popout, so
  Codebase saves the change as usual. Subscribe turns on email notifications,
  Unsubscribe turns off every channel that is on.
- **Ticket actions**: the ticket links (add acceptance criteria, move, make
  private, delete...) are collected in a drop-button.

#### Mentions

@mentions in comments and in the activity feed show a name, `@Vito K.`, instead
of the handle, `@vito-kasim-31`. The handle is the tooltip. The name comes from
the project's users, from a matching name on the page, or from the handle itself
when it has several parts. A handle that can't be turned into a name is left as
it is.

#### Decorated ticket links

Links to tickets in comments are decorated with additional information.

#### Comments with tasks

Comments that contain task lists are highlighted.

### Project pages

- **Project search**: the header search is moved to the center of the header
  and limited to the current project.
- **Open tickets by default**: the "Tickets" menu link only lists open tickets
  (`status:open`).

#### Project overview

- The activity feed is a clean list: avatar, a sentence with the event type,
  the time on the right and the details below.
- **Quick stats** are remade as a compact card at the top of the right sidebar.
- **Who's on this project** is a row of avatars, like the ticket participants.
- **Project settings** is a drop-button.
- The ticket counts are tiles with a bar showing the share of open tickets,
  instead of the pie chart, and the milestones are listed with their due date.
- "Never group similar events" and "Subscribe with RSS" are small buttons.

#### Milestone page

Underlined tabs, cards for the description, properties and ticket stats, a
progress bar instead of the pie chart, and one table per user with the
tickets coloured by status.

#### Milestones

One card per milestone with the description, dates and who is responsible,
tiles for new, open and closed tickets and a progress bar instead of the pie
chart.

#### Ticket list

A search field with a button, modern pagination and a table with fixed
columns, status pills and a tidy footer with the Kanban and CSV links.

### Dashboard

- **Recent activity** at the top of the right sidebar, derived from the activity
  feed that is on the page: the number of events, tickets and commits, the
  busiest projects and the most active people.
- **Your Projects** is a plain list that scrolls when it is long.
- The activity feed gets the same clean layout as the project overview, including
  created and deleted branches in the details of a push.
- The **project view** (events grouped by project) has a heading per project with
  its icon and a link to all its events.

### Browse Projects

The "Your Projects" page has underlined tabs (Active, On Hold, Archived), one
section per company and the projects as small cards with a status pill.

### Project browser

The "Projects" popover in the site header is restyled: your projects with the
number of tickets assigned to you, and all projects with a filter, status
pills and the hover highlight.

### User pages

Adds a list of the tickets worked on today, grouped by project, to the top of
the user activity feed. Handy for copying into a time tracker.

### Fallback

If the API or the configuration is unavailable, the ticket page is left as
Codebase renders it and a small notice is shown in the bottom right corner.
The features that do not use the API (project and user page improvements and
the highlighting of comments with tasks) keep working.

## Requirements

- A running instance of the
  [Codebase API Gateway](https://github.com/petertornstrand/cbapi) (CB API). The
  extension talks to the Codebase API only through it, so set it up first and
  keep its URL and API key at hand.
- A Codebase API username and key.

Without the gateway the ticket page is left as Codebase renders it, see
[Configuration](#configuration). Everything else works without it.

## Install

Everything is attached to the
[latest release](https://github.com/petertornstrand/codebase-extension/releases/latest).

### Firefox

1. Download `codebase-firefox-X.Y.Z.xpi` from the latest release and open it in
   Firefox (or drag it onto a Firefox window). Firefox asks to add it.
2. Click the toolbar button, enter the [configuration](#configuration) and
   allow access to the API gateway when asked.

The `.xpi` is only there when the release was signed, see
[Signing the Firefox extension](#signing-the-firefox-extension). Release
Firefox only runs signed extensions.

### Chrome

Chrome only installs extensions outside its store in developer mode: unzip
`codebase-chrome-X.Y.Z.zip` to a folder you keep, open `chrome://extensions`,
enable _Developer mode_, click _Load unpacked_ and pick the folder. To update,
unzip the new release over it and click reload.

### Don't run it together with the userscript

If the (archived) userscript from the
[userscript repository](https://github.com/petertornstrand/codebase-userscript)
is installed as well, both decorate the page and it ends up decorated twice.
Disable the userscript.

## Configuration

The ticket page needs access to the Codebase API through the
[Codebase API Gateway](https://github.com/petertornstrand/cbapi), a separate
project that this extension uses to communicate with the Codebase API. Click the
toolbar button to open the settings:

| Setting                  | Description                           |
|--------------------------|---------------------------------------|
| API gateway URL          | URL of the Codebase API Gateway.      |
| API gateway key          | API key for the Codebase API Gateway. |
| Codebase API username    | Your Codebase API username.           |
| Codebase API key         | Your Codebase API key.                |
| Other Codebase addresses | Only if your Codebase is not at `*.codebasehq.com`: the address(es) it runs on, one per line. |

When you save, the browser asks whether the extension may access the API
gateway and the addresses you listed: allow it. Reload open Codebase tabs after saving. The settings are
stored in this browser only (`storage.local`, they are not synced).

Without the settings the ticket page is left as Codebase renders it and a small
notice is shown in the bottom right corner. The features that do not use the API
keep working.

## How it works

- `src/extension/content.js` is the content script. It loads the settings from
  `storage.local`, hands them to the page code through `setPlatform()` in
  `src/utils.js` and starts the page code (`start()` in `src/index.jsx`).
- `src/extension/background.js` creates notifications and makes the requests to
  the API gateway and to Gravatar (for the initials avatars). Firefox applies the
  page's CORS rules to content scripts, so they can't do it themselves. It only
  talks to the configured gateway and to Gravatar.
- `src/extension/options.html` and `options.js` is the settings page. It asks the
  browser for access to the gateway when you save.
- `src/extension/manifest.base.json` is merged with `manifest.firefox.json` or
  `manifest.chrome.json`. The only differences between the browsers are the
  background declaration and the Firefox add-on id.
- The rest of `src/` is the page code: one module per page (`src/pages/`),
  Preact components for the ticket page and the stylesheets in `src/styles/`.

The extension bundles everything into one content script, which evaluates all
modules when it starts. Code that runs when a module loads therefore can't depend
on the settings, which are read asynchronously (the API config is read when a
request is made). `src/extension/bundle.test.js` runs the built extension against
a simulated page to catch this kind of problem.

A page is claimed with a `data-cb-enhancer` attribute on `<html>`, so that
two copies of the improvements don't both run. The userscript doesn't check it
(yet), so the extension can't stop the userscript from running.

## Development

[DDEV](https://ddev.com/) provides Node.js 22 (and `zip`, for the release
build), so nothing needs to be installed on the host. Start it once and run the
`npm` commands through `ddev`, in this folder. With Node.js 22 installed on the
host, plain `npm` works as well.

```sh
ddev start
ddev npm install
ddev npm test              # single run
ddev npm run test:watch    # re-run on change
ddev npm run build         # both browsers, output in dist/extension/<target>
ddev npm run build firefox # or chrome
```

Load the build in the browser:

- **Firefox:** open `about:debugging#/runtime/this-firefox`, click _Load
  Temporary Add-on_ and pick `dist/extension/firefox/manifest.json`. After a
  rebuild click _Reload_. A temporary add-on is removed when Firefox restarts.
- **Chrome:** open `chrome://extensions`, enable _Developer mode_, click _Load
  unpacked_ and pick `dist/extension/chrome`. After a rebuild click the reload
  button on the extension.

The tests run against Preact, like the build. The Codebase API is mocked, and the
Codebase page markup is represented by small fixtures in `src/test/fixtures.js`.
Update the fixtures if Codebase changes its markup.

### Icons

The extension icons are in `src/extension/icons`: `icon.svg` and
`icon-small.svg` are the sources, the PNGs are the sizes the manifest uses. The
Codebase specific icons in the stylesheet are generated from GitHub Octicons
with `npm run icons`.

### Page code from the userscript

The page code started as a copy of the userscript's. The userscript repository
is archived, so this is now the only copy to maintain. The extension's copy
differs from the original in
`src/utils.js` (config, requests and notifications go through the extension),
`src/index.jsx` (`start()` is called by the content script), `src/Global.jsx` and
`src/CodebaseAPI.js` (the config is read when a request is made) and
`src/avatars.js` (images are loaded through the background script).

## Releasing

1. Update `version` in `package.json`. The manifests use it.
2. Commit, then push a tag with the same version:
   ```sh
   git tag v1.1.0
   git push origin main v1.1.0
   ```
3. The [release workflow](.github/workflows/release.yml) runs the tests, builds
   both extensions and creates the GitHub release with these files attached:

   | File                          | What                                      |
   |-------------------------------|-------------------------------------------|
   | `codebase-firefox-X.Y.Z.zip`  | The Firefox extension, for stores/testing |
   | `codebase-chrome-X.Y.Z.zip`   | The Chrome extension                      |
   | `codebase-firefox-X.Y.Z.xpi`  | The signed Firefox extension (see below)  |

   The workflow fails if the tag and `version` differ.

To build the same files locally (they end up in `dist/release`, needs `zip`):

```sh
ddev npm run release:build
```

### Signing the Firefox extension

Release Firefox only runs signed extensions. Signing is free and automatic for
extensions that are not listed on addons.mozilla.org ("unlisted"):

1. Create API credentials at <https://addons.mozilla.org/developers/addon/api/key/>.
2. Add them as the repository secrets `AMO_JWT_ISSUER` and `AMO_JWT_SECRET`.

With the secrets in place the workflow signs the extension and attaches
`codebase-firefox-X.Y.Z.xpi`. Without them the workflow still succeeds, but there
is no `.xpi`.

Chrome has no equivalent outside the Chrome Web Store, which is the only way to
get one-click installs and automatic updates there.

## License

GPL-3.0, see [LICENSE](LICENSE).
