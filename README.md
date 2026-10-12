# Codebase Extension

A Firefox and Chrome extension that improves the
[Codebase](https://www.codebasehq.com/) project management application. It
restyles the ticket page, adds a project scoped search, shows a summary of
recent activity on the dashboard and more.

It is the browser extension version of the
[Codebase userscript](https://github.com/petertornstrand/codebase-userscript),
which has the same features and the full description of them. The extension
adds a settings page (no editing of a userscript manager's value storage),
notifications through the browser, and installs without a userscript manager.

It is written with [Preact](https://preactjs.com/) (through `preact/compat`, so
the code and libraries use the React API) and built with [Vite](https://vite.dev/)
as a Manifest V3 extension.

The extension runs on:

- `https://code.happiness.se/*`
- `https://happiness.codebasehq.com/*`

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

If the userscript from the
[userscript repository](https://github.com/petertornstrand/codebase-userscript)
is installed as well, both decorate the page and it ends up decorated twice.
Disable the userscript.

## Configuration

The ticket page needs access to the Codebase API through the
[Codebase API Gateway](https://github.com/petertornstrand/cbapi), a separate
project that this extension uses to communicate with the Codebase API. Click the
toolbar button to open the settings:

| Setting                 | Description                           |
|-------------------------|---------------------------------------|
| API gateway URL         | URL of the Codebase API Gateway.      |
| API gateway key         | API key for the Codebase API Gateway. |
| Codebase API username   | Your Codebase API username.           |
| Codebase API key        | Your Codebase API key.                |

When you save, the browser asks whether the extension may access the API
gateway: allow it. Reload open Codebase tabs after saving. The settings are
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

You need Node.js 22. The commands are plain `npm` commands, in this folder.

```sh
npm install
npm test              # single run
npm run test:watch    # re-run on change
npm run build         # both browsers, output in dist/extension/<target>
npm run build firefox # or chrome
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

The page code started as a copy of the userscript's. The two repositories are
not linked, so a change to the page code (styling, a page improvement, a fix for
a Codebase change) has to be made in both. The extension's copy differs in
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
npm run release:build
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
