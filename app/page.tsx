"use client";
import React, { useState, useEffect } from 'react';
import { Nav, DesktopSidebar } from '../components/Nav';
import { CropDoctor } from '../components/CropDoctor';
import { MarketPlace } from '../components/MarketPlace';
import { AgriChat } from '../components/AgriChat';
import { TRANSLATIONS, MOCK_WEATHER } from '../constants';
import { Language, View } from '../types';
import { Sun, CloudRain, Droplets, Moon, Camera, ShoppingBag, MessageCircle, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize theme
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = TRANSLATIONS[lang];

  const renderContent = () => {
    switch(view) {
      case 'scan': return <CropDoctor lang={lang} />;
      case 'market': return <MarketPlace lang={lang} />;
      case 'chat': return <AgriChat lang={lang} />;
      default: return <HomeDashboard lang={lang} setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-forest-dark transition-colors duration-300 font-sans">
      <DesktopSidebar currentView={view} setView={setView} lang={lang} />
      
      <main className="lg:ml-64 min-h-screen relative">
        {/* Header */}
        <header className="sticky top-0 z-40 px-6 py-4 bg-cream/80 dark:bg-forest-dark/80 backdrop-blur-md flex justify-between items-center border-b border-forest/5 dark:border-white/5">
           <div>
              <h1 className={`text-xl font-bold text-forest dark:text-cream ${view === 'home' ? 'block' : 'hidden lg:block'}`}>
                GreenDash
              </h1>
              <span className="text-xs text-lime font-medium tracking-wide lg:hidden">Shamba Smart.</span>
           </div>
           
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setLang((l: Language) => l === 'en' ? 'sw' : 'en')}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-forest dark:text-cream transition-colors"
               title="Switch Language"
             >
               <span className="font-bold text-sm">{lang === 'en' ? 'SW' : 'EN'}</span>
             </button>
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-forest dark:text-cream transition-colors"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
           </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-4xl mx-auto">
          {renderContent()}
        </div>

        <Nav currentView={view} setView={setView} lang={lang} />
      </main>
    </div>
  );
};

// Sub-components for Home Dashboard
const HomeDashboard: React.FC<{ lang: Language, setView: (v: View) => void }> = ({ lang, setView }) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="animate-fade-in space-y-8 pb-24">
      {/* Welcome & Weather Hero */}
      <section className="bg-forest text-cream rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-earth opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <p className="opacity-80 text-sm mb-1">{new Date().toLocaleDateString()}</p>
          <h2 className="text-3xl font-bold mb-6">{t.welcome}, Mama Sarah</h2>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <CloudRain size={48} className="text-lime animate-sway" />
                <div>
                   <p className="text-4xl font-bold">{MOCK_WEATHER.temp}°C</p>
                   <p className="text-sm opacity-90">{MOCK_WEATHER.condition}</p>
                </div>
             </div>
             
             <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Droplets size={16} className="text-blue-300" />
                  <span className="text-sm">{MOCK_WEATHER.rainChance}% Rain</span>
                </div>
                <p className="text-xs max-w-[150px] leading-tight text-lime">{MOCK_WEATHER.advice[lang]}</p>
             </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 sm:hidden">
              <p className="text-sm leading-tight text-lime">{MOCK_WEATHER.advice[lang]}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h3 className="text-lg font-bold text-forest dark:text-cream mb-4 flex items-center gap-2">
           {t.actions}
           <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-2"></span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
           <ActionCard 
             icon="camera" 
             title={t.scan} 
             subtitle="Check diseases" 
             color="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
             onClick={() => setView('scan')}
           />
           <ActionCard 
             icon="market" 
             title={t.market} 
             subtitle="Check prices" 
             color="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
             onClick={() => setView('market')}
           />
           <ActionCard 
             icon="chat" 
             title={t.chat} 
             subtitle="Get advice" 
             color="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
             onClick={() => setView('chat')}
           />
           <ActionCard 
             icon="settings" 
             title="Profile" 
             subtitle="Farm settings" 
             color="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
             onClick={() => {}}
           />
        </div>
      </section>

      {/* Crop Status Summary */}
      <section className="bg-white dark:bg-forest-light/10 p-5 rounded-2xl border border-forest/5 dark:border-white/5 shadow-sm">
         <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-forest dark:text-cream">My Crops</h3>
           <span className="text-xs text-lime cursor-pointer hover:underline">View All</span>
         </div>
         <div className="space-y-4">
            <CropStatusRow name="Coffee (Batian)" stage="Flowering" status="Healthy" />
            <CropStatusRow name="Maize (H614)" stage="Maturing" status="Needs Water" isWarning />
         </div>
      </section>
    </div>
  );
};

const ActionCard: React.FC<{ 
  icon: string, 
  title: string, 
  subtitle: string, 
  color: string,
  onClick: () => void 
}> = ({ icon, title, subtitle, color, onClick }) => {
  // Icon mapping
  const icons: Record<string, React.ReactNode> = { 
    camera: <Camera size={28} />, 
    market: <ShoppingBag size={28} />, 
    chat: <MessageCircle size={28} />, 
    settings: <Settings size={28} /> 
  }; 

  return (
    <button 
      onClick={onClick}
      className={`${color} p-4 rounded-2xl text-left transition-transform active:scale-95 hover:shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group`}
    >
       <div className="z-10 relative">
          <div className="mb-3 opacity-80">
             {icons[icon]}
          </div>
          <h4 className="font-bold text-lg leading-tight mb-1">{title}</h4>
          <p className="text-xs opacity-70 font-medium">{subtitle}</p>
       </div>
       <div className="absolute right-[-10px] bottom-[-10px] opacity-10 transform scale-150 group-hover:scale-175 transition-transform duration-500">
          {/* Abstract Shape Echoing Icon */}
          <div className="w-16 h-16 rounded-full bg-current"></div>
       </div>
    </button>
  );
};

const CropStatusRow: React.FC<{ name: string, stage: string, status: string, isWarning?: boolean }> = ({ name, stage, status, isWarning }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
     <div className="flex items-center gap-3">
       <div className={`w-2 h-10 rounded-full ${isWarning ? 'bg-amber-400' : 'bg-lime'}`}></div>
       <div>
         <p className="font-bold text-sm text-forest dark:text-cream">{name}</p>
         <p className="text-xs text-gray-500 dark:text-gray-400">{stage}</p>
       </div>
     </div>
     <span className={`text-xs font-bold px-2 py-1 rounded-full ${isWarning ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
       {status}
     </span>
  </div>
);

export default App;