import { getRequestConfig } from "next-intl/server";
import { routing } from "../routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messagesModule =
    locale === "en"
      ? await import("../../messages/en.json")
      : await import("../../messages/fr.json");
  const messages = messagesModule.default || messagesModule;

  return {
    locale,
    messages: messages as any,
    timeZone: "Europe/Paris",
  };
});
