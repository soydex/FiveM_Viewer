"use client";

import { ChevronDown, Clock, Server, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ServerHistoryItem {
  id: string;
  name: string;
  lastVisited: number;
}

interface ServerHistoryProps {
  serverHistory: ServerHistoryItem[];
  onSelectServer: (id: string) => void;
  onRemoveFromHistory: (id: string) => void;
  formatDate: (date: Date) => string;
}

const ServerHistory = ({
  serverHistory,
  onSelectServer,
  onRemoveFromHistory,
  formatDate,
}: ServerHistoryProps) => {
  const t = useTranslations("common");
  const [showHistory, setShowHistory] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (serverHistory.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className={`w-full group relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] rounded-[12px] active:scale-[0.98] ${
          showHistory
            ? "bg-gradient-to-t from-[#8122b0] to-[#dc98fd]"
            : "bg-zinc-200 dark:bg-black bg-gradient-to-t from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-500"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-[10px] font-medium transition-all ${
            showHistory
              ? "bg-gradient-to-t from-[#a62ce2] to-[#c045fc] text-white"
              : "bg-white text-zinc-900 dark:text-white dark:bg-gradient-to-t dark:from-zinc-800 dark:to-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`p-2 rounded-lg transition-colors ${
                showHistory ? "" : "bg-zinc-100 dark:bg-transparent"
              }`}
            >
              <Clock
                className={`w-4 h-4 ${showHistory ? "" : "text-zinc-500 dark:text-white"}`}
              />
            </div>
            <div className="text-left">
              <div
                className={`font-semibold text-sm ${showHistory ? "text-white" : "text-zinc-900 dark:text-white"}`}
              >
                {t("recentServers")}
              </div>
              <div
                className={`text-xs transition-colors ${
                  showHistory
                    ? "text-purple-100"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {serverHistory.length}{" "}
                {t("server", { count: serverHistory.length })}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              showHistory
                ? "rotate-180 text-white"
                : "text-zinc-400 dark:text-zinc-400"
            }`}
          />
        </div>
      </button>

      {showHistory && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowHistory(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top z-50 animate-in fade-in zoom-in-95">
            <div className="max-h-96 overflow-y-auto">
              {serverHistory.map((server, index) => (
                <div
                  key={server.id}
                  onMouseEnter={() => setHoveredId(server.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative transition-colors duration-150 ${
                    index !== serverHistory.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-700"
                      : ""
                  } ${
                    hoveredId === server.id
                      ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-zinc-700/50"
                      : "hover:bg-gradient-to-r hover:from-purple-25 hover:to-transparent dark:hover:from-zinc-700/30 dark:hover:to-transparent"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectServer(server.id);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-4 py-3 transition-all duration-150"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg mt-0.5">
                        <Server className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {server.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {server.id}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            •
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(server.lastVisited))}
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromHistory(server.id);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-950 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0 cursor-pointer"
                        title={t("removeFromHistory")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServerHistory;
