"use client";

import { Globe, Loader2, Search, Users, Filter, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { cleanFiveMColors } from "../../utils/fivem";

interface GlobalSearchProps {
  onSelectServer: (id: string) => void;
}

interface SearchResult {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  tags: string[];
  locale: string;
  gametype?: string;
}

const GlobalSearch = ({ onSelectServer }: GlobalSearchProps) => {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [localeFilter, setLocaleFilter] = useState("all");

  const performSearch = useCallback(
    async (searchQuery: string) => {
      const cleanQuery = searchQuery.trim();
      if (!cleanQuery) {
        setResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If it looks like a Join Code (6 chars, alphanumeric)
        if (cleanQuery.length === 6 && /^[a-z0-9]+$/i.test(cleanQuery)) {
          const response = await fetch(
            `/api/fivem/servers/single/${cleanQuery.toLowerCase()}`,
          );
          if (response.ok) {
            const { Data: serverData } = await response.json();
            if (serverData) {
              setResults([
                {
                  id: cleanQuery.toLowerCase(),
                  name: cleanFiveMColors(
                    serverData.hostname || `Server ${cleanQuery}`,
                  ),
                  players: serverData.clients || 0,
                  maxPlayers: serverData.sv_maxclients || 0,
                  tags: serverData.vars?.tags?.split(",").slice(0, 5) || [],
                  locale: serverData.vars?.locale || "en-US",
                  gametype: serverData.gametype,
                },
              ]);
              setIsLoading(false);
              return;
            }
          }
        }

        // Use the new search API
        const searchUrl = `/api/fivem/search?q=${encodeURIComponent(cleanQuery)}${localeFilter !== "all" ? `&locale=${localeFilter}` : ""}`;
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        // setError(t("unableToLoadServerData"));
      } finally {
        setIsLoading(false);
      }
    },
    [localeFilter],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length >= 3) {
        performSearch(query);
      } else if (query.length === 0) {
        setResults([]);
        setError(null);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, performSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-purple-500 transition-colors" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("globalSearchPlaceholder")}
            className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all ${
            showFilters
              ? "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800"
              : "bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">{t("filters") || "Filters"}</span>
        </button>
      </div>

      {showFilters && (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              {t("locale") || "Locale"}
            </label>
            <select
              value={localeFilter}
              onChange={(e) => setLocaleFilter(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
            >
              <option value="all">All Locales</option>
              <option value="fr-FR">Français (FR)</option>
              <option value="en-US">English (US)</option>
              <option value="de-DE">Deutsch (DE)</option>
            </select>
          </div>
        </div>
      )}

      <div className="min-h-[100px]">
        {query.length > 0 && query.length < 3 && !isLoading && (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            {t("enterThreeChars") || "Enter at least 3 characters to search..."}
          </p>
        )}

        {error && (
          <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-dashed border-red-200 dark:border-red-800/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => onSelectServer(result.id)}
                className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-purple-500 cursor-pointer transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white truncate pr-2 group-hover:text-purple-600 transition-colors">
                    {result.name}
                  </h3>
                  <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {result.id}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-500" />
                    {result.players}/{result.maxPlayers}
                  </div>
                  <div className="flex items-center gap-1 uppercase">
                    <Globe className="w-3 h-3 text-purple-500" />
                    {result.locale.split("-")[1] || result.locale}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          query.length >= 3 &&
          !isLoading &&
          !error && (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              {t("noGlobalResults")}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
