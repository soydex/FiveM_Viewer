import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface TopServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
}

interface TopServProps {
  topServers: TopServer[];
  loading: boolean;
  onSelectServer: (serverId: string) => void;
}

const TopServ = ({ topServers, loading, onSelectServer }: TopServProps) => {
  const t = useTranslations("common");

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
          {t("pinnedServers")}
        </h2>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-zinc-950 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-950 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        {t("pinnedServers")}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        {t("pinnedServersDesc")}
      </p>
      <div className="grid gap-4">
        {topServers.map((server) => (
          <div
            key={server.id}
            onClick={() => onSelectServer(server.id)}
            className="p-4 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950 cursor-pointer transition-colors max-w-7xl"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                  {server.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {server.currentPlayers}/{server.maxPlayers} {t("playersCount").toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopServ;
