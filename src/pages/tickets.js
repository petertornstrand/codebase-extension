import { log } from '../utils';

// A task is open until its checkbox is checked. Tasks without a checkbox count as open.
const OPEN_TASK = 'li.todo:not(:has(input:checked))';

/**
 * Highlight the comments that have open tasks (todo items). A comment where
 * every task is done is shown as any other comment.
 */
function markCommentsWithTasks() {
    document.querySelectorAll('.Post--full').forEach((comment) => {
        comment.classList.toggle('has-tasks', comment.querySelector(OPEN_TASK) !== null);
    });
}

let changeListening = false;
let timelineObserver = null;

/**
 * Keep the highlight right as tasks are checked and unchecked, and when
 * Codebase redraws a comment. Safe to call again, the page code runs on every
 * URL change.
 */
function watchTasks() {
    // Ticking a task changes the checkbox, not the markup around it.
    if (!changeListening) {
        changeListening = true;
        document.addEventListener('change', (event) => {
            if (event.target.matches?.('li.todo input')) {
                markCommentsWithTasks();
            }
        });
    }
    timelineObserver?.disconnect();
    const timeline = document.querySelector('.Thread__timeline');
    if (timeline) {
        timelineObserver = new MutationObserver(markCommentsWithTasks);
        timelineObserver.observe(timeline, { childList: true, subtree: true });
    }
}

/**
 * Initialize non-React ticket page improvements.
 */
export default function initTickets() {
    log('Initializing ticket page');
    markCommentsWithTasks();
    watchTasks();
}
