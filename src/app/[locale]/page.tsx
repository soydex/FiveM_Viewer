"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { NotificationContainer } from "../../components/Notifications";
import { useNotifications } from "../../hooks/useNotifications";
import { cleanFiveMColors, extractDiscordLink } from "../../utils/fivem";
import { 
  loadFavorites, saveFavorites, 
  loadServerHistory, saveServerHistory,
  loadLastServerId, saveLastServerId,
  loadAutoRefresh, saveAutoRefresh,
  FavoritePlayer, ServerHistoryItem
} from "../../utils/storage";
import { checkPlayerMatch, SearchMode } from "../../utils/search";
import { formatDate } from "../../utils/format";
import useSWR from "swr";
import Footer from "../../components/Footer";
import TopServ from "../../components/TopServ";
import Mobile from "../../components/Mobile";
import Header from "../../components/dashboard/Header";
import ServerBanner from "../../components/dashboard/ServerBanner";
import Tabs from "../../components/dashboard/Tabs";
import ServerHistoryComponent from "../../components/dashboard/ServerHistory";
import PlayerFilters from "../../components/dashboard/PlayerFilters";
import PlayersTable from "../../components/dashboard/PlayersTable";
import FavoritesManager from "../../components/dashboard/FavoritesManager";
import Statistics from "../../components/dashboard/Statistics";
import RefreshBadge from "../../components/dashboard/RefreshBadge";

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
}

interface TopServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
}

type TabType = "players" | "favorites" | "statistics";
type SortField = "id" | "name" | "ping";
type SortOrder = "asc" | "desc";

