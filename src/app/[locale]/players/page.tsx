"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/routing";
import { useServer } from "@/components/ServerContext";
import ServerHistoryComponent from "@/components/dashboard/ServerHistory";
import PlayerFilters from "@/components/dashboard/PlayerFilters";
import PlayersTable from "@/components/dashboard/PlayersTable";
import { formatDate } from "@/utils/format";
import { checkPlayerMatch } from "@/utils/search";
import { saveServerHistory } from "@/utils/storage";

export default function PlayersPage() {
  const router = useRouter();
  const t = useTranslations("common");
  const locale = useLocale();

  const {
    serverInfo,
    loading,
    serverId,
    setServerId,
    fetchServerData,
    serverHistory,
    setServerHistory,
    searchTerm,
    setSearchTerm,
    searchMode,
    setSearchMode,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredPlayers,
    handleSort,
    toggleFavorite,
    favorites,
    displayedPlayersLimit,
    handleTableScroll,
  } = useServer();

  useEffect(() => {
    if (!serverInfo) {
      router.push("/");
    }
  }, [serverInfo, router]);

  if (!serverInfo) return null;

  return (
    <div className="flex flex-col gap-6">
      <ServerHistoryComponent
        serverHistory={serverHistory}
        onSelectServer={(id) => {
          setServerId(id);
          fetchServerData(id);
        }}
        onRemoveFromHistory={(id) => {
          const updated = serverHistory.filter((s) => s.id !== id);
          setServerHistory(updated);
          saveServerHistory(updated);
        }}
        formatDate={(date) => formatDate(date, t, locale)}
      />
      <PlayerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <PlayersTable
        players={filteredPlayers}
        loading={loading}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        toggleFavorite={toggleFavorite}
        isPlayerFavorite={(name) =>
          favorites.some((f) => f.name.toLowerCase() === name.toLowerCase())
        }
        displayedPlayersLimit={displayedPlayersLimit}
        totalFilteredPlayers={
          serverInfo.players.filter((p) =>
            checkPlayerMatch(p, searchTerm, searchMode),
          ).length
        }
        handleTableScroll={handleTableScroll}
      />
    </div>
  );
}
