type LandingHeroVisualProps = {
  className?: string;
  reviewsCount: string;
};

export function LandingHeroVisual({
  className = "h-full w-full max-w-[540px]",
  reviewsCount,
}: LandingHeroVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 540 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hero-bg" x1="60" y1="40" x2="480" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="0.55" stopColor="#F5F3FF" />
          <stop offset="1" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="hero-card" x1="120" y1="120" x2="420" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="hero-shield" x1="360" y1="48" x2="420" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#4F46E5" floodOpacity="0.14" />
        </filter>
        <filter id="hero-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#18181B" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect x="36" y="28" width="468" height="404" rx="32" fill="url(#hero-bg)" />
      <circle cx="92" cy="72" r="44" fill="#C7D2FE" opacity="0.45" />
      <circle cx="448" cy="360" r="56" fill="#DDD6FE" opacity="0.55" />
      <circle cx="420" cy="96" r="28" fill="#A5B4FC" opacity="0.35" />

      <g filter="url(#hero-shadow)">
        <rect x="118" y="118" width="304" height="214" rx="24" fill="white" />
      </g>

      <rect x="138" y="138" width="264" height="36" rx="12" fill="#F4F4F5" />
      <rect x="148" y="148" width="92" height="8" rx="4" fill="#D4D4D8" />
      <rect x="148" y="160" width="64" height="6" rx="3" fill="#E4E4E7" />

      <rect x="138" y="188" width="264" height="54" rx="14" fill="#EEF2FF" />
      <rect x="152" y="202" width="118" height="8" rx="4" fill="#6366F1" />
      <rect x="152" y="218" width="88" height="6" rx="3" fill="#A5B4FC" />
      <rect x="286" y="200" width="96" height="28" rx="14" fill="url(#hero-card)" />
      <path
        d="M308 214H360M334 200V228"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <rect x="138" y="256" width="264" height="56" rx="14" fill="#FAFAFA" stroke="#E4E4E7" />
      <circle cx="164" cy="284" r="16" fill="#FDE68A" />
      <circle cx="164" cy="278" r="12" fill="#FEF3C7" />
      <path
        d="M154 274c3-6 12-8 16-4 4-4 13-2 16 4"
        stroke="#92400E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="188" y="272" width="96" height="8" rx="4" fill="#D4D4D8" />
      <rect x="188" y="286" width="72" height="6" rx="3" fill="#E4E4E7" />
      <rect x="352" y="272" width="34" height="24" rx="12" fill="#DCFCE7" />
      <path
        d="M360 284L367 291L378 278"
        stroke="#16A34A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g filter="url(#hero-soft)">
        <rect x="48" y="286" width="148" height="92" rx="20" fill="white" />
      </g>
      <circle cx="82" cy="322" r="18" fill="#DBEAFE" />
      <circle cx="82" cy="318" r="13" fill="#BFDBFE" />
      <path
        d="M74 314c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#1D4ED8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="106" y="308" width="68" height="8" rx="4" fill="#27272A" />
      <rect x="106" y="322" width="48" height="6" rx="3" fill="#A1A1AA" />
      <rect x="62" y="346" width="84" height="18" rx="9" fill="#EEF2FF" />
      <rect x="70" y="352" width="52" height="6" rx="3" fill="#6366F1" />

      <g filter="url(#hero-soft)">
        <rect x="344" y="54" width="148" height="92" rx="20" fill="white" />
      </g>
      <circle cx="378" cy="90" r="18" fill="#EDE9FE" />
      <circle cx="378" cy="86" r="13" fill="#DDD6FE" />
      <path
        d="M370 82c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#6D28D9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="402" y="76" width="68" height="8" rx="4" fill="#27272A" />
      <rect x="402" y="90" width="48" height="6" rx="3" fill="#A1A1AA" />
      <path
        d="M360 118H476"
        stroke="#E4E4E7"
        strokeWidth="1"
      />
      <text x="368" y="132" fill="#F59E0B" fontSize="11" fontWeight="700">
        ★ 4.9
      </text>
      <text x="404" y="132" fill="#71717A" fontSize="10">
        {reviewsCount}
      </text>

      <g filter="url(#hero-soft)">
        <rect x="372" y="318" width="132" height="56" rx="18" fill="white" />
      </g>
      <rect x="388" y="334" width="28" height="28" rx="10" fill="url(#hero-shield)" />
      <path
        d="M396 346L402 352L408 342"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="424" y="336" width="60" height="7" rx="3.5" fill="#27272A" />
      <rect x="424" y="349" width="48" height="6" rx="3" fill="#16A34A" />

      <path
        d="M196 330C240 300 280 250 320 210"
        stroke="#A5B4FC"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
      <path
        d="M344 146C300 180 250 230 220 286"
        stroke="#C4B5FD"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />

      <g filter="url(#hero-soft)">
        <rect x="188" y="52" width="164" height="44" rx="22" fill="white" />
      </g>
      <circle cx="212" cy="74" r="10" fill="#22C55E" />
      <circle cx="212" cy="74" r="4" fill="white" />
      <rect x="230" y="66" width="96" height="8" rx="4" fill="#27272A" />
      <rect x="230" y="80" width="72" height="6" rx="3" fill="#A1A1AA" />
    </svg>
  );
}
