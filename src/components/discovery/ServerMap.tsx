"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface ServerLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  players: number;
  maxPlayers: number;
}

const ServerMap = () => {
  const t = useTranslations("common");
  const { theme, resolvedTheme } = useTheme();
  const [locations, setLocations] = useState<ServerLocation[]>([]);
  const [L, setL] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      // Fix default icon issue in Leaflet with Next.js
      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      leaflet.Marker.prototype.options.icon = DefaultIcon;
    });

    // Mock data for demo - in a real app, we'd fetch this or use IP geolocation on a subset of servers
    setLocations([
      {
        id: "y4lg95",
        name: "FiveM test server",
        lat: 53.2193,
        lon: 6.5665,
        players: 53,
        maxPlayers: 128,
      },
      {
        id: "4lqxao",
        name: "Liberty 99",
        lat: 48.8566,
        lon: 2.3522,
        players: 120,
        maxPlayers: 256,
      },
      {
        id: "mock1",
        name: "US East RP",
        lat: 40.7128,
        lon: -74.006,
        players: 300,
        maxPlayers: 512,
      },
      {
        id: "mock2",
        name: "London Life",
        lat: 51.5074,
        lon: -0.1278,
        players: 150,
        maxPlayers: 200,
      },
    ]);
  }, []);

  if (!L)
    return (
      <div className="h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
    );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
        {t("interactiveMap")}
      </h2>
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 z-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={
              isDarkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lon]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm">{loc.name}</h3>
                  <p className="text-xs text-zinc-600">
                    {loc.players} / {loc.maxPlayers} Players
                  </p>
                  <button
                    className="mt-2 text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 w-full"
                    onClick={() => (window.location.href = `?s=${loc.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ServerMap;
