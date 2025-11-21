import React from 'react';
import { Home, Camera, ShoppingBag, MessageCircle } from 'lucide-react';
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
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-forest-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-forest-light z-50 safe-area-bottom pb-1 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
              currentView === item.id 
                ? 'text-forest dark:text-lime' 
                : 'text-gray-400 dark:text-gray-500 hover:text-forest dark:hover:text-cream'
            }`}
          >
            <item.icon 
              size={24} 
              strokeWidth={currentView === item.id ? 2.5 : 2}
              className={`transition-transform duration-200 ${currentView === item.id ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
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
  ] as const;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-forest text-cream p-6 shadow-2xl z-50">
      <div className="flex items-center gap-3 mb-10">
         <div className="bg-lime p-2 rounded-lg">
           <Home size={24} className="text-forest-dark" />
         </div>
         <div>
            <h1 className="text-2xl font-bold tracking-tight">GreenDash</h1>
            <p className="text-xs text-lime opacity-80">Shamba Smart.</p>
         </div>
      </div>

      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-cream text-forest font-semibold shadow-lg scale-105' 
                : 'text-cream/70 hover:bg-forest-light hover:text-white'
            }`}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 bg-forest-dark rounded-xl border border-forest-light/30">
        <p className="text-xs text-center text-cream/50">Version 1.0.0 (Beta)</p>
      </div>
    </aside>
  );
};