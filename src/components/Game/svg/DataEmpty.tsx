// src/components/Game/svg/DataEmpty.tsx

export default function DataEmpty() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* inner chip body (smaller square) */}
      <rect
        x="40"
        y="40"
        width="40"
        height="40"
        fill="none"
        stroke="#00ff15"
        strokeWidth="6"
      />

      {/* left pins (longer) */}
      <line x1="20" y1="50" x2="40" y2="50" stroke="#00ff15" strokeWidth="6" />
      <line x1="0" y1="60" x2="40" y2="60" stroke="#00ff15" strokeWidth="6" />
      <line x1="20" y1="70" x2="40" y2="70" stroke="#00ff15" strokeWidth="6" />

      {/* right pins (longer) */}
      <line x1="80" y1="50" x2="100" y2="50" stroke="#00ff15" strokeWidth="6" />
      <line x1="80" y1="60" x2="120" y2="60" stroke="#00ff15" strokeWidth="6" />
      <line x1="80" y1="70" x2="100" y2="70" stroke="#00ff15" strokeWidth="6" />

      {/* vertical center pins (top & bottom) */}
      <line x1="60" y1="0" x2="60" y2="40" stroke="#00ff15" strokeWidth="6" />
      <line x1="60" y1="80" x2="60" y2="120" stroke="#00ff15" strokeWidth="6" />
    </svg>
  )
}
