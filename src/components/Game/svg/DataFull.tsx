// src/components/Game/svg/DataFull.tsx

export default function DataFull() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <filter
          id="cyanGlow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 2 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      {/* inner chip body (filled + glow) */}
      <rect
        x="40"
        y="40"
        width="40"
        height="40"
        fill="#00fcff"
        filter="url(#cyanGlow)"
      />

      {/* left pins */}
      <line x1="20" y1="50" x2="40" y2="50" stroke="#00ff15" strokeWidth="6" />
      <line x1="0" y1="60" x2="40" y2="60" stroke="#00ff15" strokeWidth="6" />
      <line x1="20" y1="70" x2="40" y2="70" stroke="#00ff15" strokeWidth="6" />

      {/* right pins */}
      <line x1="80" y1="50" x2="100" y2="50" stroke="#00ff15" strokeWidth="6" />
      <line x1="80" y1="60" x2="120" y2="60" stroke="#00ff15" strokeWidth="6" />
      <line x1="80" y1="70" x2="100" y2="70" stroke="#00ff15" strokeWidth="6" />

      {/* vertical center pins */}
      <line x1="60" y1="0" x2="60" y2="40" stroke="#00ff15" strokeWidth="6" />
      <line x1="60" y1="80" x2="60" y2="120" stroke="#00ff15" strokeWidth="6" />
    </svg>
  )
}
