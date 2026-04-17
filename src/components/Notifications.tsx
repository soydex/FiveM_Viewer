import { useEffect, useState } from "react";
import type { Notification, NotificationType } from "../hooks/useNotifications";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const duration = notification.duration || 5000;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [notification.id, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(notification.id), 300); // Attendre l'animation de sortie
  };

  const progressPercentage = (timeLeft / duration) * 100;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getThemeClasses = (type: NotificationType) => {
    // Classes de base pour le conteneur du toast
    const baseClasses =
      "pointer-events-auto relative w-full overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out";

    // Animations d'entrée et de sortie
    const animationClasses = isLeaving
      ? "translate-x-full opacity-0"
      : "translate-x-0 opacity-100 animate-in slide-in-from-right-8";

    // Couleurs et bordures selon le thème
    const colorClasses =
      "bg-white/80 border-gray-200 dark:bg-zinc-900/90 dark:border-zinc-800/80";

    return `${baseClasses} ${animationClasses} ${colorClasses}`;
  };

  const getProgressColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
      case "error":
        return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
      case "warning":
        return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
      case "info":
        return "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
    }
  };

  return (
    <div className={getThemeClasses(notification.type)}>
      <div className="flex items-start gap-4">
        {/* Icône */}
        <div className="mt-0.5 flex-shrink-0 animate-in zoom-in-50 duration-300 delay-100">
          {getIcon(notification.type)}
        </div>

        {/* Contenu */}
        <div className="flex-1 w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
            {notification.title}
          </p>
          {notification.message && (
            <div className="mt-1 text-sm text-gray-600 dark:text-zinc-400 break-words">
              {notification.message}
            </div>
          )}
        </div>

        {/* Bouton de fermeture */}
        <div className="flex flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <span className="sr-only">Fermer</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Barre de progression avec effet glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100/50 dark:bg-zinc-800/50">
        <div
          className={`h-full transition-all duration-100 ease-linear ${getProgressColor(
            notification.type
          )}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export function NotificationContainer({
  notifications,
  onClose,
}: NotificationContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <div key={notification.id} className="w-full max-w-sm">
            <NotificationToast
              notification={notification}
              onClose={onClose}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
