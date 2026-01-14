export default function LaneCornerUp() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <filter
          id="greenGlow"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 2.2 0"
            result="glow"
          />
        </filter>
      </defs>

      {/* GLOW: horizontal */}
      <line
        x1="0"
        y1="60"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlow)"
        opacity="0.9"
      />

      {/* GLOW: vertical */}
      <line
        x1="60"
        y1="0"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlow)"
        opacity="0.9"
      />

      {/* CORE: horizontal */}
      <line
        x1="0"
        y1="60"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="6"
      />

      {/* CORE: vertical */}
      <line
        x1="60"
        y1="0"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="6"
      />
    </svg>
  )
}
