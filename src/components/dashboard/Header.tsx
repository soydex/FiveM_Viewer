"use client";

import { Activity, Command, Play, RefreshCw, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import LanguageSwitcher from "../LanguageSwitcher";
import { Link } from "@/routing";
import { useServer } from "@/components/ServerContext";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Header = () => {
  const {
    serverId,
    setServerId,
    fetchServerData,
    loading,
    autoRefresh,
    setAutoRefresh,
    isMac,
  } = useServer();
  const t = useTranslations("common");

  const { data: globalCounts } = useSWR(
    "https://static.cfx.re/runtime/counts.json",
    fetcher,
    { refreshInterval: 60000 },
  );

  const globalTotal = globalCounts
    ? (globalCounts[0] || 0).toLocaleString()
    : "...";

  return (
    <header className="shadow-sm bg-white dark:bg-zinc-950 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="dark:text-white group-hover:text-purple-600 w-8 h-8 sm:w-10 sm:h-10 transition-colors"
              >
                <polygon
                  fill="CurrentColor"
                  points="5,45 9,34 21,22 15,45"
                ></polygon>
                <polygon
                  fill="CurrentColor"
                  points="25,18 33,45 43,45 32,12"
                ></polygon>
                <polygon
                  fill="CurrentColor"
                  points="16.059,14.164 20,3 28,3"
                ></polygon>
                <polygon
                  fill="CurrentColor"
                  points="10.731,29.002 23,17 23,15 11.58,26.667"
                ></polygon>
                <polygon
                  fill="CurrentColor"
                  points="15.142,16.429 13,22 29.724,5.725 28.818,3.178"
                ></polygon>
                <polygon
                  fill="CurrentColor"
                  points="23.932,14.055 24.377,15.626 30.941,9.178 30.385,7.702"
                ></polygon>
              </svg>
              <h1 className="dark:text-white font-semibold text-base sm:text-lg group-hover:text-purple-600 transition-colors truncate">
                FiveM Viewer
              </h1>
            </div>

            <div className="flex lg:hidden items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {globalTotal}
              </span>
            </div>

            <div className="hidden md:flex lg:flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                {globalTotal} {t("globalPlayers")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-1 items-center gap-2">
              <div className="flex-1 flex h-10 items-center bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-[10px] focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-150 ease-in-out px-3 gap-2">
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  {isMac ? (
                    <kbd className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-500 flex items-center justify-center min-w-[20px]">
                      <Command className="w-3 h-3" />
                    </kbd>
                  ) : (
                    <kbd className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                      CTRL
                    </kbd>
                  )}
                  <span className="text-zinc-500 text-[10px] font-medium">
                    + K
                  </span>
                </div>

                <div className="hidden sm:block w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />

                <input
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoFocus
                  placeholder={t("serverIdPlaceholder")}
                  value={serverId}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchServerData();
                    }
                  }}
                  onChange={(e) => {
                    const newValue = e.target.value.trim();
                    setServerId(newValue);
                    const isDirect =
                      newValue.includes(":") || newValue.includes(".");
                    if (!isDirect && newValue.length === 6) {
                      fetchServerData(newValue);
                    }
                  }}
                  className="bg-transparent text-gray-900 dark:text-[#f4f4f5] py-1 focus:outline-none w-full sm:w-48 text-sm placeholder-gray-500 dark:placeholder-zinc-500"
                />
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1 shrink-0">
                  {serverId.includes(":") || serverId.includes(".")
                    ? "Direct"
                    : "ID"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchServerData()}
                  disabled={loading || !serverId.trim()}
                  aria-label={t("reloadServerData")}
                  title={t("reloadServerData")}
                  className="relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 px-3 sm:px-6 py-2 bg-[#B931FC] text-white rounded-[10px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-medium whitespace-nowrap text-sm">
                    <Play
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">
                      {loading ? t("loading") : t("reload")}
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] active:scale-95 ${
                    autoRefresh
                      ? "bg-gradient-to-t from-[#1d4ed8] to-[#60a5fa]"
                      : "bg-gradient-to-t from-zinc-700 to-zinc-500"
                  }`}
                  title={
                    autoRefresh
                      ? t("disableAutoRefresh")
                      : t("enableAutoRefresh")
                  }
                >
                  <span
                    className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 text-white rounded-[10px] font-medium whitespace-nowrap sm:min-w-[150px] text-sm ${
                      autoRefresh
                        ? "bg-gradient-to-t from-[#2563eb] to-[#3b82f6]"
                        : "bg-gradient-to-t from-zinc-800 to-zinc-700"
                    }`}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">
                      {autoRefresh ? t("autoOn") : t("autoOff")}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end sm:justify-start">
              <LanguageSwitcher />
            </div>

            <div>
              <Link href="/settings" className="opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] active:scale-95">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
