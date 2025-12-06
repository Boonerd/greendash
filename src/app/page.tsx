"use client";
import React, { useState, useEffect } from 'react';
import { Nav, DesktopSidebar } from '../components/Nav';
import { CropDoctor } from '../components/CropDoctor';
import { MarketPlace } from '../components/MarketPlace';
import { AgriChat } from '../components/AgriChat';
import { Profile } from '../components/Profile';
import { Login } from '../components/Login';
import { useAuth, User } from '../context/AuthContext';
import { TRANSLATIONS, MOCK_WEATHER } from '../constants';
import { Language, View } from '../types';
import { Sun, CloudRain, Droplets, Moon, Camera, ShoppingBag, MessageCircle, Settings, LogOut, Sprout } from 'lucide-react';
import Image from "next/image";

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dark Mode Logic - Fixed version
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    
    if (newDarkState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#051F10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-forest"></div>
      </div>
    );
  }

  if (!user) return <Login />;

  const renderContent = () => {
    switch(view) {
      case 'scan': return <CropDoctor lang={lang} />;
      case 'market': return <MarketPlace lang={lang} />;
      case 'chat': return <AgriChat lang={lang} />;
      case 'profile': return <Profile lang={lang} />;
      default: return <HomeDashboard lang={lang} setView={setView} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#051F10] text-gray-800 dark:text-cream font-sans transition-colors duration-500">
      <DesktopSidebar currentView={view} setView={setView} lang={lang} />
      
      <main className="lg:ml-64 min-h-screen relative pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 px-6 py-4 bg-cream/90 dark:bg-[#051F10]/90 backdrop-blur-md flex justify-between items-center border-b border-gray-200 dark:border-white/5 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-forest dark:bg-cream p-2 rounded-xl shadow-lg shadow-forest/10 dark:shadow-none transition-colors">
              <Sprout size={24} className="text-white dark:text-forest" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight leading-none ${view === 'home' ? 'block' : 'hidden lg:block'}`}>
                <span className="text-forest dark:text-white">Green</span>
                <span className="text-gold dark:text-gold-light">Dash</span>
              </h1>
              <span className="text-[10px] uppercase lg:hidden block mt-0.5 text-gray-500 dark:text-gray-400 font-medium tracking-widest">Shamba Smart</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(l => l === 'en' ? 'sw' : 'en')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold transition-all hover:border-forest/30"
            >
              <span className={lang === 'en' ? 'text-forest dark:text-lime' : 'opacity-40'}>EN</span>
              <span className="mx-1 opacity-20">|</span>
              <span className={lang === 'sw' ? 'text-forest dark:text-lime' : 'opacity-40'}>SW</span>
            </button>

            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-forest/5 dark:bg-white/5 hover:bg-forest/10 dark:hover:bg-white/10 transition-colors text-forest dark:text-lime"
            >
              {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
            </button>

            <button onClick={logout} className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {renderContent()}
        </div>

        <Nav currentView={view} setView={setView} lang={lang} />
      </main>
    </div>
  );
};

interface HomeDashboardProps {
  lang: Language;
  setView: (v: View) => void;
  user: User;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ lang, setView, user }) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Welcome & Weather Hero */}
      <section className="bg-white dark:bg-white/5 text-forest-dark dark:text-cream rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-white/5 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-8 transition-all hover:scale-[1.01] duration-500 group">
        
        {/* Decorative Background Blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime/20 dark:bg-lime/5 rounded-full blur-3xl pointer-events-none group-hover:bg-lime/30 transition-colors duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-forest/5 dark:bg-forest/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Text Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full sm:w-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-forest/5 dark:bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold mb-6 self-center sm:self-start text-forest dark:text-lime uppercase tracking-wider shadow-sm border border-forest/5 dark:border-white/5">
             <div className="w-2 h-2 rounded-full bg-lime animate-pulse"></div>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight text-forest-dark dark:text-white tracking-tight">
            {t.welcome}, <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-forest to-lime dark:from-lime dark:to-white">{user.displayName?.split(' ')[0] || 'Farmer'}</span>
          </h2>
          
          <div className="mt-6 flex items-center justify-center sm:justify-start gap-5 bg-cream dark:bg-[#0a2e1a] p-4 rounded-2xl self-center sm:self-start w-fit border border-gray-100 dark:border-white/5 backdrop-blur-sm shadow-sm">
             <div className="bg-white dark:bg-white/10 p-3 rounded-full shadow-sm">
                <CloudRain size={32} className="text-forest dark:text-lime" />
             </div>
             <div className="text-left">
                <p className="text-3xl font-bold leading-none text-forest-dark dark:text-white">{MOCK_WEATHER.temp}°C</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mt-1">{MOCK_WEATHER.condition}</p>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-white/10 mx-2"></div>
             <div className="text-left">
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                   <Droplets size={16} />
                   <span className="text-sm font-bold">{MOCK_WEATHER.rainChance}%</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Rain Chance</p>
             </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-300 max-w-md italic border-l-4 border-lime pl-4 py-1 bg-linear-to-rrom-lime/10 to-transparent rounded-r-lg">
            &quot;{MOCK_WEATHER.advice[lang]}&quot;
          </p>
        </div>

        {/* Right: Image Content */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 mt-4 sm:mt-0 bg-linear-to-br from-cream to-white dark:from-white/5 dark:to-transparent rounded-full flex items-center justify-center border-4 border-white dark:border-white/10 shadow-2xl shadow-gray-200 dark:shadow-none backdrop-blur-sm">
           <Image 
             src="/Farmer-rafiki.svg" 
             alt="Farmer"
             width={200}
             height={200}
             className="w-40 h-40 object-contain transform hover:scale-110 transition-transform duration-500 drop-shadow-xl" 
             priority
           />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h3 className="text-lg font-bold text-forest-dark dark:text-cream mb-5 flex items-center gap-3">
           {t.actions}
           <span className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-white/10 ml-2"></span>
        </h3>
        <div className="grid grid-cols-2 gap-5">
           <ActionCard 
             icon="camera" 
             title={t.scan} 
             subtitle="Check diseases" 
             onClick={() => setView('scan')}
           />
           <ActionCard 
             icon="market" 
             title={t.market} 
             subtitle="Check prices" 
             onClick={() => setView('market')}
           />
           <ActionCard 
             icon="chat" 
             title={t.chat} 
             subtitle="Get advice" 
             onClick={() => setView('chat')}
           />
           <ActionCard 
             icon="settings" 
             title={t.nav_profile} 
             subtitle="Farm details" 
             onClick={() => setView('profile')}
           />
        </div>
      </section>

      {/* Crop Status Summary */}
      <section className="bg-white dark:bg-white/5 p-8 rounded-4xl border border-gray-100 dark:border-white/5 shadow-lg shadow-gray-100 dark:shadow-none transition-colors duration-300">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-xl text-forest-dark dark:text-cream flex items-center gap-2">
             <Sprout className="text-lime" />
             My Crops
           </h3>
           <button className="text-xs text-forest dark:text-lime font-extrabold tracking-wide uppercase hover:underline flex items-center gap-1">
             View All <span className="text-lg">→</span>
           </button>
         </div>
         <div className="space-y-4">
            <CropStatusRow name="Coffee (Batian)" stage="Flowering" status="Healthy" />
            <CropStatusRow name="Maize (H614)" stage="Maturing" status="Needs Water" isWarning />
         </div>
      </section>
    </div>
  );
};

interface ActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, onClick }) => {
  const icons: Record<string, React.ReactNode> = { 
    camera: <Camera size={28} className="text-white" />, 
    market: <ShoppingBag size={28} className="text-white" />, 
    chat: <MessageCircle size={28} className="text-white" />, 
    settings: <Settings size={28} className="text-white" /> 
  }; 
  
  const colors: Record<string, string> = {
    camera: "bg-forest shadow-forest/30",
    market: "bg-[#D4A373] shadow-[#D4A373]/30",
    chat: "bg-[#4A90E2] shadow-[#4A90E2]/30",
    settings: "bg-gray-600 shadow-gray-600/30"
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-white/5 p-6 rounded-4xl text-left transition-all active:scale-95 hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-white/5 flex flex-col justify-between h-44 relative overflow-hidden group shadow-md shadow-gray-100 dark:shadow-none"
    >
       <div className="z-10 relative h-full flex flex-col justify-between">
          <div className={`mb-3 p-3 w-fit rounded-2xl shadow-lg ${colors[icon]} transform group-hover:scale-110 transition-transform duration-300`}>
             {icons[icon]}
          </div>
          <div>
            <h4 className="font-bold text-xl leading-tight mb-1 text-gray-800 dark:text-cream">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtitle}</p>
          </div>
       </div>
       {/* Decorative BG shape */}
       <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
    </button>
  );
};

const CropStatusRow: React.FC<{ name: string, stage: string, status: string, isWarning?: boolean }> = ({ name, stage, status, isWarning }) => (
  <div className="flex items-center justify-between p-5 bg-cream dark:bg-black/20 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-pointer group">
     <div className="flex items-center gap-5">
       <div className={`w-2 h-12 rounded-full shadow-sm ${isWarning ? 'bg-amber-400 shadow-amber-400/30' : 'bg-lime shadow-lime/30'}`}></div>
       <div>
         <p className="font-bold text-base text-gray-900 dark:text-white group-hover:text-forest dark:group-hover:text-lime transition-colors">{name}</p>
         <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-0.5">{stage}</p>
       </div>
     </div>
     <span className={`text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-full shadow-sm ${isWarning ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'}`}>
       {status}
     </span>
  </div>
);

export default App;