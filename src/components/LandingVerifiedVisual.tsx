type LandingVerifiedVisualProps = {
  className?: string;
  labels: {
    reviewsCountA: string;
    reviewsCountB: string;
  };
};

export function LandingVerifiedVisual({
  className = "h-full w-full max-w-[500px]",
  labels,
}: LandingVerifiedVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="verified-bg" x1="30" y1="20" x2="470" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F4F5" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
        <linearGradient id="verified-pro" x1="300" y1="70" x2="420" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="verified-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#4F46E5" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="24" y="20" width="452" height="380" rx="32" fill="url(#verified-bg)" />
      <circle cx="420" cy="56" r="28" fill="#DDD6FE" opacity="0.55" />
      <circle cx="72" cy="360" r="34" fill="#C7D2FE" opacity="0.45" />

      <g filter="url(#verified-shadow)">
        <rect x="56" y="72" width="188" height="112" rx="22" fill="white" />
      </g>
      <circle cx="92" cy="108" r="22" fill="#EDE9FE" />
      <circle cx="92" cy="104" r="16" fill="#DDD6FE" />
      <path
        d="M82 100c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#6D28D9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="124" y="96" width="88" height="8" rx="4" fill="#27272A" />
      <rect x="124" y="110" width="64" height="6" rx="3" fill="#A1A1AA" />
      <text x="124" y="136" fill="#F59E0B" fontSize="12" fontWeight="700">
        ★ 4.9
      </text>
      <text x="158" y="136" fill="#71717A" fontSize="10">
        {labels.reviewsCountA}
      </text>
      <rect x="72" y="148" width="44" height="16" rx="8" fill="#DCFCE7" />
      <rect x="80" y="154" width="24" height="4" rx="2" fill="#16A34A" />
      <rect x="122" y="148" width="52" height="16" rx="8" fill="#EEF2FF" />
      <rect x="130" y="154" width="28" height="4" rx="2" fill="#6366F1" />

      <g filter="url(#verified-shadow)">
        <rect x="56" y="204" width="188" height="112" rx="22" fill="white" />
      </g>
      <circle cx="92" cy="240" r="22" fill="#DBEAFE" />
      <circle cx="92" cy="236" r="16" fill="#BFDBFE" />
      <path
        d="M82 232c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#1D4ED8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="124" y="228" width="88" height="8" rx="4" fill="#27272A" />
      <rect x="124" y="242" width="64" height="6" rx="3" fill="#A1A1AA" />
      <text x="124" y="268" fill="#F59E0B" fontSize="12" fontWeight="700">
        ★ 4.7
      </text>
      <text x="158" y="268" fill="#71717A" fontSize="10">
        {labels.reviewsCountB}
      </text>
      <rect x="72" y="280" width="44" height="16" rx="8" fill="#EEF2FF" />
      <rect x="80" y="286" width="24" height="4" rx="2" fill="#6366F1" />

      <g filter="url(#verified-shadow)">
        <rect x="276" y="56" width="168" height="260" rx="24" fill="white" />
      </g>
      <rect x="296" y="76" width="128" height="88" rx="16" fill="url(#verified-pro)" />
      <circle cx="360" cy="108" r="26" fill="white" opacity="0.18" />
      <circle cx="360" cy="102" r="20" fill="white" />
      <circle cx="360" cy="98" r="14" fill="#EDE9FE" />
      <path
        d="M352 94c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#6D28D9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="308" y="132" width="104" height="8" rx="4" fill="white" opacity="0.9" />
      <rect x="320" y="146" width="80" height="6" rx="3" fill="white" opacity="0.55" />
      <rect x="296" y="178" width="128" height="8" rx="4" fill="#27272A" />
      <rect x="296" y="192" width="96" height="6" rx="3" fill="#A1A1AA" />
      <rect x="296" y="210" width="72" height="20" rx="10" fill="#FEF3C7" />
      <text x="308" y="224" fill="#B45309" fontSize="11" fontWeight="700">
        ★ 5.0 PRO
      </text>
      <rect x="296" y="242" width="56" height="18" rx="9" fill="#DCFCE7" />
      <rect x="304" y="248" width="32" height="6" rx="3" fill="#16A34A" />
      <rect x="358" y="242" width="66" height="18" rx="9" fill="#EEF2FF" />
      <rect x="366" y="248" width="42" height="6" rx="3" fill="#6366F1" />

      <g filter="url(#verified-shadow)">
        <rect x="276" y="332" width="168" height="48" rx="16" fill="white" />
      </g>
      <rect x="292" y="346" width="36" height="28" rx="8" fill="#E0E7FF" />
      <rect x="334" y="346" width="36" height="28" rx="8" fill="#EDE9FE" />
      <rect x="376" y="346" width="36" height="28" rx="8" fill="#FCE7F3" />
      <rect x="300" y="354" width="20" height="4" rx="2" fill="#6366F1" />
      <rect x="342" y="354" width="20" height="4" rx="2" fill="#7C3AED" />
      <rect x="384" y="354" width="20" height="4" rx="2" fill="#DB2777" />

      <g filter="url(#verified-shadow)">
        <rect x="56" y="336" width="188" height="48" rx="16" fill="white" />
      </g>
      <circle cx="84" cy="360" r="12" fill="#22C55E" />
      <path
        d="M78 360L82 364L90 354"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="104" y="352" width="108" height="7" rx="3.5" fill="#27272A" />
      <rect x="104" y="364" width="72" height="5" rx="2.5" fill="#16A34A" />
    </svg>
  );
}
