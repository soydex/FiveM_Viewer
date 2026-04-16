import { useEffect, useState } from "react";
import type { Notification, NotificationType } from "../hooks/useNotifications";

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const duration = notification.duration || 5000;
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
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
  }, [notification.id, duration, onClose]);

  const progressPercentage = (timeLeft / duration) * 100;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
    }
  };

  const getColors = (type: NotificationType) => {
    const baseClasses =
      "bg-white border-zinc-200 text-gray-900 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white";

    switch (type) {
      case "success":
        return `${baseClasses} border-green-500`;
      case "error":
        return `${baseClasses} border-red-500`;
      case "warning":
        return `${baseClasses} border-yellow-500`;
      case "info":
        return `${baseClasses} border-blue-500`;
    }
  };

  const getProgressColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className={`absolute inset-0 ${getProgressColor(notification.type)} transition-all duration-100 ease-linear`}
        style={{ width: `${progressPercentage}%` }}
      />
      <div
        className={`relative p-4 rounded-lg shadow-lg ${getColors(notification.type)} bg-opacity-95 backdrop-blur-sm`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{getIcon(notification.type)}</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{notification.title}</p>
            {notification.message && (
              <p
                className="mt-1 text-sm opacity-75"
                dangerouslySetInnerHTML={{ __html: notification.message }}
              />
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => onClose(notification.id)}
              className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
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
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
