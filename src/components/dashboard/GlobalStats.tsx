"use client";

import { Activity, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatCardProps {
  title: string;
  current: number;
  peak: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, current, peak, icon }: StatCardProps) => {
  const t = useTranslations("common");

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-opacity-10 dark:bg-opacity-20`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {current.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <TrendingUp className="w-4 h-4 text-purple-500" />
        <span>{t("peak24h")}: </span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-200">
          {peak.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const GlobalStats = () => {
  const t = useTranslations("common");

  const { data: fivemData, error: fivemError } = useSWR(
    "https://static.cfx.re/runtime/counts.json",
    fetcher,
    { refreshInterval: 60000 },
  );

  if (fivemError) return null;
  if (!fivemData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-xl"
          />
        ))}
      </div>
    );
  }

  const fivemCurrent = fivemData[0] || 0;
  const fivemPeak = fivemData[2] || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title={t("globalPlayers")}
          current={fivemCurrent}
          peak={fivemPeak}
          icon={<Activity className="w-6 h-6 text-purple-600" />}
        />
        <StatCard
          title={t("fivemPlayers")}
          current={fivemCurrent}
          peak={fivemPeak}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </div>
  );
};

export default GlobalStats;
