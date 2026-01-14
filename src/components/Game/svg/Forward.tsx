export default function Forward() {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full">
      {/* arrow head */}
      <polygon points="50,0 100,60 0,60" fill="#808080" />

      {/* arrow shaft */}
      <rect x="30" y="60" width="40" height="80" fill="#808080" />
    </svg>
  )
}
