"use client";

import { useEffect } from "react";
import { useRouter } from "@/routing";
import { useServer } from "@/components/ServerContext";
import FavoritesManager from "@/components/dashboard/FavoritesManager";

export default function FavoritesPage() {
  const router = useRouter();
  const {
    serverInfo,
    favorites,
    setFavorites,
    addFavoriteName,
    setAddFavoriteName,
    addFavoriteManually,
  } = useServer();

  useEffect(() => {
    if (!serverInfo) {
      router.push("/");
    }
  }, [serverInfo, router]);

  if (!serverInfo) return null;

  return (
    <FavoritesManager
      favorites={favorites}
      setFavorites={setFavorites}
      addFavoriteName={addFavoriteName}
      setAddFavoriteName={setAddFavoriteName}
      addFavoriteManually={addFavoriteManually}
      serverPlayers={serverInfo.players}
    />
  );
}
