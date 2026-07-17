"use client";

import DeprecationBanner from "@/components/dashboard/DeprecationBanner";

// Service arrêté : l'accès à l'application est désactivé.
// Le layout affiche uniquement l'écran de fin de service, sans possibilité
// de le fermer. Pour réactiver l'appli, restaurer la version précédente
// de ce fichier (git history).
export default function DashboardLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  return <DeprecationBanner />;
}
