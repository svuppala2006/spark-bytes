import { NewEventNotification } from '@/lib/useNotifications';
import { X } from 'lucide-react';

interface NotificationToastProps {
  notification: NewEventNotification | null;
  onDismiss: () => void;
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  if (!notification) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white border border-green-200 rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">New Event: {notification.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{notification.organization}</p>
          <p className="text-xs text-gray-500 mt-2">{notification.date} at {notification.start_time}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
