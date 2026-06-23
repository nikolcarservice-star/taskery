import { CookieBanner } from "@/components/CookieBanner";
import { AccountMobileApp } from "@/components/account/AccountMobileApp";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { Providers } from "@/components/Providers";
import { auth } from "@/lib/auth";
import { getAccountMobileChromeProps } from "@/lib/account-mobile-chrome";
import { createMetadata } from "@/lib/metadata";
import { defaultLocale, getLocaleConfig, isAppLocale } from "@/lib/i18n/config";
import { DictionaryProvider } from "@/lib/i18n/dictionary-context";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/seo";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const dict = await getDictionary(defaultLocale);

  return {
    ...createMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
      path: "/",
      locale: defaultLocale,
      keywords: dict.meta.home.keywords,
    }),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteConfig.name,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const htmlLang = isAppLocale(locale) ? getLocaleConfig(locale).htmlLang : "ru";
  const session = await auth();
  const mobileChrome = session?.user
    ? await getAccountMobileChromeProps(session)
    : null;

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <DictionaryProvider locale={locale} dict={dict}>
            {children}
            {mobileChrome ? <AccountMobileApp {...mobileChrome} /> : null}
          </DictionaryProvider>
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
