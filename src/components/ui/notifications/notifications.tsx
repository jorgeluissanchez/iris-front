'use client';

import { Notification } from './notification';
import { useNotifications } from './notifications-store';

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end space-y-4 px-4 pt-20 pb-6 sm:items-start sm:pt-16 sm:px-6 sm:pb-6"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};
