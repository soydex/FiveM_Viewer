"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Star,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Loader2,
  Activity,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { extractSocialLinks } from "../../utils/fivem";

interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

interface PolicyResult {
  status: "clean" | "banned" | "error";
  id: string;
  data?: any;
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
            <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              #
            </th>
            <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("id")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("ping")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("links")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-6"></div>
              </td>
              <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-12"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-16"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-8"></div>
              </td>
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
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [policyResults, setPolicyResults] = useState<
    Record<string, PolicyResult>
  >({});
  const [policyLoading, setPolicyLoading] = useState<Record<string, boolean>>(
    {},
  );

  if (loading) return <PlayersTableSkeleton />;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      );
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
    );
  };

  const handleRowClick = async (player: Player) => {
    if (expandedPlayerId === player.id) {
      setExpandedPlayerId(null);
      return;
    }

    setExpandedPlayerId(player.id);
    setStatsLoading(true);
    setPlayerStats(null);

    try {
      // On envoie tous les identifiants pour maximiser les chances de match pour le playtime
      const identifiers = player.identifiers || [];
      const queryParams = identifiers
        .map((id) => `identifiers[]=${encodeURIComponent(id)}`)
        .join("&");
      const url = `/api/fivem/player-stats?${queryParams}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPlayerStats(data);
      }
    } catch (error) {
      console.error("Error fetching player stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const checkPolicy = async (id: string) => {
    if (policyLoading[id] || policyResults[id]) return;

    setPolicyLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/fivem/policy?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setPolicyResults((prev) => ({
          ...prev,
          [id]: {
            status: data.status === "clean" ? "clean" : "banned",
            id,
            data,
          },
        }));
      } else {
        setPolicyResults((prev) => ({
          ...prev,
          [id]: { status: "error", id },
        }));
      }
    } catch (error) {
      setPolicyResults((prev) => ({ ...prev, [id]: { status: "error", id } }));
    } finally {
      setPolicyLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div
      className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
      onScroll={handleTableScroll}
    >
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 relative">
        <thead className="bg-zinc-50 dark:bg-zinc-950 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
              {t("hash")}
            </th>
            <th
              className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-md bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-900 transition-colors group"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center gap-1 select-none">
                {t("id")}
                <SortIcon field="id" />
              </div>
            </th>
            {(["name", "ping"] as const).map((field) => (
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
            const isExpanded = expandedPlayerId === player.id;

            return (
              <React.Fragment key={player.id}>
                <tr
                  className={`hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors ${isExpanded ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  onClick={() => handleRowClick(player)}
                >
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    {index + 1}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {player.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {player.name}
                  </td>
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
                        <a
                          href={socialLinks.steam}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title="Profil Steam"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {" "}
                          <svg
                            fill="currentColor"
                            viewBox="0 0 32 32"
                            className="w-6 h-6 hover:text-purple-600 transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <title>{"steam"}</title>
                              <path d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z" />
                            </g>
                          </svg>
                        </a>
                      )}
                      {socialLinks.discord && (
                        <a
                          href={socialLinks.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title="Profil Discord"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 32 32"
                            className="w-6 h-6 hover:text-purple-600 transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <title>{"discord"}</title>
                              <path d="M20.992 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.050 0.005 0.109 0.005 0.168 0 1.523-1.191 2.768-2.693 2.854l-0.008 0zM11.026 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.048 0.005 0.104 0.005 0.161 0 1.525-1.19 2.771-2.692 2.862l-0.008 0zM26.393 6.465c-1.763-0.832-3.811-1.49-5.955-1.871l-0.149-0.022c-0.005-0.001-0.011-0.002-0.017-0.002-0.035 0-0.065 0.019-0.081 0.047l-0 0c-0.234 0.411-0.488 0.924-0.717 1.45l-0.043 0.111c-1.030-0.165-2.218-0.259-3.428-0.259s-2.398 0.094-3.557 0.275l0.129-0.017c-0.27-0.63-0.528-1.142-0.813-1.638l0.041 0.077c-0.017-0.029-0.048-0.047-0.083-0.047-0.005 0-0.011 0-0.016 0.001l0.001-0c-2.293 0.403-4.342 1.060-6.256 1.957l0.151-0.064c-0.017 0.007-0.031 0.019-0.040 0.034l-0 0c-2.854 4.041-4.562 9.069-4.562 14.496 0 0.907 0.048 1.802 0.141 2.684l-0.009-0.11c0.003 0.029 0.018 0.053 0.039 0.070l0 0c2.14 1.601 4.628 2.891 7.313 3.738l0.176 0.048c0.008 0.003 0.018 0.004 0.028 0.004 0.032 0 0.060-0.015 0.077-0.038l0-0c0.535-0.72 1.044-1.536 1.485-2.392l0.047-0.1c0.006-0.012 0.010-0.027 0.010-0.043 0-0.041-0.026-0.075-0.062-0.089l-0.001-0c-0.912-0.352-1.683-0.727-2.417-1.157l0.077 0.042c-0.029-0.017-0.048-0.048-0.048-0.083 0-0.031 0.015-0.059 0.038-0.076l0-0c0.157-0.118 0.315-0.24 0.465-0.364 0.016-0.013 0.037-0.021 0.059-0.021 0.014 0 0.027 0.003 0.038 0.008l-0.001-0c2.208 1.061 4.8 1.681 7.536 1.681s5.329-0.62 7.643-1.727l-0.107 0.046c0.012-0.006 0.025-0.009 0.040-0.009 0.022 0 0.043 0.008 0.059 0.021l-0-0c0.15 0.124 0.307 0.248 0.466 0.365 0.023 0.018 0.038 0.046 0.038 0.077 0 0.035-0.019 0.065-0.046 0.082l-0 0c-0.661 0.395-1.432 0.769-2.235 1.078l-0.105 0.036c-0.036 0.014-0.062 0.049-0.062 0.089 0 0.016 0.004 0.031 0.011 0.044l-0-0.001c0.501 0.96 1.009 1.775 1.571 2.548l-0.040-0.057c0.017 0.024 0.046 0.040 0.077 0.040 0.010 0 0.020-0.002 0.029-0.004l-0.001 0c2.865-0.892 5.358-2.182 7.566-3.832l-0.065 0.047c0.022-0.016 0.036-0.041 0.039-0.069l0-0c0.087-0.784 0.136-1.694 0.136-2.615 0-5.415-1.712-10.43-4.623-14.534l0.052 0.078c-0.008-0.016-0.022-0.029-0.038-0.036l-0-0z" />
                            </g>
                          </svg>
                        </a>
                      )}
                      {!socialLinks.steam && !socialLinks.discord && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(player);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isPlayerFavorite(player.name)
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-400 hover:text-gray-500"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 ${isPlayerFavorite(player.name) ? "fill-yellow-500" : ""}`}
                      />
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            Playtime & Session
                          </h4>
                          {statsLoading ? (
                            <div className="flex flex-col gap-2">
                              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32 animate-pulse"></div>
                              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 animate-pulse"></div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                {playerStats?.playtime?.[0]?.seconds ? (
                                  <span className="text-zinc-900 dark:text-zinc-100">
                                    {(
                                      playerStats.playtime[0].seconds / 3600
                                    ).toFixed(1)}{" "}
                                    hours on record
                                  </span>
                                ) : (
                                  <span className="text-zinc-400 italic">
                                    No playtime data available
                                  </span>
                                )}
                              </div>
                              {playerStats?.globalCounts && (
                                <div className="text-[11px] text-zinc-500">
                                  Last seen: {new Date().toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Identifiers & Policy
                          </h4>
                          <div className="flex flex-col gap-2">
                            {player.identifiers?.map((id) => {
                              const result = policyResults[id];
                              const loading = policyLoading[id];

                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-2 group/id"
                                >
                                  <span
                                    className="text-[10px] px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded font-mono truncate max-w-[250px] border border-zinc-300 dark:border-zinc-700"
                                    title={id}
                                  >
                                    {id}
                                  </span>

                                  {loading ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                                  ) : result ? (
                                    <div
                                      className="flex items-center gap-1.5"
                                      title={
                                        result.status === "clean"
                                          ? "No global bans found"
                                          : "Policy entry found"
                                      }
                                    >
                                      {result.status === "clean" ? (
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                      ) : result.status === "banned" ? (
                                        <ShieldAlert className="w-4 h-4 text-red-500" />
                                      ) : (
                                        <ShieldX className="w-4 h-4 text-zinc-400" />
                                      )}
                                      <span
                                        className={`text-[10px] font-bold uppercase ${result.status === "clean" ? "text-green-600" : result.status === "banned" ? "text-red-600" : "text-zinc-500"}`}
                                      >
                                        {result.status}
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        checkPolicy(id);
                                      }}
                                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline opacity-0 group-hover/id:opacity-100 transition-opacity"
                                    >
                                      Check Policy
                                    </button>
                                  )}
                                </div>
                              );
                            }) || (
                              <span className="text-zinc-400 text-xs italic">
                                Hidden identifiers
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
