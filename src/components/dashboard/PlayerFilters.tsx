"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { SearchMode } from "../../utils/search";

type SortField = "id" | "name" | "ping";
type SortOrder = "asc" | "desc";

interface PlayerFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const PlayerFilters = ({
  searchTerm,
  setSearchTerm,
  searchMode,
  setSearchMode,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: PlayerFiltersProps) => {
  const t = useTranslations("common");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("playerList")}</h2>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center justify-between gap-2 px-3 py-2 h-9 min-w-[140px] text-sm font-medium bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-md shadow-sm hover:bg-zinc-100/50 hover:text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:bg-zinc-950/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/50 dark:hover:text-zinc-50 dark:focus:ring-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-zinc-500" />
              <span>
                {sortField === "id" && t("id")}
                {sortField === "name" && t("name")}
                {sortField === "ping" && t("ping")}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-md shadow-md z-50 p-1 dark:bg-zinc-950 dark:border-zinc-800 animate-in fade-in-80 zoom-in-95 slide-in-from-top-2 origin-top">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-2 py-1.5 mb-1 dark:text-zinc-400">
                Trier par
              </div>
              {(["id", "name", "ping"] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setSortField(field);
                    setShowSortDropdown(false);
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 ${sortField === field ? "font-medium" : ""}`}
                >
                  <span className="flex h-4 w-4 items-center justify-center mr-2">
                    {sortField === field && <Check className="h-4 w-4" />}
                  </span>
                  {t(
                    field === "id" ? "id" : field === "name" ? "name" : "ping",
                  )}
                </button>
              ))}
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 -mx-1" />
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-2 py-1.5 mb-1 dark:text-zinc-400">
                {t("order")}
              </div>
              <button
                onClick={() => {
                  setSortOrder("asc");
                  setShowSortDropdown(false);
                }}
                className={`relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 ${sortOrder === "asc" ? "font-medium" : ""}`}
              >
                <span className="flex items-center">
                  <span className="flex h-4 w-4 items-center justify-center mr-2">
                    {sortOrder === "asc" && <Check className="h-4 w-4" />}
                  </span>
                  {t("ascending")}
                </span>
                <ArrowUp className="w-4 h-4 text-zinc-500" />
              </button>
              <button
                onClick={() => {
                  setSortOrder("desc");
                  setShowSortDropdown(false);
                }}
                className={`relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 ${sortOrder === "desc" ? "font-medium" : ""}`}
              >
                <span className="flex items-center">
                  <span className="flex h-4 w-4 items-center justify-center mr-2">
                    {sortOrder === "desc" && <Check className="h-4 w-4" />}
                  </span>
                  {t("descending")}
                </span>
                <ArrowDown className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-lg bg-white border-zinc-300 text-gray-900 placeholder-gray-500 dark:bg-zinc-950 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 w-full ring-1 ring-transparent focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>
        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-600 rounded-lg overflow-hidden h-[42px]">
          {(
            [
              {
                mode: "startsWith" as SearchMode,
                label: t("searchStartsWith"),
              },
              { mode: "contains" as SearchMode, label: t("searchContains") },
              { mode: "endsWith" as SearchMode, label: t("searchEndsWith") },
              { mode: "id" as SearchMode, label: t("searchId") },
            ] as const
          ).map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setSearchMode(opt.mode)}
              className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap h-full ${
                searchMode === opt.mode
                  ? "bg-purple-600 text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerFilters;
