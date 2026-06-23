type EmptyTasksIllustrationProps = {
  className?: string;
};

export function EmptyTasksIllustration({
  className = "mx-auto h-48 w-full max-w-xs",
}: EmptyTasksIllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="160" cy="178" rx="110" ry="12" fill="#E4E4E7" />
      <rect x="72" y="118" width="176" height="52" rx="10" fill="#6366F1" />
      <rect x="82" y="128" width="156" height="32" rx="6" fill="#818CF8" />
      <rect x="96" y="138" width="88" height="6" rx="3" fill="#C7D2FE" />
      <rect x="96" y="150" width="56" height="6" rx="3" fill="#A5B4FC" />
      <circle cx="248" cy="142" r="14" fill="#4F46E5" />
      <path
        d="M242 142h12M248 136v12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="130" cy="72" r="28" fill="#FDE68A" />
      <circle cx="130" cy="66" r="22" fill="#FEF3C7" />
      <path
        d="M108 62c4-10 16-14 22-8 6-6 18-2 22 8"
        stroke="#92400E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="122" cy="68" r="2.5" fill="#78350F" />
      <circle cx="138" cy="68" r="2.5" fill="#78350F" />
      <path
        d="M124 78c3 3 9 3 12 0"
        stroke="#78350F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="108" y="96" width="44" height="34" rx="12" fill="#7C3AED" />
      <rect x="148" y="104" width="52" height="18" rx="9" fill="#7C3AED" />
      <rect x="168" y="88" width="72" height="52" rx="8" fill="#312E81" />
      <rect x="176" y="96" width="56" height="36" rx="4" fill="#EEF2FF" />
      <rect x="184" y="106" width="32" height="4" rx="2" fill="#C7D2FE" />
      <rect x="184" y="116" width="24" height="4" rx="2" fill="#DDD6FE" />
      <rect x="184" y="126" width="28" height="4" rx="2" fill="#E0E7FF" />
      <circle cx="252" cy="98" r="6" fill="#FBBF24" />
      <path
        d="M252 92v-10M248 86h8"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M88 52l8 6-8 6"
        stroke="#A78BFA"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M172 48l8 6-8 6"
        stroke="#A78BFA"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
