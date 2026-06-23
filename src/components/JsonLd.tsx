import type { AppLocale } from "@/lib/i18n/types";
import { getLocaleConfig } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskery.com";
}

export function organizationJsonLd() {
  const url = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: "Taskery",
    url,
    logo: `${url}/icon.svg`,
    description:
      "Freelance marketplace for clients and freelancers in Ukraine, Poland and Europe with escrow deals and ratings.",
    areaServed: [
      { "@type": "Country", name: "Ukraine" },
      { "@type": "Country", name: "Poland" },
      { "@type": "AdministrativeArea", name: "European Union" },
    ],
    knowsLanguage: ["ru", "uk", "pl", "en"],
    sameAs: [],
  };
}

export function websiteJsonLd() {
  const url = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: "Taskery",
    url,
    inLanguage: ["ru", "uk", "pl", "en"],
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function homePageJsonLd({
  title,
  description,
  locale,
}: {
  title: string;
  description: string;
  locale: AppLocale;
}) {
  const url = `${siteUrl()}${localizedPath(locale)}`;
  const localeConfig = getLocaleConfig(locale);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}/#webpage`,
      url,
      name: title,
      description,
      inLanguage: localeConfig.hreflang,
      isPartOf: { "@id": `${siteUrl()}/#website` },
      about: [
        { "@type": "Country", name: "Ukraine" },
        { "@type": "Country", name: "Poland" },
        { "@type": "AdministrativeArea", name: "European Union" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Taskery",
      description,
      url,
      provider: { "@id": `${siteUrl()}/#organization` },
      areaServed: [
        { "@type": "Country", name: "Ukraine" },
        { "@type": "Country", name: "Poland" },
        { "@type": "AdministrativeArea", name: "European Union" },
      ],
      availableLanguage: ["ru", "uk", "pl", "en"],
      serviceType: "Freelance marketplace",
    },
  ];
}

export function jobPostingJsonLd(project: {
  title: string;
  description: string;
  slug: string;
  budget: number | null;
  currency: string;
  createdAt: Date;
  deadline: Date | null;
}) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: project.title,
    description: project.description.slice(0, 5000),
    datePosted: project.createdAt.toISOString(),
    validThrough: project.deadline?.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: "Taskery",
      sameAs: base,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry:
          project.currency === "PLN" ? "PL" : project.currency === "EUR" ? "EU" : "UA",
      },
    },
    employmentType: "CONTRACTOR",
    baseSalary: project.budget
      ? {
          "@type": "MonetaryAmount",
          currency: project.currency,
          value: { "@type": "QuantitativeValue", value: project.budget },
        }
      : undefined,
    url: `${base}/projects/${project.slug}`,
  };
}

export function personJsonLd(freelancer: {
  name: string | null;
  bio: string | null;
  rating: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: freelancer.name ?? "Фрилансер",
    description: freelancer.bio ?? undefined,
    url: freelancer.url,
    aggregateRating: freelancer.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: freelancer.rating,
          bestRating: 5,
        }
      : undefined,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
