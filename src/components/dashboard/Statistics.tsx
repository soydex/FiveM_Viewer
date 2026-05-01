"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const StatisticsCharts = dynamic(
  () => import("../StatisticsCharts").then((m) => m.StatisticsCharts),
  { ssr: false, loading: () => <StatisticsSkeleton /> },
);

export function StatisticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
      </div>
      <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
    </div>
  );
}

interface StatisticsProps {
  serverInfo: any | null;
  loading: boolean;
}

const Statistics = ({ serverInfo, loading }: StatisticsProps) => {
  const t = useTranslations("common");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("statisticsTitle")}</h2>
      {loading ? (
        <StatisticsSkeleton />
      ) : !serverInfo ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-700">
          {t("loadServerForStats")}
        </div>
      ) : (
        <Suspense fallback={<StatisticsSkeleton />}>
          <StatisticsCharts players={serverInfo.players} />
        </Suspense>
      )}
    </div>
  );
};

export default Statistics;
