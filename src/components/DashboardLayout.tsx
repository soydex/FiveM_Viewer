"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/routing";
import { useServer } from "@/components/ServerContext";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/Footer";
import ServerBanner from "@/components/dashboard/ServerBanner";
import Tabs from "@/components/dashboard/Tabs";
import RefreshBadge from "@/components/dashboard/RefreshBadge";
import { NotificationContainer } from "@/components/Notifications";
import DeprecationBanner from "@/components/dashboard/DeprecationBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    serverInfo,
    loading,
    favorites,
    lastRefreshTimestamp,
    notifications,
    removeNotification,
  } = useServer();

  const [isDismissed, setIsDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = sessionStorage.getItem("fivem_viewer_notice_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("fivem_viewer_notice_dismissed", "true");
    setIsDismissed(true);
  };

  // Conditionally render the server banner and routing tabs only on server pages
  const isDashboardRoute =
    pathname.endsWith("/players") ||
    pathname.endsWith("/favorites") ||
    pathname.endsWith("/statistics");

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isDismissed) {
    return <DeprecationBanner onDismiss={handleDismiss} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-gray-900 dark:bg-zinc-950 dark:text-white relative flex flex-col justify-between">
      <div>
        <Header />

        {serverInfo && isDashboardRoute && (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
              <ServerBanner serverInfo={serverInfo} loading={loading} />
            </div>
            <Tabs />
          </>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh] w-full">
          {children}
        </main>
      </div>

      <div>
        {serverInfo && isDashboardRoute && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <RefreshBadge lastRefreshTimestamp={lastRefreshTimestamp} />
          </div>
        )}
        <Footer />
      </div>

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
}
