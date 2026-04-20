import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useNexus } from '../context/NexusContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  FolderLock, 
  CreditCard, 
  Bell, 
  WalletCards, 
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../components/Logo';

export function StudentLayout() {
  const { profile, notifications } = useNexus();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Application', href: '/application', icon: FileText },
    { name: 'Document Vault', href: '/documents', icon: FolderLock },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotificationsCount },
    { name: 'Digital Locker', href: '/locker', icon: WalletCards },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r-4 border-[#121212] flex flex-col transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="p-6 border-b-4 border-[#121212] flex items-center justify-between">
          <Link to="/" className="scale-90 origin-left">
            <Logo />
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                  isActive 
                    ? 'bg-[#1040C0] text-white border-[#121212] shadow-[4px_4px_0px_#121212]' 
                    : 'border-transparent text-[#121212] hover:border-[#121212] hover:shadow-[2px_2px_0px_#121212]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 3 : 2} />
                <span className={`font-bold text-sm uppercase tracking-wider ${isActive ? '' : 'opacity-80'}`}>{item.name}</span>
                {item.badge ? (
                  <span className="ml-auto bg-[#D02020] text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-[#121212]">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-4 border-[#121212]">
          <button 
            onClick={() => { logout(); setSidebarOpen(false); navigate('/'); }}
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#121212] hover:bg-[#F0C020] transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b-4 border-[#121212] h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 hover:bg-[#F0F0F0] border-2 border-transparent hover:border-[#121212]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={3} />
            </button>
            <h1 className="font-black text-xl lg:text-2xl uppercase tracking-tight hidden sm:block">
              {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Nexus Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/notifications" className="relative group">
              <div className="w-10 h-10 border-2 border-[#121212] rounded-full flex items-center justify-center group-hover:bg-[#F0C020] transition-colors">
                <Bell className="w-5 h-5" strokeWidth={2.5} />
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D02020] border-2 border-[#121212] rounded-full" />
              )}
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-bold text-sm leading-none">{currentUser?.name}</span>
                <span className="text-xs uppercase font-medium tracking-widest opacity-60 mt-1">{profile.rollNo}</span>
              </div>
              <div className="w-12 h-12 bg-[#F0C020] border-4 border-[#121212] flex items-center justify-center font-black text-lg uppercase">
                {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0,2) : '??'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Breadcrumbs (Optional but requested) */}
          <div className="px-6 lg:px-10 py-4 hidden md:block">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest opacity-60">
              <span>Nexus</span>
              <ChevronRight className="w-4 h-4" />
              <span>{navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Home'}</span>
            </div>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}
