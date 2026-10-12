// Collects the release files in dist/release:
//
//     codebase-firefox-<version>.zip    the Firefox extension
//     codebase-chrome-<version>.zip     the Chrome extension
//
// Run `npm run build:extension` first, or use `npm run release:build` which does
// all of it. The zip files have the manifest at their root, as the browser stores
// expect.
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';

const dist = resolve('dist');
const out = resolve(dist, 'release');
const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const target of ['firefox', 'chrome']) {
    const dir = resolve(dist, 'extension', target);
    if (!existsSync(resolve(dir, 'manifest.json'))) {
        throw new Error(`dist/extension/${target} is missing, run \`npm run build:extension\` first.`);
    }
    // The manifest and package.json must agree on the version, or the stores reject the update.
    const manifestVersion = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf-8')).version;
    if (manifestVersion !== version) {
        throw new Error(`The ${target} manifest is version ${manifestVersion}, expected ${version}. Rebuild.`);
    }
    // -X leaves out file times and permissions, so the same build gives the same zip.
    execFileSync('zip', ['-qrX', resolve(out, `codebase-${target}-${version}.zip`), '.'], { cwd: dir });
}

console.log(`Release files for ${version} in ${out}`);