function App() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // --- State ---
  const [currentTab, setCurrentTab] = useState<TabType>("players");
  const [serverId, setServerId] = useState("");
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("contains");
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
  const [addFavoriteName, setAddFavoriteName] = useState("");
  const [serverHistory, setServerHistory] = useState<ServerHistoryItem[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<number | null>(null);
  const [displayedPlayersLimit, setDisplayedPlayersLimit] = useState(50);
  const [isMac, setIsMac] = useState(false);
  const [topServers, setTopServers] = useState<TopServer[]>([]);

  const fetcher = useCallback(async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    return res.json();
  }, []);

  // --- Data Fetching ---
  const fetchServerData = useCallback(async (overrideServerId?: string) => {
    const idToUse = (overrideServerId || serverId).trim();
    if (!idToUse) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/fivem/servers/single/${idToUse}`);
      
      if (response.status === 404) {
        setServerInfo(null);
        setServerId("");
        setAutoRefresh(false);
        addNotification({
          type: "error",
          title: t("error"),
          message: t("serverNotFound"),
        });
        return;
      }

      if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

      const data = await response.json();
      const serverData = data.Data;

      setServerInfo({
        id: idToUse,
        name: cleanFiveMColors(serverData?.hostname || `Serveur ${idToUse}`),
        players: serverData?.players || [],
        maxPlayers: serverData?.sv_maxclients || 0,
        currentPlayers: serverData?.clients || serverData?.players?.length || 0,
        discordLink: extractDiscordLink(serverData?.vars),
        description: serverData?.vars?.Moddés ? cleanFiveMColors(serverData.vars.Moddés) : undefined,
      });

      setLastRefreshTimestamp(Date.now());

      setServerHistory((prev) => {
        const filtered = prev.filter((s) => s.id !== idToUse);
        const updated = [{
          id: idToUse,
          name: cleanFiveMColors(serverData?.hostname || `Serveur ${idToUse}`),
          lastVisited: Date.now(),
        }, ...filtered].slice(0, 10);
        saveServerHistory(updated);
        return updated;
      });

      addNotification({
        type: "success",
        title: t("serverLoaded"),
        message: t("playersFound", { count: serverData?.clients || serverData?.players?.length || 0 }),
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setServerInfo(null);
      addNotification({ type: "error", title: t("error"), message: t("unableToLoadServerData") });
    } finally {
      setLoading(false);
    }
  }, [serverId, addNotification, t]);

  const { data: pinnedData, error: pinnedError } = useSWR(!serverId.trim() ? "https://runtime.fivem.net/pins.json" : null, fetcher);
  const loadingTopServers = !pinnedData && !pinnedError && !serverId.trim();

  useEffect(() => {
    if (!pinnedData?.pinnedServers) return;
    const fetchPinnedDetails = async () => {
      const ids = pinnedData.pinnedServers.slice(0, 12);
      const promises = ids.map(async (id: string) => {
        try {
          const res = await fetch(`/api/fivem/servers/single/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id,
            name: cleanFiveMColors(data.Data?.hostname || `Serveur ${id}`),
            currentPlayers: data.Data?.clients || 0,
            maxPlayers: data.Data?.sv_maxclients || 0,
          };
        } catch { return null; }
      });
      const results = await Promise.all(promises);
      setTopServers(results.filter((s): s is TopServer => s !== null));
    };
    fetchPinnedDetails();
  }, [pinnedData]);

  // --- Effects ---
  useEffect(() => {
    if (typeof navigator !== "undefined") setIsMac(navigator.userAgent.includes("Mac"));
    
    // Initial Load from Storage
    const savedId = loadLastServerId();
    const savedHistory = loadServerHistory();
    const savedAuto = loadAutoRefresh();
    const savedFavs = loadFavorites();

    if (savedId) { 
      setServerId(savedId); 
      fetchServerData(savedId); 
    }
    if (savedHistory.length > 0) setServerHistory(savedHistory);
    setAutoRefresh(savedAuto);
    if (savedFavs.length > 0) setFavorites(savedFavs);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { saveLastServerId(serverId); }, [serverId]);
  useEffect(() => { saveFavorites(favorites); }, [favorites]);
  useEffect(() => { saveAutoRefresh(autoRefresh); }, [autoRefresh]);

  useEffect(() => {
    if (!autoRefresh || !serverId.trim() || loading) return;
    const interval = setInterval(() => {
      fetchServerData();
      addNotification({ type: "info", title: t("autoRefreshTitle"), message: t("dataUpdated") });
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, serverId, loading, addNotification, fetchServerData, t]);

  // --- Handlers ---
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setDisplayedPlayersLimit(prev => prev + 50);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const toggleFavorite = (player: Player) => {
    const isFav = favorites.some(f => f.name.toLowerCase() === player.name.toLowerCase());
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.name.toLowerCase() !== player.name.toLowerCase()));
      addNotification({ type: "info", title: t("favoriteRemoved"), message: t("favoriteRemoved") });
    } else {
      setFavorites(prev => [...prev, { name: player.name, lastKnownId: player.id }]);
      addNotification({ type: "success", title: t("favoriteAdded"), message: t("favoriteAdded") });
    }
  };

  const addFavoriteManually = () => {
    const name = addFavoriteName.trim();
    if (!name) return;
    if (favorites.some(f => f.name.toLowerCase() === name.toLowerCase())) return;
    setFavorites(prev => [...prev, { name, lastKnownId: 0 }]);
    setAddFavoriteName("");
    addNotification({ type: "success", title: t("favoriteAdded"), message: t("favoriteAdded") });
  };

  const filteredPlayers = useMemo(() => {
    if (!serverInfo?.players) return [];
    const filtered = serverInfo.players.filter(p => checkPlayerMatch(p.name, searchTerm, searchMode));
    filtered.sort((a, b) => {
      let av = sortField === "id" ? a.id : sortField === "name" ? a.name.toLowerCase() : a.ping;
      let bv = sortField === "id" ? b.id : sortField === "name" ? b.name.toLowerCase() : b.ping;
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered.slice(0, displayedPlayersLimit);
  }, [serverInfo?.players, searchTerm, searchMode, sortField, sortOrder, displayedPlayersLimit]);

  return (
    <>
      <Mobile />
      <div className="hidden sm:block min-h-screen bg-zinc-50 text-gray-900 dark:bg-zinc-950 dark:text-white relative">
        <Header
          serverId={serverId}
          setServerId={setServerId}
          fetchServerData={fetchServerData}
          loading={loading}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          isMac={isMac}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServerBanner serverInfo={serverInfo} loading={loading} />
        </div>

        {serverInfo && (
          <Tabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            playersCount={serverInfo.players.length}
            favoritesCount={favorites.length}
          />
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
          {!serverInfo ? (
            <TopServ
              topServers={topServers}
              loading={loadingTopServers}
              onSelectServer={(id) => { setServerId(id); fetchServerData(id); }}
            />
          ) : (
            <>
              {currentTab === "players" && (
                <div className="flex flex-col gap-6">
                  <ServerHistoryComponent
                    serverHistory={serverHistory}
                    onSelectServer={(id) => { setServerId(id); fetchServerData(id); }}
                    onRemoveFromHistory={(id) => {
                      const updated = serverHistory.filter(s => s.id !== id);
                      setServerHistory(updated);
                      saveServerHistory(updated);
                    }}
                    formatDate={(date) => formatDate(date, t, locale)}
                  />
                  <PlayerFilters
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                    searchMode={searchMode} setSearchMode={setSearchMode}
                    sortField={sortField} setSortField={setSortField}
                    sortOrder={sortOrder} setSortOrder={setSortOrder}
                  />
                  <PlayersTable
                    players={filteredPlayers}
                    loading={loading}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    toggleFavorite={toggleFavorite}
                    isPlayerFavorite={(name) => favorites.some(f => f.name.toLowerCase() === name.toLowerCase())}
                    displayedPlayersLimit={displayedPlayersLimit}
                    totalFilteredPlayers={serverInfo.players.filter(p => checkPlayerMatch(p.name, searchTerm, searchMode)).length}
                    handleTableScroll={handleTableScroll}
                  />
                </div>
              )}
              {currentTab === "favorites" && (
                <FavoritesManager
                  favorites={favorites} setFavorites={setFavorites}
                  addFavoriteName={addFavoriteName} setAddFavoriteName={setAddFavoriteName}
                  addFavoriteManually={addFavoriteManually}
                  serverPlayers={serverInfo.players}
                />
              )}
              {currentTab === "statistics" && <Statistics serverInfo={serverInfo} loading={loading} />}
            </>
          )}
          <RefreshBadge lastRefreshTimestamp={lastRefreshTimestamp} />
        </main>
        <Footer />
        <NotificationContainer notifications={notifications} onClose={removeNotification} />
      </div>
    </>
  );
}

export default App;
