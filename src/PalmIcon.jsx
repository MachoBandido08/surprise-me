// Palm tree silhouette shown next to the title, filled with the sunset gradient.
export default function PalmIcon({className}) {
    return (
        <svg className={className} viewBox="0 0 120 120" role="img"
             aria-label="Palm tree" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="palmGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff8c42"/>
                    <stop offset="55%" stopColor="#ff5f6d"/>
                    <stop offset="100%" stopColor="#b5379b"/>
                </linearGradient>
            </defs>
            <g fill="url(#palmGrad)">
                {/* trunk */}
                <path d="M45 114 C 49 82 55 60 65 44 L75 47 C 65 63 61 84 59 114 Z"/>
                {/* fronds */}
                <path d="M69 44 C 42 41 22 47 7 61 C 27 49 49 46 69 50 Z"/>
                <path d="M69 43 C 46 28 27 24 13 27 C 33 31 51 37 70 47 Z"/>
                <path d="M69 42 C 59 20 51 10 45 4 C 53 17 61 31 71 43 Z"/>
                <path d="M69 42 C 83 22 93 16 103 14 C 91 23 79 33 73 45 Z"/>
                <path d="M69 43 C 93 40 109 46 119 59 C 101 49 85 47 69 51 Z"/>
                <path d="M69 45 C 89 53 99 63 103 75 C 93 61 81 53 67 51 Z"/>
                {/* coconuts */}
                <circle cx="66" cy="49" r="3.4"/>
                <circle cx="73" cy="51" r="3"/>
                <circle cx="62" cy="53" r="2.6"/>
            </g>
        </svg>
    )
}
