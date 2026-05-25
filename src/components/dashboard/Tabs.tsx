"use client";

import { BarChart3, Heart, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/routing";
import { useServer } from "@/components/ServerContext";

const Tabs = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { serverInfo, favorites } = useServer();

  const playersCount = serverInfo?.players?.length || 0;
  const favoritesCount = favorites?.length || 0;

  const currentTab = pathname.endsWith("/players")
    ? "players"
    : pathname.endsWith("/favorites")
      ? "favorites"
      : pathname.endsWith("/statistics")
        ? "statistics"
        : "";

  const tabs = [
    {
      id: "players",
      label: t("players"),
      count: playersCount,
      icon: Users,
    },
    {
      id: "favorites",
      label: t("favorites"),
      count: favoritesCount,
      icon: Heart,
    },
    { id: "statistics", label: t("statistics"), icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-zinc-200 border-b dark:bg-zinc-950 dark:border-zinc-700 sticky top-[72px] sm:top-[88px] z-20 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/${tab.id}`}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                currentTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Tabs;
