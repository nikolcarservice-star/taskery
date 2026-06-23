type LandingSafetyVisualProps = {
  className?: string;
  labels: {
    escrowFunds: string;
    client: string;
    freelancer: string;
  };
};

export function LandingSafetyVisual({
  className = "h-full w-full max-w-[500px]",
  labels,
}: LandingSafetyVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="safety-bg" x1="40" y1="30" x2="460" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#F5F3FF" />
        </linearGradient>
        <linearGradient id="safety-shield" x1="190" y1="70" x2="310" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="safety-vault" x1="170" y1="250" x2="330" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312E81" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <filter id="safety-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#4F46E5" floodOpacity="0.16" />
        </filter>
      </defs>

      <rect x="28" y="24" width="444" height="372" rx="32" fill="url(#safety-bg)" />
      <circle cx="88" cy="72" r="34" fill="#C7D2FE" opacity="0.45" />
      <circle cx="412" cy="340" r="42" fill="#DDD6FE" opacity="0.5" />

      <g filter="url(#safety-shadow)">
        <path
          d="M250 58L318 88V168C318 218 286 252 250 266C214 252 182 218 182 168V88L250 58Z"
          fill="url(#safety-shield)"
        />
      </g>
      <path
        d="M228 166L244 182L276 144"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="228" y="108" width="44" height="8" rx="4" fill="white" opacity="0.35" />
      <rect x="238" y="122" width="24" height="6" rx="3" fill="white" opacity="0.25" />

      <g filter="url(#safety-shadow)">
        <rect x="156" y="276" width="188" height="72" rx="20" fill="url(#safety-vault)" />
      </g>
      <rect x="176" y="296" width="148" height="32" rx="12" fill="#EEF2FF" />
      <rect x="188" y="306" width="72" height="8" rx="4" fill="#6366F1" />
      <rect x="268" y="304" width="40" height="12" rx="6" fill="#22C55E" />
      <circle cx="198" cy="310" r="3" fill="#22C55E" />
      <text x="214" y="348" fill="#C7D2FE" fontSize="11" fontWeight="600">
        {labels.escrowFunds}
      </text>

      <g filter="url(#safety-shadow)">
        <rect x="48" y="148" width="118" height="118" rx="24" fill="white" />
      </g>
      <circle cx="82" cy="182" r="18" fill="#DBEAFE" />
      <circle cx="82" cy="178" r="13" fill="#BFDBFE" />
      <path
        d="M74 174c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#1D4ED8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="106" y="168" width="44" height="7" rx="3.5" fill="#27272A" />
      <rect x="106" y="180" width="32" height="5" rx="2.5" fill="#A1A1AA" />
      <rect x="62" y="214" width="74" height="18" rx="9" fill="#DCFCE7" />
      <rect x="70" y="220" width="48" height="6" rx="3" fill="#16A34A" />
      <text x="62" y="248" fill="#71717A" fontSize="10" fontWeight="600">
        {labels.client}
      </text>

      <g filter="url(#safety-shadow)">
        <rect x="334" y="148" width="118" height="118" rx="24" fill="white" />
      </g>
      <circle cx="368" cy="182" r="18" fill="#EDE9FE" />
      <circle cx="368" cy="178" r="13" fill="#DDD6FE" />
      <path
        d="M360 174c2-4 8-5 11-2 3-3 9-2 11 2"
        stroke="#6D28D9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="392" y="168" width="44" height="7" rx="3.5" fill="#27272A" />
      <rect x="392" y="180" width="32" height="5" rx="2.5" fill="#A1A1AA" />
      <rect x="348" y="214" width="74" height="18" rx="9" fill="#EEF2FF" />
      <rect x="356" y="220" width="48" height="6" rx="3" fill="#6366F1" />
      <text x="348" y="248" fill="#71717A" fontSize="10" fontWeight="600">
        {labels.freelancer}
      </text>

      <path
        d="M166 204C190 230 210 248 230 258"
        stroke="#A5B4FC"
        strokeWidth="2"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
      <path
        d="M334 204C310 230 290 248 270 258"
        stroke="#C4B5FD"
        strokeWidth="2"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />

      <g filter="url(#safety-shadow)">
        <rect x="186" y="356" width="128" height="28" rx="14" fill="white" />
      </g>
      <circle cx="206" cy="370" r="7" fill="#22C55E" />
      <rect x="220" y="365" width="72" height="6" rx="3" fill="#27272A" />
      <rect x="220" y="375" width="54" height="4" rx="2" fill="#16A34A" />
    </svg>
  );
}
