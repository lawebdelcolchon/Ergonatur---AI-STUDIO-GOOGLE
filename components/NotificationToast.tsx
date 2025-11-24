
import React, { useEffect } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  title?: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-24 left-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => (
        <ToastItem key={notif.id} notification={notif} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ notification: Notification; onRemove: (id: string) => void }> = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 5000); // Auto remove after 5 seconds
    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success': return 'bg-white border-l-4 border-green-500 text-gray-800';
      case 'warning': return 'bg-white border-l-4 border-orange-500 text-gray-800';
      default: return 'bg-white border-l-4 border-blue-500 text-gray-800';
    }
  };

  return (
    <div className={`pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-lg shadow-xl transform transition-all duration-300 animate-fadeIn flex items-start gap-3 ${getStyles()}`}>
      <span className={`material-symbols-outlined mt-0.5 ${
        notification.type === 'success' ? 'text-green-500' : 
        notification.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
      }`}>
        {getIcon()}
      </span>
      <div className="flex-1">
        {notification.title && <h4 className="font-bold text-sm mb-0.5">{notification.title}</h4>}
        <p className="text-sm text-gray-600">{notification.message}</p>
      </div>
      <button onClick={() => onRemove(notification.id)} className="text-gray-400 hover:text-gray-600">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
