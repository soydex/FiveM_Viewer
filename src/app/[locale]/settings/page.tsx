"use client";

import { Link } from "@/routing";
import { ArrowLeft, Github, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  getSyncToken, 
  setSyncToken, 
  getSyncMode, 
  setSyncMode, 
  SyncMode, 
  pullFromServer, 
  pushToServer,
  getLastSync
} from "@/utils/storage";

const SettingsPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [syncMode, setSyncModeState] = useState<SyncMode>("manual");
  const [lastSync, setLastSync] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Check if we have a token in the URL hash
    if (window.location.hash.startsWith("#sync_token=")) {
      const newToken = window.location.hash.split("=")[1];
      setSyncToken(newToken);
      setToken(newToken);
      // Clean URL hash
      window.history.replaceState(null, "", window.location.pathname);
      setMessage({ text: "Connecté avec succès ! Synchronisation en cours...", type: 'success' });
      
      // Initial pull
      pullFromServer().then(success => {
        if (success) {
          setLastSync(Date.now());
          setMessage({ text: "Connecté et synchronisé !", type: 'success' });
        }
      });
    } else {
      setToken(getSyncToken());
    }

    setSyncModeState(getSyncMode());
    setLastSync(getLastSync());
  }, []);

  const handleSyncModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as SyncMode;
    setSyncModeState(newMode);
    setSyncMode(newMode);
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
      setMessage({ text: "Synchronisation réussie !", type: 'success' });
    } else {
      setMessage({ text: "Échec de la synchronisation.", type: 'error' });
    }
    setIsSyncing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("sync_token");
    setToken(null);
    setMessage({ text: "Déconnecté.", type: 'success' });
  };

  const handleResetData = () => {
    if (confirm("Attention cette action est irreversible et supprimera toutes vos données locales. Continuer ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </Link>
      
      <h1 className="text-3xl font-bold">Paramètres</h1>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <section className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-400" />
          Cloud Intégration
        </h2>
        <p className="text-gray-400">
          Connectez votre compte Discord ou GitHub pour retrouver vos favoris et votre historique sur tous vos appareils.
        </p>

        {!token ? (
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a 
              href="/api/sync/auth/discord" 
              className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Connecter Discord
            </a>
            <a 
              href="/api/sync/auth/github" 
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Github className="w-5 h-5" />
              Connecter GitHub
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
            <label htmlFor="sync-mode" className="block text-sm font-medium text-gray-300">Mode de synchronisation</label>
            <select 
              id="sync-mode"
              value={syncMode} 
              onChange={handleSyncModeChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="both">Synchronisation bidirectionnelle (Auto)</option>
              <option value="download">Téléchargement uniquement (Cloud → Local)</option>
              <option value="upload">Envoi uniquement (Local → Cloud)</option>
              <option value="manual">Manuel</option>
            </select>
            <p className="text-xs text-gray-500 italic">
              {syncMode === 'both' && "Les données locales et distantes sont fusionnées à chaque action."}
              {syncMode === 'download' && "Vos données locales seront écrasées par celles du cloud."}
              {syncMode === 'upload' && "Vos données du cloud seront écrasées par vos données locales."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="text-sm text-gray-500">
              {lastSync > 0 ? `Dernière synchro : ${new Date(lastSync).toLocaleString()}` : "Jamais synchronisé"}
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
          Attention, cette action est irréversible et supprimera toutes vos données locales (favoris, historique, paramètres).
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
