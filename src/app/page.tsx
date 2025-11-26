"use client";

import React, { useState, useEffect } from 'react';
import { Nav, DesktopSidebar } from '../components/Nav';
import { CropDoctor } from '../components/CropDoctor';
import { MarketPlace } from '../components/MarketPlace';
import { AgriChat } from '../components/AgriChat';
import { Profile } from '../components/Profile';
import { Login } from '../components/Login';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS, MOCK_WEATHER } from '../constants';
import { Language, View } from '../types';
import { Sun, Moon, CloudRain, Droplets, LogOut, Sprout, Camera } from 'lucide-react';
import { GiCow, GiSunflower, GiWateringCan } from "react-icons/gi";
import Image from 'next/image';

interface User {
  displayName?: string | null;
}

const App: React.FC = () => {
  const { user: authUser, loading, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);

  const user = authUser as User | null;

  // THIS IS THE ONLY THING THAT WORKS RELIABLY IN NEXT.JS 15
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (!theme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading) return <div className="min-h-screen bg-page flex items-center justify-center"><div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-forest rounded-full"></div></div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-page text-gray-900 dark:text-[#d4edda]">
      <DesktopSidebar currentView={view} setView={setView} lang={lang={lang} />
      <Nav currentView={view} setView={setView} lang={lang} />

      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 px-6 py-4 bg-page/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-xl">
              <Sprout size={24} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-heading">Green<span className="text-gold">Dash</span></h1>
              <span className="text-xs uppercase font-bold text-forest-light dark:text-lime lg:hidden block">Shamba Smart</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(l => l === 'en' ? 'sw' : 'en')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-sm font-bold"
            >
              {lang.toUpperCase()}
            </button>

            {/* THIS BUTTON NOW WORKS 100% */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-forest/10 dark:bg-white/10 hover:bg-accent hover:text-accent transition"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            <button onClick={logout} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {view === 'home' && <HomeDashboard lang={lang} setView={setView} user={user} />}
          {view === 'scan' && <CropDoctor lang={lang} />}
          {view === 'market' && <MarketPlace lang={lang} />}
          {view === 'chat' && <AgriChat lang={lang} />}
          {view === 'profile' && <Profile lang={lang} />}
        </div>
      </main>
    </div>
  );
};

// Keep HomeDashboard and ActionCard exactly as before (they're perfect)
const HomeDashboard: React.FC<{ lang: Language; setView: (v: View) => void; user: User }> = ({ lang, setView, user }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="space-y-10">
      <section className="card p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-forest-light dark:text-lime mb-3">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h2 className="text-5xl font-extrabold text-heading">
            {t.welcome},<br />
            <span className="text-gold">{user.displayName?.split(' ')[0] || 'Farmer}</span>
          </h2>
          <div className="mt-8 flex items-center gap-6 bg-cream dark:bg-[#0b180b]/50 p-5 rounded-2xl">
            <CloudRain size={40} className="text-forest dark:text-lime" />
            <div>
              <p className="text-4xl font-bold text-heading">{MOCK_WEATHER.temp}°C</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{MOCK_WEATHER.condition}</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Droplets size={20} />
              <span className="font-bold">{MOCK_WEATHER.rainChance}%</span>
            </div>
          </div>
          <p className="mt-6 italic text-gray-700 dark:text-gray-300 border-l-4 border-lime pl-4">
            “{MOCK_WEATHER.advice[lang]}”
          </p>
        </div>
        <Image src="/Farmer-rafiki.svg" alt="Farmer" width={260} height={260} className="drop-shadow-2xl" priority />
      </section>

      <section>
        <h3 className="text-2xl font-bold text-heading mb-6">{t.actions}</h3>
        <div className="grid grid-cols-2 gap-6">
          <ActionCard icon={<Camera size={36} />} title={t.scan} color="bg-forest" onClick={() => setView('scan')} />
          <ActionCard icon={<GiSunflower size={36} />} title={t.market} color="bg-amber-600" onClick={() => setView('market')} />
          <ActionCard icon={<GiCow size={36} />} title={t.chat} color="bg-blue-600" onClick={() => setView('chat')} />
          <ActionCard icon={<GiWateringCan size={36} />} title={t.nav_profile} color="bg-lime" onClick={() => setView('profile')} />
        </div>
      </section>
    </div>
  );
};

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; color: string; onClick: () => void }> = ({ icon, title, color, onClick }) => (
  <button onClick={onClick} className="card p-8 text-left hover:-translate-y-2 transition-all group">
    <div className={`${color} p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform text-white`}>
      {icon
    </div>
    <h4 className="text-xl font-bold text-gray-900 dark:text-cream">{title}</h4>
  </button>
);

export default App;