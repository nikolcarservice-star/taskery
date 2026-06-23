type LandingFreelancersVisualProps = {
  className?: string;
  labels: {
    newProject: string;
    ratingGrowing: string;
  };
};

export function LandingFreelancersVisual({
  className = "h-full w-full max-w-[500px]",
  labels,
}: LandingFreelancersVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="freelancers-bg" x1="24" y1="24" x2="476" y2="396" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#F5F3FF" />
        </linearGradient>
        <linearGradient id="freelancers-screen" x1="150" y1="110" x2="350" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312E81" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="freelancers-pro" x1="330" y1="56" x2="410" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="freelancers-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#4F46E5" floodOpacity="0.14" />
        </filter>
      </defs>

      <rect x="24" y="24" width="452" height="372" rx="32" fill="url(#freelancers-bg)" />
      <circle cx="88" cy="72" r="30" fill="#C7D2FE" opacity="0.45" />
      <circle cx="412" cy="348" r="36" fill="#DDD6FE" opacity="0.5" />

      <g filter="url(#freelancers-shadow)">
        <rect x="118" y="88" width="264" height="184" rx="20" fill="url(#freelancers-screen)" />
      </g>
      <rect x="134" y="104" width="232" height="136" rx="10" fill="#EEF2FF" />
      <rect x="148" y="118" width="88" height="8" rx="4" fill="#6366F1" />
      <rect x="148" y="132" width="128" height="6" rx="3" fill="#C7D2FE" />
      <rect x="148" y="146" width="104" height="6" rx="3" fill="#DDD6FE" />
      <rect x="148" y="168" width="196" height="28" rx="10" fill="white" />
      <rect x="160" y="178" width="72" height="8" rx="4" fill="#27272A" />
      <rect x="292" y="176" width="40" height="12" rx="6" fill="#22C55E" />
      <rect x="148" y="204" width="196" height="28" rx="10" fill="white" />
      <rect x="160" y="214" width="64" height="8" rx="4" fill="#27272A" />
      <rect x="292" y="212" width="40" height="12" rx="6" fill="#6366F1" />

      <rect x="118" y="72" width="72" height="18" rx="9" fill="#18181B" opacity="0.35" />
      <circle cx="130" cy="81" r="4" fill="#F87171" />
      <circle cx="142" cy="81" r="4" fill="#FBBF24" />
      <circle cx="154" cy="81" r="4" fill="#34D399" />

      <circle cx="250" cy="300" r="34" fill="#FDE68A" />
      <circle cx="250" cy="292" r="26" fill="#FEF3C7" />
      <path
        d="M226 286c5-12 20-16 28-6 8-10 23-6 28 6"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="240" cy="294" r="2.5" fill="#78350F" />
      <circle cx="260" cy="294" r="2.5" fill="#78350F" />
      <rect x="214" y="318" width="72" height="52" rx="18" fill="#4338CA" />
      <rect x="248" y="332" width="92" height="14" rx="7" fill="#4338CA" />

      <g filter="url(#freelancers-shadow)">
        <rect x="48" y="128" width="132" height="72" rx="18" fill="white" />
      </g>
      <rect x="64" y="144" width="72" height="8" rx="4" fill="#27272A" />
      <rect x="64" y="158" width="96" height="6" rx="3" fill="#A1A1AA" />
      <rect x="64" y="176" width="52" height="12" rx="6" fill="#DCFCE7" />
      <text x="72" y="186" fill="#16A34A" fontSize="9" fontWeight="700">
        + ₴ 8 500
      </text>

      <g filter="url(#freelancers-shadow)">
        <rect x="320" y="48" width="132" height="72" rx="18" fill="white" />
      </g>
      <rect x="336" y="58" width="72" height="18" rx="9" fill="url(#freelancers-pro)" />
      <text x="348" y="71" fill="white" fontSize="9" fontWeight="700">
        TaskBoost
      </text>
      <rect x="336" y="84" width="88" height="6" rx="3" fill="#27272A" />
      <rect x="336" y="96" width="64" height="5" rx="2.5" fill="#A1A1AA" />

      <g filter="url(#freelancers-shadow)">
        <rect x="48" y="280" width="132" height="72" rx="18" fill="white" />
      </g>
      <circle cx="72" cy="308" r="12" fill="#6366F1" />
      <path
        d="M66 308H78M72 302V314"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="92" y="298" width="72" height="7" rx="3.5" fill="#27272A" />
      <rect x="92" y="312" width="56" height="5" rx="2.5" fill="#6366F1" />
      <text x="64" y="338" fill="#71717A" fontSize="9">
        {labels.newProject}
      </text>

      <g filter="url(#freelancers-shadow)">
        <rect x="320" y="288" width="132" height="64" rx="18" fill="white" />
      </g>
      <text x="336" y="312" fill="#F59E0B" fontSize="12" fontWeight="700">
        ★ 4.8
      </text>
      <text x="368" y="312" fill="#71717A" fontSize="9">
        {labels.ratingGrowing}
      </text>
      <rect x="336" y="324" width="96" height="6" rx="3" fill="#E4E4E7" />
      <rect x="336" y="324" width="72" height="6" rx="3" fill="#6366F1" />
    </svg>
  );
}
