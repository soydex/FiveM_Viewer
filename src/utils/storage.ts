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
} as const;

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
}
