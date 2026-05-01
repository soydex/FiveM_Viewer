"use client";

import { useTranslations } from "next-intl";

interface RefreshBadgeProps {
  lastRefreshTimestamp: number | null;
}

const RefreshBadge = ({ lastRefreshTimestamp }: RefreshBadgeProps) => {
  const t = useTranslations("common");

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-950 px-3 py-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50 flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {t("lastRefresh")} :{" "}
        {lastRefreshTimestamp
          ? new Date(lastRefreshTimestamp).toLocaleString()
          : t("never")}
      </span>
    </div>
  );
};

export default RefreshBadge;
