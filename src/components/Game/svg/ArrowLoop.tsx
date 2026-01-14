export default function ArrowLoop() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <path
        d="
          M100 15
          H25
          L40 0
          M25 15
          L40 30

          M10 30
          V105
          H95
          L80 90
          M95 105
          L80 120

          M110 105
          V15
        "
        fill="none"
        stroke="#808080"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
