export function UzbekistanMap() {
  return (
    <svg
      viewBox="0 0 320 280"
      className="h-full w-full max-h-[320px] drop-shadow-[0_0_30px_rgba(0,212,255,0.4)]"
      aria-hidden
    >
      <defs>
        <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M48 120 L72 88 L110 72 L148 68 L188 76 L220 92 L252 108 L268 140 L260 172 L232 200 L188 220 L142 228 L98 218 L62 192 L44 158 Z"
        fill="none"
        stroke="url(#mapGrad)"
        strokeWidth="2"
        filter="url(#glow)"
        opacity="0.9"
      />
      {[
        [72, 88],
        [110, 72],
        [148, 68],
        [188, 76],
        [220, 92],
        [252, 108],
        [142, 228],
        [98, 218],
        [62, 192],
        [160, 140],
        [200, 160],
        [120, 160],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="#00d4ff" opacity="0.9" />
          <circle cx={cx} cy={cy} r="8" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" />
        </g>
      ))}
      <line x1="72" y1="88" x2="110" y2="72" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="110" y1="72" x2="148" y2="68" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="148" y1="68" x2="188" y2="76" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="188" y1="76" x2="220" y2="92" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="160" y1="140" x2="142" y2="228" stroke="#6366f1" strokeWidth="0.8" opacity="0.4" />
      <line x1="160" y1="140" x2="98" y2="218" stroke="#6366f1" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}
