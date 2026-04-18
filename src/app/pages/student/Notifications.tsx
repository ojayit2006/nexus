import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Link } from 'react-router';
import { 
  CheckCircle, 
  XOctagon, 
  CreditCard, 
  Info,
  CheckCheck,
  Bell
} from 'lucide-react';

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNexus();
  const [filter, setFilter] = useState<'all' | 'approval' | 'payment' | 'rejection' | 'system'>('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-6 h-6 text-[#1040C0]" />;
      case 'rejection': return <XOctagon className="w-6 h-6 text-[#D02020]" />;
      case 'payment': return <CreditCard className="w-6 h-6 text-[#F0C020]" />;
      case 'system': return <Info className="w-6 h-6 text-[#121212]" />;
      default: return <Bell className="w-6 h-6 text-[#121212]" />;
    }
  };

  const getLink = (type: string) => {
    switch (type) {
      case 'approval':
      case 'rejection': return '/application';
      case 'payment': return '/payments';
      default: return '#';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-[#121212] pb-6">
        <div>
          <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight mb-2 flex items-center gap-4">
            Alerts
            {unreadCount > 0 && (
              <span className="bg-[#D02020] text-white text-lg px-3 py-1 rounded-full border-4 border-[#121212] font-black translate-y-[-4px]">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-lg font-medium opacity-80">Stay updated on your graduation clearance flow.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllNotificationsRead} 
            className="font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] hover:bg-[#F0C020] transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
         {[
           { id: 'all', label: 'All' },
           { id: 'approval', label: 'Approvals' },
           { id: 'payment', label: 'Payments' },
           { id: 'rejection', label: 'Rejections' },
           { id: 'system', label: 'System' }
         ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-widest border-2 transition-all ${
                filter === tab.id 
                  ? 'bg-[#121212] flex-[1_1_auto] text-white border-[#121212]' 
                  : 'bg-white flex-[1_1_auto] text-[#121212] border-[#121212] hover:bg-[#F0F0F0] opacity-70'
              }`}
            >
              {tab.label}
            </button>
         ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
           <div className="bg-white border-4 border-[#121212] border-dashed p-12 flex flex-col items-center justify-center text-center opacity-70">
             <Bell className="w-12 h-12 mb-4 opacity-50" />
             <p className="font-black uppercase tracking-widest">It's quiet here.</p>
             <p className="font-bold text-sm">No notifications found.</p>
           </div>
        ) : (
          filteredNotifications.map((noti) => {
            const dest = getLink(noti.type);
            
            return (
              <div 
                key={noti.id}
                onMouseEnter={() => { if (!noti.read) markNotificationRead(noti.id); }}
                className={`relative group bg-white border-4 transition-all flex items-start gap-4 p-5 hover:translate-x-2 ${
                  noti.read ? 'border-[#E0E0E0] opacity-80' : 'border-[#121212] shadow-[4px_4px_0px_0px_#121212]'
                }`}
              >
                {!noti.read && (
                  <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#D02020]" />
                )}
                
                <div className="w-12 h-12 bg-[#F0F0F0] border-2 border-[#121212] rounded-full flex items-center justify-center shrink-0">
                  {getIcon(noti.type)}
                </div>
                
                <div className="flex-1 min-w-0 pr-4 mt-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                    <h3 className="font-black text-lg uppercase tracking-tight truncate">{noti.title}</h3>
                    <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 whitespace-nowrap">{noti.time}</span>
                  </div>
                  <p className="font-medium text-sm text-[#121212] opacity-90 mb-3">{noti.description}</p>
                  
                  {dest !== '#' && (
                     <Link to={dest} className="inline-block mt-2">
                       <span className="font-bold text-xs uppercase tracking-widest hover:underline text-[#1040C0]">
                         View Details →
                       </span>
                     </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
