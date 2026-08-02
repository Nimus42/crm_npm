'use client';

import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { api } from '../../../lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Опционально: можно добавить setInterval для поллинга уведомлений раз в минуту
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Ошибка при обновлении статуса', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md flex items-center justify-end px-8 sticky top-0 z-40">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-900"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-neutral-950"></span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-medium text-white text-sm">Уведомления</h3>
              <span className="text-xs text-neutral-500">{unreadCount} новых</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-neutral-500">Нет уведомлений</div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-neutral-800/50 last:border-0 ${notif.isRead ? 'opacity-60' : 'bg-neutral-800/20'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-200">{notif.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-neutral-500 mt-2 block">
                          {new Date(notif.createdAt).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="text-neutral-500 hover:text-green-400 transition-colors"
                          title="Отметить как прочитанное"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}