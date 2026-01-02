'use client';

import { useState } from 'react';
import { markAsRead, markAllAsRead } from '@/lib/actions/notification-actions';
import { useRouter } from 'next/navigation';

type Notification = {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    link?: string | null;
    type: string;
};

export default function NotificationBell({ notifications }: { notifications: Notification[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [list, setList] = useState(notifications);
    const router = useRouter();

    const unreadCount = list.filter(n => !n.isRead).length;

    const handleRead = async (id: string, link?: string | null) => {
        setList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await markAsRead(id);
        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAll = async () => {
        setList(prev => prev.map(n => ({ ...n, isRead: true })));
        await markAllAsRead();
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-700 transition"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAll} className="text-xs text-primary-600 hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {list.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                No notifications
                            </div>
                        ) : (
                            list.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => handleRead(n.id, n.link)}
                                    className={`p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm ${!n.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                            {n.title}
                                        </p>
                                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1"></span>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
