import React from 'react';

/**
 * Error notice shown when the extension can't decorate the page.
 *
 * @param {string} message
 *
 * @return {JSX.Element}
 */
export default function Notice({ message }) {
    return (
        <div className="CodebaseComponent CodebaseComponent--error" role="alert">
            Codebase extension: {message}
        </div>
    );
}
