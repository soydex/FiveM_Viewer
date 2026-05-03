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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 animate-pulse"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-12"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {topServers.map((server) => (
          <div
            key={server.id}
            onClick={() => onSelectServer(server.id)}
            className="group p-5 rounded-2xl border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 active:scale-[0.98]"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {server.name}
                </h3>
                <span className="shrink-0 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-zinc-500 dark:text-zinc-400 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                  {server.id}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">
                    {server.currentPlayers.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (server.currentPlayers / server.maxPlayers) * 100)}%` }}
                  />
                </div>
                
                <span className="text-xs text-zinc-400">
                  {Math.round((server.currentPlayers / server.maxPlayers) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopServ;
