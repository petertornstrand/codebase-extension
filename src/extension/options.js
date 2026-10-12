// Options page. Plain DOM code, the page is too small to need Preact.
import { ext } from './browser';
import { CONFIG_KEYS } from '../utils';

const form = document.getElementById('form');
const status = document.getElementById('status');

ext.storage.local.get([...CONFIG_KEYS, 'cb_sites']).then((values) => {
    form.elements.cb_sites.value = (values.cb_sites ?? []).join('\n');
    CONFIG_KEYS.forEach((key) => {
        form.elements[key].value = values[key] ?? '';
    });
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const config = Object.fromEntries(
        CONFIG_KEYS.map((key) => [key, form.elements[key].value.trim()])
    );
    // Each address is reduced to its origin, https only.
    const sites = [];
    for (const line of form.elements.cb_sites.value.split(/\s+/).filter(Boolean)) {
        let site;
        try {
            site = new URL(line.includes('://') ? line : `https://${line}`);
        } catch {
            status.textContent = `Not saved: "${line}" is not a valid address.`;
            return;
        }
        if (site.protocol !== 'https:') {
            status.textContent = `Not saved: "${line}" must use https.`;
            return;
        }
        if (!sites.includes(site.origin)) {
            sites.push(site.origin);
        }
    }
    config.cbapi_base_url = config.cbapi_base_url.replace(/\/+$/, '');
    status.textContent = '';

    // The credentials are sent to the gateway, so it has to be https (plain
    // http only for a gateway running on this machine).
    let gateway;
    try {
        gateway = new URL(config.cbapi_base_url);
    } catch {
        status.textContent = 'Not saved: the API gateway URL is not a valid URL.';
        return;
    }
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(gateway.hostname);
    if (gateway.protocol !== 'https:' && !(gateway.protocol === 'http:' && local)) {
        status.textContent = 'Not saved: the API gateway URL must use https.';
        return;
    }

    // The background script calls the gateway, which needs the browser's
    // permission. Must be asked straight from the click, before anything is awaited.
    const granted = await ext.permissions.request({
        origins: [`${gateway.origin}/*`, ...sites.map((origin) => `${origin}/*`)],
    });
    if (!granted) {
        status.textContent = 'Not saved: access to the API gateway and the Codebase addresses was not allowed.';
        return;
    }
    await ext.storage.local.set({ ...config, cb_sites: sites });
    status.textContent = 'Saved. Reload open Codebase tabs.';
});
