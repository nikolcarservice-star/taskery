type LandingClientsVisualProps = {
  className?: string;
};

export function LandingClientsVisual({
  className = "h-full w-full max-w-[480px]",
}: LandingClientsVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 480 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clients-floor" x1="40" y1="300" x2="440" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#F4F4F5" />
        </linearGradient>
        <linearGradient id="clients-sofa" x1="70" y1="170" x2="290" y2="290" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="clients-screen" x1="300" y1="120" x2="420" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312E81" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <filter id="clients-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#4F46E5" floodOpacity="0.12" />
        </filter>
      </defs>

      <ellipse cx="240" cy="342" rx="190" ry="18" fill="#E4E4E7" />
      <rect x="24" y="250" width="432" height="92" rx="24" fill="url(#clients-floor)" />

      <rect x="56" y="118" width="34" height="58" rx="10" fill="#86EFAC" opacity="0.85" />
      <rect x="62" y="124" width="22" height="22" rx="11" fill="#4ADE80" />
      <rect x="68" y="152" width="10" height="24" rx="5" fill="#22C55E" />

      <g filter="url(#clients-shadow)">
        <path
          d="M72 248C72 214 92 188 132 188H228C258 188 278 206 278 238V268H72V248Z"
          fill="url(#clients-sofa)"
        />
        <path
          d="M72 248H278V268C278 278 270 286 260 286H90C80 286 72 278 72 268V248Z"
          fill="#4F46E5"
        />
        <rect x="92" y="168" width="36" height="72" rx="16" fill="#5B21B6" />
        <rect x="232" y="168" width="36" height="72" rx="16" fill="#5B21B6" />
      </g>

      <circle cx="168" cy="132" r="28" fill="#FDE68A" />
      <circle cx="168" cy="126" r="22" fill="#FEF3C7" />
      <path
        d="M148 122c4-10 16-12 22-4 6-8 18-4 20 6"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="160" cy="128" r="2.5" fill="#78350F" />
      <circle cx="176" cy="128" r="2.5" fill="#78350F" />
      <path
        d="M160 138c4 3 10 3 14 0"
        stroke="#78350F"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <rect x="132" y="156" width="72" height="58" rx="18" fill="#4338CA" />
      <rect x="148" y="172" width="40" height="18" rx="9" fill="#4338CA" />
      <path
        d="M118 188C126 176 146 168 168 168C190 168 210 176 218 188"
        stroke="#4338CA"
        strokeWidth="14"
        strokeLinecap="round"
      />

      <rect x="286" y="228" width="92" height="12" rx="6" fill="#D6D3D1" />
      <rect x="286" y="244" width="18" height="28" rx="4" fill="#A8A29E" />
      <rect x="360" y="244" width="18" height="28" rx="4" fill="#A8A29E" />

      <rect x="308" y="214" width="48" height="10" rx="5" fill="#F5F5F4" />
      <rect x="312" y="216" width="18" height="6" rx="3" fill="#6366F1" />

      <g filter="url(#clients-shadow)">
        <rect x="300" y="96" width="148" height="108" rx="14" fill="url(#clients-screen)" />
      </g>
      <rect x="312" y="108" width="124" height="76" rx="8" fill="#EEF2FF" />
      <rect x="322" y="118" width="56" height="8" rx="4" fill="#6366F1" />
      <rect x="322" y="132" width="84" height="6" rx="3" fill="#C7D2FE" />
      <rect x="322" y="144" width="72" height="6" rx="3" fill="#DDD6FE" />
      <rect x="322" y="162" width="44" height="12" rx="6" fill="#22C55E" />
      <rect x="328" y="166" width="20" height="4" rx="2" fill="white" />

      <g filter="url(#clients-shadow)">
        <rect x="332" y="56" width="112" height="34" rx="17" fill="white" />
      </g>
      <circle cx="352" cy="73" r="10" fill="#22C55E" />
      <path
        d="M348 73L351 76L357 69"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="368" y="67" width="58" height="7" rx="3.5" fill="#27272A" />
      <rect x="368" y="78" width="42" height="5" rx="2.5" fill="#16A34A" />

      <circle cx="108" cy="88" r="22" fill="#FEF08A" opacity="0.55" />
      <circle cx="396" cy="286" r="16" fill="#C4B5FD" opacity="0.45" />
    </svg>
  );
}
