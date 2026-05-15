"use client";

import { Globe, Loader2, Search, Users } from "lucide-react";
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
}

const GlobalSearch = ({ onSelectServer }: GlobalSearchProps) => {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (id: string) => {
    const cleanId = id.trim().toLowerCase();
    if (cleanId.length !== 6) {
      setResult(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fivem/servers/single/${cleanId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(t("serverNotFound"));
        } else {
          throw new Error("Failed to fetch");
        }
        setResult(null);
        return;
      }

      const { Data: serverData } = await response.json();
      if (!serverData) {
        setError(t("serverNotFound"));
        setResult(null);
        return;
      }

      setResult({
        id: cleanId,
        name: cleanFiveMColors(serverData.hostname || `Server ${cleanId}`),
        players: serverData.clients || 0,
        maxPlayers: serverData.sv_maxclients || 0,
        tags: serverData.vars?.tags?.split(",").slice(0, 5) || [],
        locale: serverData.vars?.locale || "en-US",
      });
    } catch (err) {
      console.error("Search error:", err);
      setError(t("unableToLoadServerData"));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length === 6) {
        performSearch(query);
      } else {
        setResult(null);
        setError(null);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, performSearch]);

  return (
    <div className="space-y-6">
      <div className="relative group">
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
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          placeholder={t("globalSearchPlaceholder")}
          maxLength={6}
          className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm font-mono"
        />
      </div>

      <div className="min-h-[100px]">
        {query.length > 0 && query.length < 6 && !isLoading && (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8 animate-pulse">
            {t("enterSixChars")}
          </p>
        )}

        {error && (
          <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-dashed border-red-200 dark:border-red-800/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
              onClick={() => onSelectServer(result.id)}
              className="p-4 bg-white dark:bg-zinc-900 border-2 border-purple-500/20 dark:border-purple-500/20 rounded-xl hover:border-purple-500 cursor-pointer transition-all group shadow-lg shadow-purple-500/5"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-zinc-900 dark:text-white truncate pr-2 group-hover:text-purple-600 transition-colors">
                  {result.name}
                </h3>
                <span className="text-[10px] font-mono bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
