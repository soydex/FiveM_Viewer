"use client";

import { useEffect } from "react";
import { useRouter } from "@/routing";
import { useServer } from "@/components/ServerContext";
import GlobalStats from "@/components/dashboard/GlobalStats";
import GlobalSearch from "@/components/discovery/GlobalSearch";
import ServerMap from "@/components/discovery/ServerMap";
import TopServ from "@/components/TopServ";

export default function LandingPage() {
  const router = useRouter();
  const {
    serverInfo,
    setServerId,
    fetchServerData,
    topServers,
    loadingTopServers,
  } = useServer();

  useEffect(() => {
    if (serverInfo) {
      router.push("/players");
    }
  }, [serverInfo, router]);

  return (
    <div className="flex flex-col gap-12 pt-4">
      <GlobalStats />
      <GlobalSearch
        onSelectServer={(id) => {
          setServerId(id);
          fetchServerData(id);
        }}
      />
      <ServerMap />
      <TopServ
        topServers={topServers}
        loading={loadingTopServers}
        onSelectServer={(id) => {
          setServerId(id);
          fetchServerData(id);
        }}
      />
    </div>
  );
}
