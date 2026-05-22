"use client";

import { useEffect } from "react";
import { useRouter } from "@/routing";
import { useServer } from "@/components/ServerContext";
import Statistics from "@/components/dashboard/Statistics";

export default function StatisticsPage() {
  const router = useRouter();
  const { serverInfo, loading } = useServer();

  useEffect(() => {
    if (!serverInfo) {
      router.push("/");
    }
  }, [serverInfo, router]);

  if (!serverInfo) return null;

  return <Statistics serverInfo={serverInfo} loading={loading} />;
}
