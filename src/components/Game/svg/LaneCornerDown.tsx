export default function LaneCornerDown() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <filter
          id="greenGlowCornerDown"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 2.5 0"
          />
        </filter>
      </defs>

      {/* OUTER GLOW – split to avoid overlap */}
      <line
        x1="60"
        y1="0"
        x2="60"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlowCornerDown)"
        opacity="0.9"
      />
      <line
        x1="60"
        y1="60"
        x2="120"
        y2="60"
        stroke="#00ff15"
        strokeWidth="18"
        filter="url(#greenGlowCornerDown)"
        opacity="0.9"
      />

      {/* INNER CORE – unchanged shape */}
      <path
        d="M60 0 V60 H120"
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
