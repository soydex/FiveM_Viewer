"use client";

import { Star, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { extractSocialLinks } from "../../utils/fivem";

interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

interface PlayersTableProps {
  players: Player[];
  loading: boolean;
  sortField: string;
  sortOrder: "asc" | "desc";
  handleSort: (field: any) => void;
  toggleFavorite: (player: Player) => void;
  isPlayerFavorite: (name: string) => boolean;
  displayedPlayersLimit: number;
  totalFilteredPlayers: number;
  handleTableScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function PlayersTableSkeleton() {
  const t = useTranslations("common");
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-950">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t("id")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t("name")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t("ping")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t("links")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-6"></div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-12"></div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32"></div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-16"></div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16"></div></td>
              <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-8"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PlayersTable = ({
  players,
  loading,
  sortField,
  sortOrder,
  handleSort,
  toggleFavorite,
  isPlayerFavorite,
  displayedPlayersLimit,
  totalFilteredPlayers,
  handleTableScroll,
}: PlayersTableProps) => {
  const t = useTranslations("common");

  if (loading) return <PlayersTableSkeleton />;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortOrder === "asc" ? <ArrowUp className="w-3 h-3 text-purple-600 dark:text-purple-400" /> : <ArrowDown className="w-3 h-3 text-purple-600 dark:text-purple-400" />;
  };

  return (
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
            {(["id", "name", "ping"] as const).map((field) => (
              <th
                key={field}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-900 transition-colors group"
                onClick={() => handleSort(field)}
              >
                <div className="flex items-center gap-1 select-none">
                  {t(field)}
                  <SortIcon field={field} />
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
              {t("links")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
          {players.map((player, index) => {
            const socialLinks = extractSocialLinks(player.identifiers || []);
            return (
              <tr key={player.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{player.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{player.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      player.ping < 50
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
                  <div className="flex space-x-2">
                    {socialLinks.steam && (
                      <a href={socialLinks.steam} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Profil Steam">💨</a>
                    )}
                    {socialLinks.discord && (
                      <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Profil Discord">💬</a>
                    )}
                    {!socialLinks.steam && !socialLinks.discord && <span className="text-gray-400">-</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => toggleFavorite(player)}
                    className={`p-1 rounded transition-colors ${
                      isPlayerFavorite(player.name)
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    <Star className={`h-5 w-5 ${isPlayerFavorite(player.name) ? "fill-yellow-500" : ""}`} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {displayedPlayersLimit < totalFilteredPlayers && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-zinc-100 dark:border-zinc-800">
          {t("displayingPlayers", {
            displayed: displayedPlayersLimit,
            total: totalFilteredPlayers,
          })}
        </div>
      )}
    </div>
  );
};

export default PlayersTable;
