/**
 * Formats a date relative to now (e.g., "Just now", "2 hours ago")
 */
export function formatDate(
  date: Date,
  t: (key: string, params?: any) => string,
  locale: string,
): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / (24 * 3600000));

  if (hours < 1) return t("now");
  if (hours < 24) return t("hoursAgo", { count: hours });
  if (days < 7) return t("daysAgo", { count: days });
  
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US");
}
