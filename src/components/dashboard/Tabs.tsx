"use client";

import { useTranslations } from "next-intl";
import { Users, Heart, BarChart3 } from "lucide-react";

type TabType = "players" | "favorites" | "statistics";

interface TabsProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  playersCount: number;
  favoritesCount: number;
}

const Tabs = ({
  currentTab,
  setCurrentTab,
  playersCount,
  favoritesCount,
}: TabsProps) => {
  const t = useTranslations("common");

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
    <nav className="bg-white border-zinc-200 border-b dark:bg-zinc-950 dark:border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                currentTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Tabs;
