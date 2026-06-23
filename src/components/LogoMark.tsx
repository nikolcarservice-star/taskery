type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="taskery-gradient"
          x1="4"
          y1="2"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F46E5" />
          <stop stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#taskery-gradient)" />
      <rect
        x="10.5"
        y="8.5"
        width="11"
        height="15.5"
        rx="2"
        stroke="white"
        strokeWidth="1.6"
        fill="none"
      />
      <rect x="13.5" y="6.5" width="5" height="3" rx="1.2" fill="white" />
      <path
        d="M13 16.2L15.1 18.3L19.5 13.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="13"
        y1="21"
        x2="19"
        y2="21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <line
        x1="13"
        y1="23.5"
        x2="17"
        y2="23.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
