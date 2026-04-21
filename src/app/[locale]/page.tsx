"use client";

import { useState, useEffect, useCallback, useMemo, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { NotificationContainer } from "../../components/Notifications";
import { useNotifications } from "../../hooks/useNotifications";
import {
  cleanFiveMColors,
  extractDiscordLink,
  extractSocialLinks,
} from "../../utils";
import useSWR from "swr";
import {
  Users,
  Heart,
  BarChart3,
  Search,
  RefreshCw,
  Play,
  Star,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Server,
  Clock,
  Check,
  Command,
} from "lucide-react";
import Footer from "../../components/Footer";
import TopServ from "../../components/TopServ";
import Mobile from "../../components/Mobile";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const StatisticsCharts = dynamic(
  () =>
    import("../../components/StatisticsCharts").then((m) => m.StatisticsCharts),
  { ssr: false, loading: () => <StatisticsSkeleton /> },
);

interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

interface ServerInfo {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  currentPlayers: number;
  discordLink?: string;
  description?: string;
  iconUrl?: string;
}

interface TopServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  iconUrl?: string;
}

interface RawTopServer {
  EP?: string;
  Data?: {
    EndPoint?: string;
    Data?: {
      hostname?: string;
      clients?: number;
      sv_maxclients?: number;
      iconVersion?: number;
      vars?: {
        banner_detail?: string;
      };
    };
  };
}

type TabType = "players" | "favorites" | "statistics";

type SortField = "id" | "name" | "ping";
type SortOrder = "asc" | "desc";

interface ServerHistory {
  id: string;
  name: string;
  lastVisited: number;
}

function PlayersTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-950">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Ping
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Liens
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-6"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-12"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-32"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 bg-gray-200 dark:bg-zinc-950 rounded-full w-16"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-8"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-950 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServerInfoSkeleton() {
  return (
    <div className="mt-4 space-y-2 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-zinc-950 h-6 w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-48"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-64"></div>
      </div>
    </div>
  );
}

function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-950 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-zinc-950 rounded w-32"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-zinc-950 rounded"></div>
      </div>
      <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-950 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-zinc-950 rounded w-32"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-zinc-950 rounded"></div>
      </div>
    </div>
  );
}

