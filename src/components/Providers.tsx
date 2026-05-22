"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ServerProvider } from "./ServerContext";

export function Providers({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: any;
  locale: string;
}) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone="Europe/Paris"
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ServerProvider>{children}</ServerProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
