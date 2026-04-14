import { Users } from "lucide-react";

interface TopServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  iconUrl?: string;
}

interface TopServProps {
  topServers: TopServer[];
  loading: boolean;
  onSelectServer: (serverId: string) => void;
}

const TopServ = ({ topServers, loading, onSelectServer }: TopServProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
          Top Serveurs Français
        </h2>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-900 rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-zinc-900 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded w-24"></div>
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
        Top Serveurs Français
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Sélectionnez un serveur populaire pour commencer à explorer ses joueurs.
      </p>
      <div className="grid gap-4">
        {topServers.map((server) => (
          <div
            key={server.id}
            onClick={() => onSelectServer(server.id)}
            className="p-4 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-4">
              {server.iconUrl && (
                <img
                  src={server.iconUrl}
                  alt={`${server.name} icon`}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                  {server.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span>{server.currentPlayers}/{server.maxPlayers} joueurs</span>
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