function App() {
  const t = useTranslations("common");
  const locale = useLocale();

  const formatDate = useCallback(
    (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / (24 * 3600000));

      if (hours < 1) return t("now");
      if (hours < 24) return t("hoursAgo", { count: hours });
      if (days < 7) return t("daysAgo", { count: days });
      return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US");
    },
    [t, locale],
  );

  const loadFavoritesFromStorage = () => {
    if (typeof window === "undefined" || !window.localStorage) return [];
    try {
      const savedFavorites = window.localStorage.getItem("favorites");
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        return parsed;
      }
    } catch (error) {
      console.warn("Erreur lors du chargement des favoris:", error);
      try {
        window.localStorage.removeItem("favorites");
      } catch (e) { }
    }
    return [];
  };

  const [currentTab, setCurrentTab] = useState<TabType>("players");
  const [serverId, setServerId] = useState("");
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Player[]>(
    loadFavoritesFromStorage,
  );
  const [serverHistory, setServerHistory] = useState<ServerHistory[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [serversHistoryHoveredId, setServersHistoryHoveredId] = useState<
    string | null
  >(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<
    number | null
  >(null);
  const [displayedPlayersLimit, setDisplayedPlayersLimit] = useState(50);
  // const [topServers, setTopServers] = useState<TopServer[]>([]);
  // const [loadingTopServers, setLoadingTopServers] = useState(false);

  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const fetcher = useCallback(async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur lors de la récupération des données: ${res.status} ${res.statusText}`);
    return res.json();
  }, []);

  const fetchServerData = useCallback(
    async (overrideServerId?: string) => {
      const serverIdToUse = overrideServerId || serverId;
      if (!serverIdToUse.trim()) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/fivem/servers/single/${serverIdToUse}`,
        );
        if (!response.ok) throw new Error(t("serverNotFound"));

        const data = await response.json();
        const serverData = data.Data;

        setServerInfo({
          id: serverIdToUse,
          name: cleanFiveMColors(
            serverData?.hostname || `Serveur ${serverIdToUse}`,
          ),
          players: serverData?.players || [],
          maxPlayers: serverData?.sv_maxclients || 0,
          currentPlayers:
            serverData?.clients || serverData?.players?.length || 0,
          discordLink: extractDiscordLink(serverData?.vars),
          description: serverData?.vars?.Moddés
            ? cleanFiveMColors(serverData.vars.Moddés)
            : undefined,
          iconUrl: serverData?.iconVersion
            ? `https://servers-live.fivem.net/servers/icon/${serverIdToUse}/${serverData.iconVersion}.png`
            : serverData?.vars?.banner_detail ||
            `/api/fivem/servers/icon/${serverIdToUse}`,
        });

        setLastRefreshTimestamp(Date.now());

        setServerHistory((prev) => {
          const newHistory = prev.filter((s) => s.id !== serverIdToUse);
          const updatedHistory = [
            {
              id: serverIdToUse,
              name: cleanFiveMColors(
                serverData?.hostname || `Serveur ${serverIdToUse}`,
              ),
              lastVisited: Date.now(),
            },
            ...newHistory,
          ].slice(0, 10);
          localStorage.setItem("serverHistory", JSON.stringify(updatedHistory));
          return updatedHistory;
        });

        addNotification({
          type: "success",
          title: t("serverLoaded"),
          message: t("playersFound", {
            count: serverData?.clients || serverData?.players?.length || 0,
          }),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setServerInfo(null);
        addNotification({
          type: "error",
          title: t("error"),
          message: t("unableToLoadServerData"),
        });
      } finally {
        setLoading(false);
      }
    },
    [serverId, addNotification, t],
  );

  const {
    data: topServersRawData,
    isLoading: loadingTopServers,
    error: topServersError,
  } = useSWR(!serverId.trim() ? "/api/fivem/servers/top/fr" : null, fetcher);

  const topServers = useMemo(() => {
    if (!topServersRawData) return [];

    const data = topServersRawData;
    const serverData = data.Data?.Data;
    const topServer: TopServer = {
      id: data.EP || data.Data?.EndPoint || "",
      name: cleanFiveMColors(serverData?.hostname || `Serveur ${data.EP}`),
      currentPlayers: serverData?.clients || 0,
      maxPlayers: serverData?.sv_maxclients || 0,
      iconUrl: serverData?.iconVersion
        ? `https://servers-live.fivem.net/servers/icon/${data.EP}/${serverData.iconVersion}.png`
        : serverData?.vars?.banner_detail ||
        `/api/fivem/servers/icon/${data.EP}`,
    };

    return [
      topServer,
      {
        id: "4r3dp",
        name: "Los Santos Life",
        currentPlayers: 120,
        maxPlayers: 512,
        iconUrl: "/api/fivem/servers/icon/4r3dp",
      },
      {
        id: "9k8z2b",
        name: "FrenchRP",
        currentPlayers: 89,
        maxPlayers: 256,
        iconUrl: "/api/fivem/servers/icon/9k8z2b",
      },
      {
        id: "n5x7m",
        name: "Paris RP",
        currentPlayers: 67,
        maxPlayers: 128,
        iconUrl: "/api/fivem/servers/icon/n5x7m",
      },
    ];
  }, [topServersRawData]);

  const [hasNotifiedError, setHasNotifiedError] = useState(false);

  useEffect(() => {
    if (topServersError && !hasNotifiedError) {
      console.error("Erreur SWR top serveurs:", topServersError);
      addNotification({
        type: "error",
        title: t("error"),
        message: t("unableToLoadTopServers"),
      });
      setHasNotifiedError(true);
    } else if (!topServersError && hasNotifiedError) {
      setHasNotifiedError(false);
    }
  }, [topServersError, hasNotifiedError, addNotification, t]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serverParam = urlParams.get("server");
    const searchParam = urlParams.get("search");
    const tabParam = urlParams.get("tab");

    const savedServerId = window.localStorage.getItem("lastServerId");
    const savedHistory = window.localStorage.getItem("serverHistory");
    const savedAutoRefresh = window.localStorage.getItem("autoRefresh");

    const serverIdToLoad =
      serverParam ||
      (savedServerId && savedServerId.trim() ? savedServerId : null);

    if (serverIdToLoad) {
      setServerId(serverIdToLoad);
      fetchServerData(serverIdToLoad);
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }

    if (tabParam && ["players", "favorites", "statistics"].includes(tabParam)) {
      setCurrentTab(tabParam as TabType);
    }

    if (savedHistory) {
      try {
        setServerHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.warn("Erreur lors du chargement de l'historique:", error);
        localStorage.removeItem("serverHistory");
      }
    }

    if (savedAutoRefresh) {
      setAutoRefresh(savedAutoRefresh === "true");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem("lastServerId", serverId);
  }, [serverId]);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.warn("Erreur lors de la sauvegarde des favoris:", error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("autoRefresh", autoRefresh.toString());
    } catch (error) {
      console.warn("Erreur lors de la sauvegarde de l'auto-refresh:", error);
    }
  }, [autoRefresh]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showHistory && historyRef.current && !historyRef.current.contains(target)) {
        setShowHistory(false);
      }
      if (showSortDropdown && sortRef.current && !sortRef.current.contains(target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHistory, showSortDropdown]);
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setDisplayedPlayersLimit((prev) => {
        const newLimit = prev + 50;
        const filteredCount =
          serverInfo?.players?.filter(
            (player) =>
              player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              player.id.toString().includes(searchTerm) ||
              player.identifiers?.some((id) => id.includes(searchTerm)),
          ).length || 0;
        return Math.min(newLimit, filteredCount);
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    setDisplayedPlayersLimit(50);
  }, [serverId, searchTerm]);

  useEffect(() => {
    if (!autoRefresh || !serverId.trim() || loading) return;

    const interval = setInterval(() => {
      fetchServerData();
      addNotification({
        type: "info",
        title: t("autoRefreshTitle"),
        message: t("dataUpdated"),
      });
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [autoRefresh, serverId, loading, addNotification, fetchServerData, t]);

  const filteredPlayers = useMemo(() => {
    if (!serverInfo?.players) return [];

    const filtered = serverInfo.players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.id.toString().includes(searchTerm) ||
        player.identifiers?.some((id) => id.includes(searchTerm)),
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "ping":
          aValue = a.ping;
          bValue = b.ping;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered.slice(0, displayedPlayersLimit);
  }, [
    serverInfo?.players,
    searchTerm,
    sortField,
    sortOrder,
    displayedPlayersLimit,
  ]);

  const toggleFavorite = useCallback(
    (player: Player) => {
      const isCurrentlyFavorite = favorites.some((fav) => fav.id === player.id);

      if (isCurrentlyFavorite) {
        addNotification({
          type: "info",
          title: t("favoriteRemoved"),
          message: t.rich("removedFromFavorites", {
            name: player.name,
            strong: (chunks) => (
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {chunks}
              </strong>
            ),
          }),
        });
        setFavorites((prev) => prev.filter((fav) => fav.id !== player.id));
      } else {
        addNotification({
          type: "success",
          title: t("favoriteAdded"),
          message: t.rich("addedToFavorites", {
            name: player.name,
            strong: (chunks) => (
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {chunks}
              </strong>
            ),
          }),
        });
        setFavorites((prev) => [...prev, player]);
      }
    },
    [favorites, addNotification, t],
  );

  const isPlayerFavorite = (playerId: number) => {
    return favorites.some((fav) => fav.id === playerId);
  };

  return (
    <>
      <Mobile />
      <div className="hidden sm:block min-h-screen bg-zinc-50 text-gray-900 dark:bg-zinc-950 dark:text-white relative">
        {/* Header */}
        <header className="shadow-sm bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                  className="dark:text-white group-hover:text-purple-600 w-10 h-10 transition-colors"
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
                <h1 className="dark:text-white font-semibold text-lg group-hover:text-purple-600 transition-colors">
                  FiveM Viewer
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 items-center bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-[10px] focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-150 ease-in-out px-3 gap-2">
                    <div className="flex items-center gap-1.5">
                      {navigator.userAgent.includes("Mac") ? (
                        <kbd className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-500 flex items-center justify-center min-w-[20px]">
                          <Command className="w-3 h-3" />
                        </kbd>
                      ) : (
                        <kbd className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                          CTRL
                        </kbd>
                      )}
                      <span className="text-zinc-500 text-[10px] font-medium">+ R</span>
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
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">ID</span>
                  </div>
                  <button
                    onClick={() => fetchServerData()}
                    disabled={loading || !serverId.trim()}
                    aria-label={t("reloadServerData")}
                    title={t("reloadServerData")}
                    className="relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="flex items-center gap-2 px-6 py-2 bg-[#B931FC] text-white rounded-[10px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-medium whitespace-nowrap">
                      <Play className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                      {loading ? t("loading") : t("reload")}
                    </span>
                  </button>

                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] active:scale-95 ${autoRefresh
                      ? "bg-gradient-to-t from-[#1d4ed8] to-[#60a5fa]"
                      : "bg-gradient-to-t from-zinc-700 to-zinc-500"
                      }`}
                    title={
                      autoRefresh
                        ? t("disableAutoRefresh")
                        : t("enableAutoRefresh")
                    }
                  >
                    <span className={`flex items-center gap-2 px-6 py-2 text-white rounded-[10px] font-medium whitespace-nowrap min-w-[150px] ${autoRefresh
                      ? "bg-gradient-to-t from-[#2563eb] to-[#3b82f6]"
                      : "bg-gradient-to-t from-zinc-800 to-zinc-700"
                      }`}>
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

            {serverInfo && !loading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-semibold">{serverInfo.currentPlayers}</span>
                    {" "}
                    /
                    {" "}
                    <span>{serverInfo.maxPlayers}</span>
                    {" "}
                    {t("playersCount")}
                  </div>
                  <div className="flex items-center space-x-2">
                    {serverInfo.iconUrl && (
                      <img
                        src={serverInfo.iconUrl}
                        alt="Server icon"
                        className="w-6 h-6 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="text-sm opacity-75">{serverInfo.name}</div>
                  </div>
                </div>

                {(serverInfo.discordLink || serverInfo.description) && (
                  <div className="flex items-center space-x-4 text-sm">
                    {serverInfo.discordLink && (
                      <a
                        href={serverInfo.discordLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline flex items-center gap-1"
                      >
                        {/* only stupid svg in the project */}
                        <svg
                          viewBox="0 -28.5 256 256"
                          version="1.1"
                          preserveAspectRatio="xMidYMid"
                          fill="#000000"
                          className="w-4 h-4"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <path
                                d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                fill="CurrentColor"
                                fillRule="nonzero"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                        Discord
                      </a>
                    )}
                    {serverInfo.description && (
                      <span className="opacity-75">
                        {serverInfo.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {loading && <ServerInfoSkeleton />}
          </div>
        </header>

        {serverInfo && (
          <nav className="bg-white border-zinc-200 border-b dark:bg-zinc-950 dark:border-zinc-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                {[
                  {
                    id: "players",
                    label: t("players"),
                    count: filteredPlayers.length,
                    icon: Users,
                  },
                  {
                    id: "favorites",
                    label: t("favorites"),
                    count: favorites.length,
                    icon: Heart,
                  },
                  { id: "statistics", label: t("statistics"), icon: BarChart3 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${currentTab === tab.id
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
        )}

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
          {!serverInfo ? (
            <TopServ
              topServers={topServers}
              loading={loadingTopServers}
              onSelectServer={(serverId) => {
                setServerId(serverId);
                fetchServerData(serverId);
              }}
            />
          ) : (
            currentTab === "players" && (
              <div className="flex flex-col gap-4">
                {serverHistory.length > 0 && (
                  <div className="relative" ref={historyRef}>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className={`w-full group relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] active:scale-[0.98] ${showHistory
                        ? "bg-gradient-to-t from-[#8122b0] to-[#dc98fd]"
                        : "bg-gradient-to-t from-zinc-700 to-zinc-500"
                        }`}
                    >
                      <div className={`flex items-center gap-3 px-4 py-2 text-white rounded-[10px] font-medium transition-all ${showHistory
                        ? "bg-gradient-to-t from-[#a62ce2] to-[#c045fc]"
                        : "bg-gradient-to-t from-zinc-800 to-zinc-700"
                        }`}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg transition-colors ${showHistory ? "" : ""
                            }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-sm">
                              {t("recentServers")}
                            </div>
                            <div className={`text-xs transition-colors ${showHistory ? "text-purple-100" : "text-zinc-400"
                              }`}>
                              {serverHistory.length}{" "}
                              {t("server", { count: serverHistory.length })}
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${showHistory ? "rotate-180 text-white" : "text-zinc-400"
                            }`}
                        />
                      </div>
                    </button>

                    <div
                      className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top z-50 ${showHistory
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none"
                        }`}
                    >
                      <div className="max-h-96 overflow-y-auto">
                        {serverHistory.map((server, index) => (
                          <div
                            key={server.id}
                            onMouseEnter={() =>
                              setServersHistoryHoveredId(server.id)
                            }
                            onMouseLeave={() =>
                              setServersHistoryHoveredId(null)
                            }
                            className={`group relative transition-colors duration-150 ${index !== serverHistory.length - 1
                              ? "border-b border-zinc-100 dark:border-zinc-700"
                              : ""
                              } ${serversHistoryHoveredId === server.id
                                ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-zinc-700/50"
                                : "hover:bg-gradient-to-r hover:from-purple-25 hover:to-transparent dark:hover:from-zinc-700/30 dark:hover:to-transparent"
                              }`}
                          >
                            <button
                              onClick={() => {
                                setServerId(server.id);
                                fetchServerData(server.id);
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
                                    setServerHistory((prev) => {
                                      const updatedHistory = prev.filter(
                                        (s) => s.id !== server.id,
                                      );
                                      localStorage.setItem(
                                        "serverHistory",
                                        JSON.stringify(updatedHistory),
                                      );
                                      return updatedHistory;
                                    });
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
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t("playerList")}</h2>

                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSortDropdown(!showSortDropdown);
                      }}
                      className="flex items-center justify-between gap-2 px-3 py-2 h-9 min-w-[140px] text-sm font-medium bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-md shadow-sm hover:bg-zinc-100/50 hover:text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:bg-zinc-950/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/50 dark:hover:text-zinc-50 dark:focus:ring-zinc-900 transition-colors backdrop-blur-sm"
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
                        {[
                          { field: "id" as SortField, label: "ID" },
                          { field: "name" as SortField, label: "Nom" },
                          { field: "ping" as SortField, label: "Ping" },
                        ].map((option) => (
                          <button
                            key={option.field}
                            onClick={() => {
                              setSortField(option.field);
                              setShowSortDropdown(false);
                            }}
                            className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 ${sortField === option.field ? "font-medium" : ""}`}
                          >
                            <span className="flex h-4 w-4 items-center justify-center mr-2">
                              {sortField === option.field && <Check className="h-4 w-4" />}
                            </span>
                            {option.label}
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
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 border rounded-lg bg-white border-zinc-300 text-gray-900 placeholder-gray-500 dark:bg-zinc-950 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 w-full ring-1 ring-transparent focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                {loading ? (
                  <PlayersTableSkeleton />
                ) : (
                  <div
                    className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    onScroll={handleTableScroll}
                  >
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 relative">
                      <thead className="bg-zinc-50 dark:bg-zinc-950 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
                            {t("hash")}
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-900 transition-colors group"
                            onClick={() => handleSort("id")}
                          >
                            <div className="flex items-center gap-1 select-none">
                              {t("id")}
                              {sortField === "id" ? (
                                <span className="text-purple-600 dark:text-purple-400">
                                  {sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                </span>
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-900 transition-colors group"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center gap-1 select-none">
                              {t("name")}
                              {sortField === "name" ? (
                                <span className="text-purple-600 dark:text-purple-400">
                                  {sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                </span>
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-900 transition-colors group"
                            onClick={() => handleSort("ping")}
                          >
                            <div className="flex items-center gap-1 select-none">
                              {t("ping")}
                              {sortField === "ping" ? (
                                <span className="text-purple-600 dark:text-purple-400">
                                  {sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                </span>
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
                            {t("links")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
                        {filteredPlayers.map((player, index) => {
                          const socialLinks = extractSocialLinks(
                            player.identifiers || [],
                          );
                          return (
                            <tr
                              key={player.id}
                              className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                                {player.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {player.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${player.ping < 50
                                    ? "bg-green-100 text-green-800"
                                    : player.ping < 100
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                    }`}
                                >
                                  {player.ping}ms
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-1">
                                  {socialLinks.steam && (
                                    <a
                                      href={socialLinks.steam}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-600"
                                      title="Profil Steam"
                                    >
                                      💨
                                    </a>
                                  )}
                                  {socialLinks.discord && (
                                    <a
                                      href={socialLinks.discord}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-500 hover:text-indigo-600"
                                      title="Profil Discord"
                                    >
                                      💬
                                    </a>
                                  )}
                                  {!socialLinks.steam &&
                                    !socialLinks.discord && (
                                      <span className="text-gray-400">-</span>
                                    )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => toggleFavorite(player)}
                                  className={`p-1 rounded ${isPlayerFavorite(player.id)
                                    ? "text-yellow-500 hover:text-yellow-600"
                                    : "text-gray-400 hover:text-gray-500"
                                    }`}
                                  title={
                                    isPlayerFavorite(player.id)
                                      ? "Retirer des favoris"
                                      : "Ajouter aux favoris"
                                  }
                                >
                                  {isPlayerFavorite(player.id) ? (
                                    <Star className="h-5 w-5 fill-yellow-500" />
                                  ) : (
                                    <Star className="h-5 w-5" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {(() => {
                      const totalFilteredPlayers =
                        serverInfo?.players?.filter(
                          (player) =>
                            player.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            player.id.toString().includes(searchTerm) ||
                            player.identifiers?.some((id) =>
                              id.includes(searchTerm),
                            ),
                        ).length || 0;

                      return displayedPlayersLimit < totalFilteredPlayers ? (
                        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                          {t("displayingPlayers", {
                            displayed: displayedPlayersLimit,
                            total: totalFilteredPlayers,
                          })}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
                {filteredPlayers.length === 0 && searchTerm.trim() !== "" && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-700 m-0">
                    {t("noSearchResults")}
                    <br />
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 px-4 py-2 text-purple-600 rounded-lg hover:text-purple-700 hover:underline"
                    >
                      {t("clearSearch")}
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {currentTab === "favorites" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t("favoritePlayers")}
              </h2>
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {t("noFavoritePlayers")}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                    <thead className="bg-zinc-50 dark:bg-zinc-950">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
                      {favorites.map((player) => {
                        const isOnline = serverInfo?.players.some(
                          (p) => p.id === player.id,
                        );
                        return (
                          <tr
                            key={player.id}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-950"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                              {player.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {player.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isOnline
                                  ? "bg-green-100 text-green-800"
                                  : "bg-zinc-100 text-gray-800"
                                  }`}
                              >
                                {isOnline ? "En ligne" : "Hors ligne"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => toggleFavorite(player)}
                                className="text-yellow-500 hover:text-yellow-600 p-1"
                              >
                                <Star className="h-5 w-5 fill-yellow-500" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {currentTab === "statistics" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t("statisticsTitle")}
              </h2>
              {loading ? (
                <StatisticsSkeleton />
              ) : !serverInfo ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {t("loadServerForStats")}
                </div>
              ) : (
                <Suspense fallback={<StatisticsSkeleton />}>
                  <StatisticsCharts players={serverInfo.players} />
                </Suspense>
              )}
            </div>
          )}
          <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-950 px-3 py-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("lastRefresh")} :{" "}
              {lastRefreshTimestamp
                ? new Date(lastRefreshTimestamp).toLocaleString()
                : t("never")}
            </span>
          </div>
        </main>

        <Footer />

        {/* Notifications */}
        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
        />
      </div>
    </>
  );
}

export default App;
