export default function LaneCornerRight() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <filter
          id="greenGlowCornerRight"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="14" />
          <feColorMatrix
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 2.5 0"
          />
        </filter>
      </defs>

      {/* OUTER GLOW — split to avoid corner overlap */}
      <line
        x1="60"
        y1="120"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlowCornerRight)"
        opacity="0.9"
      />
      <line
        x1="60"
        y1="60"
        x2="120"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlowCornerRight)"
        opacity="0.9"
      />

      {/* INNER CORE — unchanged */}
      <path
        d="M60 120 V60 H120"
        stroke="#00ff15"
        strokeWidth="6"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
        shapeRendering="crispEdges"
      />
    </svg>
  )
}
