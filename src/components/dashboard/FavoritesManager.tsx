"use client";

import { Plus, Trash2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

interface FavoritePlayer {
  name: string;
  lastKnownId: number;
}

interface Player {
  id: number;
  name: string;
  ping: number;
}

interface FavoritesManagerProps {
  favorites: FavoritePlayer[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoritePlayer[]>>;
  addFavoriteName: string;
  setAddFavoriteName: (val: string) => void;
  addFavoriteManually: () => void;
  serverPlayers: Player[];
}

const FavoritesManager = ({
  favorites,
  setFavorites,
  addFavoriteName,
  setAddFavoriteName,
  addFavoriteManually,
  serverPlayers,
}: FavoritesManagerProps) => {
  const t = useTranslations("common");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("favoritePlayers")}</h2>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("addFavoriteByNamePlaceholder")}
            value={addFavoriteName}
            onChange={(e) => setAddFavoriteName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFavoriteManually()}
            className="pl-10 pr-3 py-2 border rounded-lg bg-white border-zinc-300 text-gray-900 placeholder-gray-500 dark:bg-zinc-950 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 w-full ring-1 ring-transparent focus:ring-purple-500 focus:border-purple-500 transition-all h-[42px]"
          />
        </div>
        <button
          onClick={addFavoriteManually}
          className="relative cursor-pointer opacity-90 hover:opacity-100 transition-all p-[2px] bg-black rounded-[12px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95 h-[42px]"
        >
          <span className="flex items-center gap-2 px-4 py-2 bg-[#B931FC] text-white rounded-[10px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-medium whitespace-nowrap text-sm h-full">
            <Plus className="w-4 h-4" />
            {t("addFavoriteButton")}
          </span>
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-700">
          {t("noFavoritePlayers")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("ping")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
              {favorites.map((fav) => {
                const onlinePlayer = serverPlayers.find(
                  (p) => p.name.toLowerCase() === fav.name.toLowerCase(),
                );
                const isOnline = !!onlinePlayer;
                const displayId = isOnline ? onlinePlayer.id : fav.lastKnownId;

                return (
                  <tr
                    key={fav.name}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-zinc-400"}`}
                        />
                        <span className="font-medium">{fav.name}</span>
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${isOnline ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
                        >
                          {isOnline ? t("online") : t("offline")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>{displayId || "—"}</span>
                        {displayId > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${isOnline ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"}`}
                          >
                            {isOnline ? t("currentId") : t("lastKnownId")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isOnline && onlinePlayer ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${onlinePlayer.ping < 50 ? "bg-green-100 text-green-800" : onlinePlayer.ping < 100 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                        >
                          {onlinePlayer.ping}ms
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          setFavorites((prev) =>
                            prev.filter(
                              (f) =>
                                f.name.toLowerCase() !== fav.name.toLowerCase(),
                            ),
                          )
                        }
                        className="text-red-400 hover:text-red-500 p-1 transition-colors"
                        title={t("removeFromFavorites")}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
};

export default FavoritesManager;
