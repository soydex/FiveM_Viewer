"use client";

import { ArrowLeft, ArrowLeftRight, CloudDownload, CloudUpload, LogOut, PauseCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/routing";
import {
  getLastSync,
  getSyncMode,
  getSyncToken,
  pullFromServer,
  pushToServer,
  type SyncMode,
  setSyncMode,
  setSyncToken,
} from "@/utils/storage";

const SettingsPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [syncMode, setSyncModeState] = useState<SyncMode>("manual");
  const [lastSync, setLastSync] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Check if we have a token in the URL hash
    if (window.location.hash.startsWith("#sync_token=")) {
      const newToken = window.location.hash.split("=")[1];
      setSyncToken(newToken);
      setToken(newToken);
      // Clean URL hash
      window.history.replaceState(null, "", window.location.pathname);
      setMessage({
        text: "Connecté avec succès ! Synchronisation en cours...",
        type: "success",
      });

      // Initial pull
      pullFromServer().then((success) => {
        if (success) {
          setLastSync(Date.now());
          setMessage({ text: "Connecté et synchronisé !", type: "success" });
        }
      });
    } else {
      setToken(getSyncToken());
    }

    setSyncModeState(getSyncMode());
    setLastSync(getLastSync());
  }, []);

  const handleSyncModeChange = (mode: SyncMode) => {
    setSyncModeState(mode);
    setSyncMode(mode);
  };

  const handleSyncNow = async () => {
    if (!token) return;
    setIsSyncing(true);
    setMessage(null);

    let success = false;
    if (syncMode === "download") {
      success = await pullFromServer();
    } else if (syncMode === "upload") {
      success = await pushToServer();
    } else {
      // both or manual - default to push then pull (merge logic would be better but simple push/pull for now)
      const pushSuccess = await pushToServer();
      const pullSuccess = await pullFromServer();
      success = pushSuccess && pullSuccess;
    }

    if (success) {
      setLastSync(Date.now());
      setMessage({ text: "Synchronisation réussie !", type: "success" });
    } else {
      setMessage({ text: "Échec de la synchronisation.", type: "error" });
    }
    setIsSyncing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("sync_token");
    setToken(null);
    setMessage({ text: "Déconnecté.", type: "success" });
  };

  const handleResetData = () => {
    if (
      confirm(
        "Attention cette action est irreversible et supprimera toutes vos données locales. Continuer ?",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </Link>

      <h1 className="text-3xl font-bold">Paramètres</h1>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
        >
          {message.text}
        </div>
      )}

      <section className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-400" />
          Cloud Intégration
        </h2>
        <p className="text-gray-400">
          Connectez votre compte Discord ou GitHub pour retrouver vos favoris et
          votre historique sur tous vos appareils.
        </p>

        {!token ? (
          <div className="pt-2">
            <a
              href="/api/sync/auth/discord"
              className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Connecter Discord
            </a>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Connecté au Cloud
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">
                Sync Rules for This Device
              </p>
              <p className="text-xs text-gray-500">
                Controls how your data moves between this device and the cloud.
              </p>
              <div className="grid gap-2 pt-1">
                {(
                  [
                    {
                      value: "both",
                      icon: ArrowLeftRight,
                      label: "Two-way sync",
                      description: "Changes flow in both directions automatically.",
                    },
                    {
                      value: "upload",
                      icon: CloudUpload,
                      label: "This device is the source",
                      description: "Local data is pushed to the cloud. Cloud changes are ignored.",
                    },
                    {
                      value: "download",
                      icon: CloudDownload,
                      label: "The cloud is the source",
                      description: "Cloud data overwrites local on every sync.",
                    },
                    {
                      value: "manual",
                      icon: PauseCircle,
                      label: "Manual only",
                      description: "Nothing syncs automatically — use the button below.",
                    },
                  ] as const
                ).map(({ value, icon: Icon, label, description }) => {
                  const active = syncMode === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSyncModeChange(value)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition-all ${
                        active
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mt-0.5 shrink-0 ${active ? "text-blue-400" : "text-gray-500"}`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${active ? "text-white" : "text-gray-300"}`}>
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                      </div>
                      <span
                        className={`ml-auto mt-1 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          active ? "border-blue-500 bg-blue-500" : "border-gray-600"
                        }`}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500">
                {lastSync > 0
                  ? `Dernière synchro : ${new Date(lastSync).toLocaleString()}`
                  : "Jamais synchronisé"}
              </div>
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isSyncing && <RefreshCw className="w-4 h-4 animate-spin" />}
                Synchroniser maintenant
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4 bg-red-950/20 p-6 rounded-xl border border-red-900/30">
        <h2 className="text-xl font-semibold text-red-400">Reset Data</h2>
        <p className="text-gray-400">
          Attention, cette action est irréversible et supprimera toutes vos
          données locales (favoris, historique, paramètres).
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Tout réinitialiser
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
