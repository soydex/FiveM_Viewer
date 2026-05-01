"use client";

import { Command, Play, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";

interface HeaderProps {
  serverId: string;
  setServerId: (id: string) => void;
  fetchServerData: (overrideId?: string) => void;
  loading: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  isMac: boolean;
}

const Header = ({
  serverId,
  setServerId,
  fetchServerData,
  loading,
  autoRefresh,
  setAutoRefresh,
  isMac,
}: HeaderProps) => {
  const t = useTranslations("common");

  return (
    <header className="shadow-sm bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="dark:text-white group-hover:text-purple-600 w-10 h-10 transition-colors"
            >
              <polygon fill="CurrentColor" points="5,45 9,34 21,22 15,45"></polygon>
              <polygon fill="CurrentColor" points="25,18 33,45 43,45 32,12"></polygon>
              <polygon fill="CurrentColor" points="16.059,14.164 20,3 28,3"></polygon>
              <polygon fill="CurrentColor" points="10.731,29.002 23,17 23,15 11.58,26.667"></polygon>
              <polygon fill="CurrentColor" points="15.142,16.429 13,22 29.724,5.725 28.818,3.178"></polygon>
              <polygon fill="CurrentColor" points="23.932,14.055 24.377,15.626 30.941,9.178 30.385,7.702"></polygon>
            </svg>
            <h1 className="dark:text-white font-semibold text-lg group-hover:text-purple-600 transition-colors">
              FiveM Viewer
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 items-center bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-[10px] focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-150 ease-in-out px-3 gap-2">
                <div className="flex items-center gap-1.5">
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

                <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />

                <input
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoFocus
                  placeholder={t("serverIdPlaceholder")}
                  value={serverId}
                  onChange={(e) => {
                    const newValue = e.target.value.trim();
                    setServerId(newValue);
                    if (newValue.length === 6) {
                      fetchServerData(newValue);
                    }
                  }}
                  className="bg-transparent text-gray-900 dark:text-[#f4f4f5] px-1 py-1 focus:outline-none w-32 text-sm placeholder-gray-500 dark:placeholder-zinc-500"
                />
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">
                  ID
                </span>
              </div>
              <button
                onClick={() => fetchServerData()}
                disabled={loading || !serverId.trim()}
                aria-label={t("reloadServerData")}
                title={t("reloadServerData")}
                className="relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2 px-6 py-2 bg-[#B931FC] text-white rounded-[10px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-medium whitespace-nowrap">
                  <Play
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? t("loading") : t("reload")}
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
                  className={`flex items-center gap-2 px-6 py-2 text-white rounded-[10px] font-medium whitespace-nowrap min-w-[150px] ${
                    autoRefresh
                      ? "bg-gradient-to-t from-[#2563eb] to-[#3b82f6]"
                      : "bg-gradient-to-t from-zinc-800 to-zinc-700"
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
                  />
                  {autoRefresh ? t("autoOn") : t("autoOff")}
                </span>
              </button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
