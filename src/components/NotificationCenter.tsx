import React from 'react';
import { NotificationItem } from '../types';
import { X, Bell, CheckCircle2, Ticket, Award } from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onMarkAllRead
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slideLeft">
        
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-teal-400" />
            <h3 className="font-extrabold text-base">Travel Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-600">{notifications.filter(n => !n.read).length} unread alerts</span>
          <button onClick={onMarkAllRead} className="text-teal-600 font-bold hover:underline">Mark all as read</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-2xl border transition-all space-y-1 ${
                n.read ? 'bg-white border-slate-200' : 'bg-teal-50/50 border-teal-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-extrabold text-slate-900 text-sm">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
