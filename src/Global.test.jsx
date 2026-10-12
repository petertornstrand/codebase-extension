import React from 'react';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { DecoratedTicketLinks } from './Global';

const ticket = (id) => ({ id, htmlLink: `<a href="#${id}" class="TicketLink" data-id="${id}">#${id}</a>` });

describe('DecoratedTicketLinks', () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="content"><p id="post">
            <a rel="codebase-internal" href="/projects/acme/tickets/2">#2</a>
            <a rel="codebase-internal" href="/projects/acme/tickets/42">#42</a>
            <a rel="codebase-internal" href="/projects/acme/repositories/main/commit/abc">abc</a>
        </p></div><div id="root"></div>`;
    });

    it('replaces links to the referenced tickets and leaves the other internal links alone', async () => {
        await act(() => render(<DecoratedTicketLinks tickets={[ticket(2)]} />, document.getElementById('root')));
        const post = document.getElementById('post');
        expect(post.querySelector('.TicketLink[data-id="2"]')).not.toBeNull();
        // The current ticket and a commit are internal links too, but not referenced tickets.
        expect(post.querySelector('a[href$="/tickets/42"]')).not.toBeNull();
        expect(post.querySelector('a[href$="/commit/abc"]')).not.toBeNull();
    });
});
