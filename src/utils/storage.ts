export interface FavoritePlayer {
  name: string;
  lastKnownId: number;
}

export interface ServerHistoryItem {
  id: string;
  name: string;
  lastVisited: number;
}

const KEYS = {
  FAVORITES: "favorites",
  HISTORY: "serverHistory",
  LAST_SERVER_ID: "lastServerId",
  AUTO_REFRESH: "autoRefresh",
  SYNC_TOKEN: "sync_token",
  SYNC_MODE: "sync_mode",
  LAST_SYNC: "last_sync",
} as const;

export type SyncMode = "download" | "upload" | "both" | "manual";

/**
 * Sync Management
 */
export async function pushToServer(): Promise<boolean> {
  const token = localStorage.getItem(KEYS.SYNC_TOKEN);
  if (!token) return false;

  const data = {
    favorites: loadFavorites(),
    history: loadServerHistory(),
    autoRefresh: loadAutoRefresh(),
  };

  try {
    const res = await fetch("/api/sync/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
      return true;
    }
  } catch (e) {
    console.error("Sync push error:", e);
  }
  return false;
}

export async function pullFromServer(): Promise<boolean> {
  const token = localStorage.getItem(KEYS.SYNC_TOKEN);
  if (!token) return false;

  try {
    const res = await fetch("/api/sync/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.favorites) saveFavorites(data.favorites);
      if (data.history) saveServerHistory(data.history);
      if (typeof data.autoRefresh === "boolean")
        saveAutoRefresh(data.autoRefresh);
      localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
      return true;
    }
  } catch (e) {
    console.error("Sync pull error:", e);
  }
  return false;
}

export function getSyncToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.SYNC_TOKEN);
}

export function setSyncToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.SYNC_TOKEN, token);
}

export function getSyncMode(): SyncMode {
  if (typeof window === "undefined") return "manual";
  return (localStorage.getItem(KEYS.SYNC_MODE) as SyncMode) || "manual";
}

export function setSyncMode(mode: SyncMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.SYNC_MODE, mode);
}

export function getLastSync(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(KEYS.LAST_SYNC)) || 0;
}

/**
 * Favorites Management
 */
export function loadFavorites(): FavoritePlayer[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading favorites:", e);
    return [];
  }
}

export function saveFavorites(favorites: FavoritePlayer[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  triggerAutoSync();
}

/**
 * History Management
 */
export function loadServerHistory(): ServerHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading history:", e);
    return [];
  }
}

export function saveServerHistory(history: ServerHistoryItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  triggerAutoSync();
}

/**
 * Last Server ID
 */
export function loadLastServerId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.LAST_SERVER_ID) || "";
}

export function saveLastServerId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.LAST_SERVER_ID, id);
}

/**
 * Auto Refresh Setting
 */
export function loadAutoRefresh(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem(KEYS.AUTO_REFRESH);
  return saved === null ? true : saved === "true";
}

export function saveAutoRefresh(val: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.AUTO_REFRESH, val.toString());
  triggerAutoSync();
}

/**
 * Internal Sync Trigger
 */
function triggerAutoSync() {
  if (getSyncMode() === "both") {
    pushToServer().catch(console.error);
  }
}
