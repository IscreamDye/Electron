export default function PutDown() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* outer box */}
      <rect
        x="6"
        y="6"
        width="108"
        height="68"
        rx="6"
        ry="6"
        fill="none"
        stroke="#00fcff"
        strokeWidth="6"
      />

      {/* arrow shaft */}
      <line
        x1="60"
        y1="28"
        x2="60"
        y2="56"
        stroke="#808080"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* arrow head */}
      <polyline
        points="44,44 60,60 76,44"
        fill="none"
        stroke="#808080"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
