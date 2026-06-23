"use client";

import { Logo } from "@/components/Logo";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";

type LocalizedHeaderLogoProps = {
  href: string;
  className?: string;
  hideTaglineOnMobile?: boolean;
};

export function LocalizedHeaderLogo({
  href,
  className,
  hideTaglineOnMobile = false,
}: LocalizedHeaderLogoProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <Logo
      size="header"
      href={l(href)}
      showTagline
      hideTaglineOnMobile={hideTaglineOnMobile}
      tagline={dict.header.tagline}
      homeAriaLabel={dict.header.homeAria}
      className={className}
    />
  );
}
