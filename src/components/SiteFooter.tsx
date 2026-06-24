import { Logo } from "@/components/Logo";
import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routing";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import ruMessages from "@/messages/ru.json";

type SiteFooterProps = {
  locale?: AppLocale;
  dict?: Dictionary;
};

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </p>
      <nav className="mt-4 flex flex-col gap-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter({
  locale = defaultLocale,
  dict = ruMessages,
}: SiteFooterProps) {
  const { footer, header, landing } = dict;
  const link = (path: string) => localizedPath(locale, path);
  const highlights = [
    { value: "10%", label: landing.hero.highlights.commission },
    { value: "100%", label: landing.hero.highlights.escrow },
    { value: "24/7", label: landing.hero.highlights.access },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-zinc-800/80 bg-zinc-950 text-zinc-400">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="max-w-md lg:col-span-1">
            <Logo
              size="md"
              variant="inverted"
              href={link("/")}
              showTagline
              tagline={header.tagline}
              homeAriaLabel={header.homeAria}
            />

            <p className="mt-5 text-sm leading-7 text-zinc-500">{footer.tagline}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href={link("/register")}
                className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
              >
                {header.register}
                <ArrowRightIcon />
              </Link>
              <Link
                href={link("/login")}
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-white sm:w-auto"
              >
                {header.login}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold text-white">{item.value}</span>
                  <span className="text-zinc-500">{item.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:contents">
            <FooterLinkGroup
              title={footer.platform}
              links={[
                { href: link("/projects"), label: footer.links.projects },
                { href: link("/contests"), label: dict.contests.h1 },
                { href: link("/freelancers"), label: footer.links.freelancers },
                { href: link("/pricing"), label: footer.links.pricing },
              ]}
            />

            <FooterLinkGroup
              title={footer.company}
              links={[
                { href: link("/about"), label: footer.links.about },
                { href: link("/faq"), label: footer.links.faq },
                { href: link("/contact"), label: footer.links.contact },
              ]}
            />

            <FooterLinkGroup
              title={footer.legal}
              links={[
                { href: link("/terms"), label: footer.links.terms },
                { href: link("/privacy"), label: footer.links.privacy },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Taskery
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>₴ UAH</span>
            <span aria-hidden className="text-zinc-700">
              ·
            </span>
            <span>zł PLN</span>
            <span aria-hidden className="text-zinc-700">
              ·
            </span>
            <span>€ EUR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
