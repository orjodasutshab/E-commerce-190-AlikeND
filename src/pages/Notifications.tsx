import { useState } from 'react';
import { Bell, ShieldAlert, Tag, Gift, Truck, Check, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function Notifications({ notifications: initialNotifications, showToast }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleMarkRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isUnread: false })));
    showToast('Marked all luxury alerts as read.', 'success');
  };

  const handleClearAlert = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    showToast('Alert cleared.', 'info');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('Inbox fully cleared.', 'info');
  };

  // Icon mappings
  const getAlertIcon = (type: string) => {
    if (type === 'promo') return <Tag className="w-5 h-5 text-[#D1D1D1]" />;
    if (type === 'shipping') return <Truck className="w-5 h-5 text-blue-400" />;
    if (type === 'warning' || type === 'security') return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    return <Bell className="w-5 h-5 text-[#D1D1D1]" />;
  };

  return (
    <div id="notifications-root" className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-neutral-900 border border-solid border-neutral-850 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-solid border-neutral-800 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-md sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D1D1D1]" /> Client Alarms Panel
            </h2>
            <p className="text-[10px] text-neutral-500">Security corridor log drops and coupon clearances</p>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
              <button
                id="mark-all-read-btn"
                onClick={handleMarkAllRead}
                className="text-neutral-400 hover:text-[#D1D1D1]"
                title="Mark all luxury alerts as read"
              >
                Mark Read
              </button>
              <span className="text-neutral-800">|</span>
              <button
                id="clear-all-alerts-btn"
                onClick={handleClearAll}
                className="text-neutral-500 hover:text-red-400"
                title="Clear all notifications"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-xs text-neutral-500">
            <Bell className="w-8 h-8 text-neutral-850 mx-auto mb-2" />
            No new client alarms listed inside your concierge logging registers.
          </div>
        ) : (
          <div className="space-y-3.5" id="notifications-list-container">
            {notifications.map((n) => {
              return (
                <div
                  key={n.id}
                  id={`notif-${n.id}`}
                  className={`p-4 rounded-xl border border-solid transition-colors flex gap-4 items-start relative group ${
                    n.isUnread
                      ? 'bg-neutral-950 border-[#D1D1D1]/40 shadow-inner'
                      : 'bg-neutral-950/40 border-neutral-850 opacity-75'
                  }`}
                >
                  <div className="p-2 bg-neutral-900 rounded-lg border border-solid border-neutral-800 shrink-0">
                    {getAlertIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-white text-[11px] leading-snug-normal select-none">
                        {n.title}
                        {n.isUnread && (
                          <span className="ml-2 px-1.5 py-0.5 bg-[#D1D1D1]/10 text-[#D1D1D1] text-[8px] font-bold rounded uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </h4>
                      <span className="text-[9px] text-neutral-600 font-mono tracking-wider font-semibold shrink-0">
                        {n.timestamp || 'Today'}
                      </span>
                    </div>
                    <p className="text-neutral-400 mt-1 font-medium leading-relaxed">
                      {n.message}
                    </p>

                    {/* Inline action item controls */}
                    <div className="flex gap-4 pt-2 font-black uppercase text-[10px] tracking-wider text-neutral-400">
                      {n.isUnread && (
                        <button
                          id={`mark-read-item-${n.id}`}
                          onClick={() => handleMarkRead(n.id)}
                          className="flex items-center gap-1 hover:text-[#D1D1D1]"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Acknowledged
                        </button>
                      )}
                      <button
                        id={`del-alarm-item-${n.id}`}
                        onClick={() => handleClearAlert(n.id)}
                        className="flex items-center gap-1 text-neutral-500 group-hover:text-red-500"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" /> Clear Log
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
