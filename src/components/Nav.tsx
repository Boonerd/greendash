// src/components/Nav.tsx
import React from 'react';
import { Home, Camera, ShoppingBag, MessageCircle, User, Sprout } from 'lucide-react';
import { GiWheat, GiCow, GiWateringCan } from "react-icons/gi";
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavProps {
  currentView: View;
  setView: (view: View) => void;
  lang: Language;
}

// Mobile bottom nav
export const Nav: React.FC<NavProps> = ({ currentView, setView, lang }) => {
  const t = TRANSLATIONS[lang];
  const items = [
    { id: 'home', icon: Home, label: t.nav_home },
    { id: 'scan', icon: Camera, label: t.nav_scan },
    { id: 'market', icon: ShoppingBag, label: t.nav_market },
    { id: 'chat', icon: MessageCircle, label: t.nav_chat },
    { id: 'profile', icon: User, label: t.nav_profile },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream dark:bg-[#0b180b] border-t border-gray-200 dark:border-white/10 z-50 lg:hidden">
      <div className="flex justify-around py-2">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              currentView === id ? 'text-forest dark:text-lime' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Desktop sidebar (already perfect)
export const DesktopSidebar: React.FC<NavProps> = ({ currentView, setView, lang }) => {
  const t = TRANSLATIONS[lang];
  const items = [
    { id: 'home', icon: GiWheat, label: t.nav_home },
    { id: 'scan', icon: Camera, label: t.nav_scan },
    { id: 'market', icon: ShoppingBag, label: t.nav_market },
    { id: 'chat', icon: GiCow, label: t.nav_chat },
    { id: 'profile', icon: GiWateringCan, label: t.nav_profile },
  ] as const;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-cream dark:bg-[#0b180b] text-gray-900 dark:text-cream p-6 border-r border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-forest dark:bg-lime p-3 rounded-xl">
          <Sprout size={28} className="text-cream dark:text-forest" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-forest dark:text-white">Green<span className="text-gold">Dash</span></h1>
          <p className="text-xs font-bold text-forest-light dark:text-lime uppercase">Shamba Smart</p>
        </div>
      </div>

      <nav className="space-y-3 flex-1">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all ${
              currentView === id
                ? 'bg-forest text-cream shadow-xl translate-x-2'
                : 'hover:bg-forest/10 dark:hover:bg-white/10 text-gray-700 dark:text-cream/70'
            }`}
          >
            <Icon size={24} className={currentView === id ? 'text-cream' : ''} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-forest/10 dark:bg-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-lime animate-pulse"></div>
          <p className="text-sm font-bold text-forest dark:text-lime">System Online</p>
        </div>
      </div>
    </aside>
  );
};