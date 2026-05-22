"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import useSWR from "swr";
import { useNotifications } from "@/hooks/useNotifications";
import { cleanFiveMColors, extractDiscordLink } from "@/utils/fivem";
import { checkPlayerMatch, type SearchMode } from "@/utils/search";
import {
  type FavoritePlayer,
  loadAutoRefresh,
  loadFavorites,
  loadLastServerId,
  loadServerHistory,
  type ServerHistoryItem,
  saveAutoRefresh,
  saveFavorites,
  saveLastServerId,
  saveServerHistory,
} from "@/utils/storage";

export interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

export interface ServerInfo {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  currentPlayers: number;
  discordLink?: string;
  description?: string;
  isDirect?: boolean;
}

export interface TopServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
}

export type SortField = "id" | "name" | "ping";
export type SortOrder = "asc" | "desc";

interface ServerContextType {
  serverId: string;
  setServerId: (id: string) => void;
  serverInfo: ServerInfo | null;
  setServerInfo: (info: ServerInfo | null) => void;
  loading: boolean;
  initialized: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  favorites: FavoritePlayer[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoritePlayer[]>>;
  addFavoriteName: string;
  setAddFavoriteName: (name: string) => void;
  serverHistory: ServerHistoryItem[];
  setServerHistory: React.Dispatch<React.SetStateAction<ServerHistoryItem[]>>;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  lastRefreshTimestamp: number | null;
  displayedPlayersLimit: number;
  setDisplayedPlayersLimit: React.Dispatch<React.SetStateAction<number>>;
  isMac: boolean;
  topServers: TopServer[];
  loadingTopServers: boolean;
  fetchServerData: (overrideServerId?: string) => Promise<void>;
  handleTableScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleSort: (field: SortField) => void;
  toggleFavorite: (player: Player) => void;
  addFavoriteManually: () => void;
  filteredPlayers: Player[];
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  // --- State ---
  const [serverId, setServerId] = useState("");
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("contains");
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
  const [addFavoriteName, setAddFavoriteName] = useState("");
  const [serverHistory, setServerHistory] = useState<ServerHistoryItem[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<
    number | null
  >(null);
  const [displayedPlayersLimit, setDisplayedPlayersLimit] = useState(50);
  const [isMac, setIsMac] = useState(false);
  const [topServers, setTopServers] = useState<TopServer[]>([]);

  const fetcher = useCallback(async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    return res.json();
  }, []);

  // --- Data Fetching ---
  const fetchServerData = useCallback(
    async (overrideServerId?: string) => {
      const idToUse = (overrideServerId || serverId).trim();
      if (!idToUse) return;

      setLoading(true);
      try {
        const isDirect = idToUse.includes(":") || idToUse.includes(".");
        let serverData: any;
        let playersData: any[] = [];

        if (isDirect) {
          // Direct IP:Port query
          const [infoRes, playersRes] = await Promise.all([
            fetch(`/api/fivem/direct?endpoint=${idToUse}&type=info`),
            fetch(`/api/fivem/direct?endpoint=${idToUse}&type=players`),
          ]);

          if (!infoRes.ok)
            throw new Error(`Info fetch error: ${infoRes.status}`);

          const info = await infoRes.json();
          serverData = {
            hostname:
              info.vars?.sv_hostname || info.hostname || `Server ${idToUse}`,
            clients: info.vars?.sv_maxclients || 0,
            sv_maxclients: info.vars?.sv_maxclients || 32,
            vars: info.vars,
          };

          if (playersRes.ok) {
            playersData = await playersRes.json();
          }
        } else {
          // Standard cfx.re join code
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
          serverData = data.Data;
          playersData = serverData?.players || [];
        }

        setServerInfo({
          id: idToUse,
          name: cleanFiveMColors(serverData?.hostname || `Serveur ${idToUse}`),
          players: playersData,
          maxPlayers: serverData?.sv_maxclients || 0,
          currentPlayers: serverData?.clients || playersData.length || 0,
          discordLink: extractDiscordLink(serverData?.vars),
          description: serverData?.vars?.Moddés
            ? cleanFiveMColors(serverData.vars.Moddés)
            : undefined,
          isDirect,
        });

        setLastRefreshTimestamp(Date.now());

        setServerHistory((prev) => {
          const filtered = prev.filter((s) => s.id !== idToUse);
          const updated = [
            {
              id: idToUse,
              name: cleanFiveMColors(
                serverData?.hostname || `Serveur ${idToUse}`,
              ),
              lastVisited: Date.now(),
            },
            ...filtered,
          ].slice(0, 10);
          saveServerHistory(updated);
          return updated;
        });

        addNotification({
          type: "success",
          title: t("serverLoaded"),
          message: t("playersFound", {
            count: serverData?.clients || playersData.length || 0,
          }),
        });
      } catch (error) {
        console.error("Fetch error:", error);
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

  const { data: pinnedData, error: pinnedError } = useSWR(
    !serverId.trim() ? "https://runtime.fivem.net/pins.json" : null,
    fetcher,
  );
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
        } catch {
          return null;
        }
      });
      const results = await Promise.all(promises);
      setTopServers(results.filter((s): s is TopServer => s !== null));
    };
    fetchPinnedDetails();
  }, [pinnedData]);

  // --- Effects ---
  useEffect(() => {
    if (typeof navigator !== "undefined")
      setIsMac(navigator.userAgent.includes("Mac"));

    // Initial Load from Storage
    const savedId = loadLastServerId();
    const savedHistory = loadServerHistory();
    const savedAuto = loadAutoRefresh();
    const savedFavs = loadFavorites();

    if (savedId) {
      setServerId(savedId);
      fetchServerData(savedId).finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
    if (savedHistory.length > 0) setServerHistory(savedHistory);
    setAutoRefresh(savedAuto);
    if (savedFavs.length > 0) setFavorites(savedFavs);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    saveLastServerId(serverId);
  }, [serverId]);
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);
  useEffect(() => {
    saveAutoRefresh(autoRefresh);
  }, [autoRefresh]);

  useEffect(() => {
    if (!autoRefresh || !serverId.trim() || loading) return;
    const interval = setInterval(() => {
      fetchServerData();
      addNotification({
        type: "info",
        title: t("autoRefreshTitle"),
        message: t("dataUpdated"),
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, serverId, loading, addNotification, fetchServerData, t]);

  // --- Handlers ---
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setDisplayedPlayersLimit((prev) => prev + 50);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field)
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleFavorite = (player: Player) => {
    const isFav = favorites.some(
      (f) => f.name.toLowerCase() === player.name.toLowerCase(),
    );
    if (isFav) {
      setFavorites((prev) =>
        prev.filter((f) => f.name.toLowerCase() !== player.name.toLowerCase()),
      );
      addNotification({
        type: "info",
        title: t("favoriteRemoved"),
        message: t("favoriteRemoved"),
      });
    } else {
      setFavorites((prev) => [
        ...prev,
        { name: player.name, lastKnownId: player.id },
      ]);
      addNotification({
        type: "success",
        title: t("favoriteAdded"),
        message: t("favoriteAdded"),
      });
    }
  };

  const addFavoriteManually = () => {
    const name = addFavoriteName.trim();
    if (!name) return;
    if (favorites.some((f) => f.name.toLowerCase() === name.toLowerCase()))
      return;
    setFavorites((prev) => [...prev, { name, lastKnownId: 0 }]);
    setAddFavoriteName("");
    addNotification({
      type: "success",
      title: t("favoriteAdded"),
      message: t("favoriteAdded"),
    });
  };

  const filteredPlayers = useMemo(() => {
    if (!serverInfo?.players) return [];
    const filtered = serverInfo.players.filter((p) =>
      checkPlayerMatch(p, searchTerm, searchMode),
    );
    filtered.sort((a, b) => {
      const av =
        sortField === "id"
          ? a.id
          : sortField === "name"
            ? a.name.toLowerCase()
            : a.ping;
      const bv =
        sortField === "id"
          ? b.id
          : sortField === "name"
            ? b.name.toLowerCase()
            : b.ping;
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered.slice(0, displayedPlayersLimit);
  }, [
    serverInfo?.players,
    searchTerm,
    searchMode,
    sortField,
    sortOrder,
    displayedPlayersLimit,
  ]);

  const value = useMemo(
    () => ({
      serverId,
      setServerId,
      serverInfo,
      setServerInfo,
      loading,
      initialized,
      searchTerm,
      setSearchTerm,
      searchMode,
      setSearchMode,
      favorites,
      setFavorites,
      addFavoriteName,
      setAddFavoriteName,
      serverHistory,
      setServerHistory,
      autoRefresh,
      setAutoRefresh,
      sortField,
      setSortField,
      sortOrder,
      setSortOrder,
      lastRefreshTimestamp,
      displayedPlayersLimit,
      setDisplayedPlayersLimit,
      isMac,
      topServers,
      loadingTopServers,
      fetchServerData,
      handleTableScroll,
      handleSort,
      toggleFavorite,
      addFavoriteManually,
      filteredPlayers,
      notifications,
      addNotification,
      removeNotification,
    }),
    [
      serverId,
      serverInfo,
      loading,
      initialized,
      searchTerm,
      searchMode,
      favorites,
      addFavoriteName,
      serverHistory,
      autoRefresh,
      sortField,
      sortOrder,
      lastRefreshTimestamp,
      displayedPlayersLimit,
      isMac,
      topServers,
      loadingTopServers,
      fetchServerData,
      toggleFavorite,
      filteredPlayers,
      notifications,
      addNotification,
      removeNotification,
    ],
  );

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
}

export function useServer() {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
}
