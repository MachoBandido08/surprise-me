// Shown when a drink's (externally hosted) image fails to load. Inline SVG
// data URI, so it never makes a network request of its own.
export const PLACEHOLDER_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#fff3e0"/>
            <g stroke="#ff8c42" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M30 34 L70 34 L50 57 Z"/>
                <line x1="50" y1="57" x2="50" y2="78"/>
                <line x1="37" y1="80" x2="63" y2="80"/>
                <circle cx="63" cy="27" r="4"/>
            </g>
        </svg>`
    )
