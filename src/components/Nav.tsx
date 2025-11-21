import React from 'react';
import { Home, Camera, ShoppingBag, MessageCircle, User, Sprout } from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavProps {
  currentView: View;
  setView: (view: View) => void;
  lang: Language;
}

export const Nav: React.FC<NavProps> = ({ currentView, setView, lang }) => {
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'home', icon: Home, label: t.nav_home },
    { id: 'scan', icon: Camera, label: t.nav_scan },
    { id: 'market', icon: ShoppingBag, label: t.nav_market },
    { id: 'chat', icon: MessageCircle, label: t.nav_chat },
    { id: 'profile', icon: User, label: t.nav_profile },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-forest-dark border-t border-gray-100 dark:border-forest-light/20 z-50 safe-area-bottom pb-2 pt-1 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 group ${
              currentView === item.id 
                ? 'text-forest dark:text-lime' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {currentView === item.id && (
              <div className="absolute -top-1 w-8 h-1 bg-forest dark:bg-lime rounded-b-full shadow-[0_0_10px_rgba(46,125,50,0.5)] dark:shadow-[0_0_10px_rgba(192,202,51,0.5)]"></div>
            )}
            <item.icon 
              size={24} 
              strokeWidth={currentView === item.id ? 2.5 : 2}
              className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110 -translate-y-1' : 'group-hover:text-forest dark:group-hover:text-lime'}`}
            />
            <span className={`text-[10px] font-medium transition-all ${currentView === item.id ? 'opacity-100 font-bold' : 'opacity-60'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const DesktopSidebar: React.FC<NavProps> = ({ currentView, setView, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const navItems = [
    { id: 'home', icon: Home, label: t.nav_home },
    { id: 'scan', icon: Camera, label: t.nav_scan },
    { id: 'market', icon: ShoppingBag, label: t.nav_market },
    { id: 'chat', icon: MessageCircle, label: t.nav_chat },
    { id: 'profile', icon: User, label: t.nav_profile },
  ] as const;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-forest text-white p-6 shadow-2xl z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
         <div className="bg-lime p-2 rounded-xl shadow-lg shadow-lime/20 border border-lime/30">
           <Sprout size={24} className="text-forest-dark" />
         </div>
         <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none text-white">
              Green<span className="text-gold">Dash</span>
            </h1>
            <p className="text-[10px] text-lime/80 uppercase tracking-widest mt-1 font-bold">Shamba Smart</p>
         </div>
      </div>

      <div className="space-y-3 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-white text-forest font-bold shadow-xl translate-x-2 ring-2 ring-lime/50' 
                : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <item.icon size={22} className={currentView === item.id ? 'text-forest' : 'text-white/70 group-hover:text-lime transition-colors'} />
            <span className="tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-5 bg-forest-dark/40 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-lime animate-pulse shadow-[0_0_8px_rgba(192,202,51,0.8)]"></div>
          <p className="text-xs font-medium text-lime">System Online</p>
        </div>
        <p className="text-[10px] text-white/40 mt-1">v1.0.0</p>
      </div>
    </aside>
  );
};