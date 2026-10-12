import { beforeEach, describe, expect, it, vi } from 'vitest';
import initTickets from './tickets';
import { ticketPage } from '../test/fixtures';

beforeEach(() => {
    document.body.innerHTML = ticketPage;
});

describe('comments with tasks', () => {
    it('marks only comments that contain todo items', () => {
        initTickets();
        const marked = [...document.querySelectorAll('.Post--full.has-tasks')].map((e) => e.id);
        expect(marked).toEqual(['post-2']);
    });

    describe('with checkboxes', () => {
        const todo = (checked) => `<li class="todo js-todo"><input type="checkbox" class="todo__input"${checked ? ' checked="checked"' : ''}><label>Task</label></li>`;
        const marked = () => [...document.querySelectorAll('.Post--full.has-tasks')].map((e) => e.id);
        const post = () => document.getElementById('post-2');

        beforeEach(() => {
            post().innerHTML = `<ul>${todo(true)}${todo(false)}</ul>`;
        });

        it('keeps the highlight while a task is open', () => {
            initTickets();
            expect(marked()).toEqual(['post-2']);
        });

        it('keeps the highlight when one of several tasks is checked', () => {
            initTickets();
            const open = post().querySelectorAll('input')[1];
            // Two open, one checked: checking one leaves one open.
            post().querySelector('ul').insertAdjacentHTML('beforeend', todo(false));
            open.checked = true;
            open.dispatchEvent(new Event('change', { bubbles: true }));
            expect(marked()).toEqual(['post-2']);
        });

        it('removes the highlight when the last task is checked, and restores it when unchecked', () => {
            initTickets();
            const open = post().querySelectorAll('input')[1];
            open.checked = true;
            open.dispatchEvent(new Event('change', { bubbles: true }));
            expect(marked()).toEqual([]);
            open.checked = false;
            open.dispatchEvent(new Event('change', { bubbles: true }));
            expect(marked()).toEqual(['post-2']);
        });

        it('does not highlight a comment where every task is done', () => {
            post().innerHTML = `<ul>${todo(true)}${todo(true)}</ul>`;
            initTickets();
            expect(marked()).toEqual([]);
        });

        it('follows a comment that Codebase redraws', async () => {
            initTickets();
            post().innerHTML = `<ul>${todo(true)}${todo(true)}</ul>`;
            await vi.waitFor(() => expect(marked()).toEqual([]));
        });
    });
});
