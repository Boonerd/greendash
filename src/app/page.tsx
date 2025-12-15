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
import { CloudRain, Droplets, Camera, ShoppingBag, MessageCircle, Settings, LogOut, Sprout, Leaf, TrendingUp, CheckCircle } from 'lucide-react';
import Image from "next/image";

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');
  const [showSplash, setShowSplash] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowAbout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show about page
  if (showAbout) {
    return <AboutPage onGetStarted={() => setShowAbout(false)} />;
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-forest"></div>
      </div>
    );
  }

  // Show login if not authenticated
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
    <div className="min-h-screen bg-cream text-gray-800 font-sans">
      <DesktopSidebar currentView={view} setView={setView} lang={lang} />
      
      <main className="lg:ml-64 min-h-screen relative pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 px-6 py-4 bg-cream/95 backdrop-blur-md flex justify-between items-center border-b border-forest/10">
          <div className="flex items-center gap-3">
            <div className="bg-forest p-2 rounded-xl shadow-lg shadow-forest/20">
              <Sprout size={24} className="text-cream" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight leading-none ${view === 'home' ? 'block' : 'hidden lg:block'}`}>
                <span className="text-forest">Green</span>
                <span className="text-gold">Dash</span>
              </h1>
              <span className="text-[10px] uppercase lg:hidden block mt-0.5 text-gray-500 font-medium tracking-widest">Shamba Smart</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(l => l === 'en' ? 'sw' : 'en')}
              className="px-3 py-1.5 rounded-full bg-white border border-forest/20 text-xs font-bold transition-all hover:border-forest/40 hover:shadow-sm"
            >
              <span className={lang === 'en' ? 'text-forest' : 'text-gray-400'}>EN</span>
              <span className="mx-1 text-gray-300">|</span>
              <span className={lang === 'sw' ? 'text-forest' : 'text-gray-400'}>SW</span>
            </button>

            <button onClick={logout} className="p-2.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
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

// ============= SPLASH SCREEN =============
const SplashScreen: React.FC = () => (
  <div className="min-h-screen bg-linear-to-br from-forest via-[#1d4731] to-[#0d3d26] flex items-center justify-center overflow-hidden relative">
    {/* Animated background circles */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-lime/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cream/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
    
    <div className="relative z-10 text-center animate-fade-in">
      <div className="mb-8 flex justify-center">
        <div className="bg-cream/20 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-cream/30 animate-bounce" style={{ animationDuration: '2s' }}>
          <Sprout size={80} className="text-white" />
        </div>
      </div>
      
      <h1 className="text-7xl font-extrabold tracking-tight mb-4">
        <span className="text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]">Shamba</span>
        <span className="text-[#FFD700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.4)]"> Smart</span>
      </h1>
      
      <p className="text-white/90 text-xl font-light tracking-wide">Your Smart Farming Companion</p>
      
      <div className="mt-12 flex justify-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

// ============= ABOUT PAGE =============
const AboutPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <div className="min-h-screen bg-linear-to-br from-cream via-[#f7f3ed] to-[#faf8f4] overflow-y-auto">
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-forest/20 shadow-lg">
          <Sprout size={32} className="text-forest" />
          <h1 className="text-4xl font-extrabold">
            <span className="text-forest">Shamba</span>
            <span className="text-gold"> Smart</span>
          </h1>
        </div>
        
        <p className="text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
          Empowering farmers with AI-powered tools for smarter, more productive farming
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <FeatureCard 
          icon={<Camera size={32} />}
          title="Crop Disease Detection"
          description="Instantly identify plant diseases using AI-powered image recognition. Get treatment recommendations in seconds."
        />
        <FeatureCard 
          icon={<TrendingUp size={32} />}
          title="Market Prices"
          description="Real-time market prices for crops. Make informed decisions about when and where to sell your produce."
        />
        <FeatureCard 
          icon={<MessageCircle size={32} />}
          title="AgriChat Assistant"
          description="Get expert farming advice 24/7. Ask questions about planting, fertilizers, weather, and more."
        />
        <FeatureCard 
          icon={<Leaf size={32} />}
          title="Smart Recommendations"
          description="Personalized farming tips based on your location, crops, and current weather conditions."
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
        <StatCard number="10K+" label="Active Farmers" />
        <StatCard number="50+" label="Crop Types" />
        <StatCard number="95%" label="Accuracy" />
      </div>

      {/* CTA */}
      <div className="text-center animate-fade-in">
        <button 
          onClick={onGetStarted}
          className="bg-forest hover:bg-forest/90 text-white font-bold text-lg px-12 py-4 rounded-full shadow-2xl shadow-forest/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
        >
          Get Started
          <CheckCircle size={24} />
        </button>
        
        <p className="text-gray-600 text-sm mt-6">
          Join thousands of farmers already using Shamba Smart
        </p>
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white backdrop-blur-sm border border-forest/10 rounded-3xl p-8 hover:bg-white/80 transition-all hover:scale-105 hover:border-forest/30 hover:shadow-xl group">
    <div className="bg-forest/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-forest group-hover:bg-forest/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-forest mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StatCard: React.FC<{ number: string, label: string }> = ({ number, label }) => (
  <div className="bg-white backdrop-blur-sm border border-forest/10 rounded-2xl p-6 text-center hover:bg-white/80 transition-all hover:border-gold/50 hover:shadow-lg">
    <div className="text-4xl font-extrabold text-gold mb-2">{number}</div>
    <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">{label}</div>
  </div>
);

// ============= HOME DASHBOARD =============
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
      <section className="bg-white text-forest-dark rounded-[2.5rem] p-8 shadow-xl shadow-forest/10 border border-forest/10 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-8 transition-all hover:scale-[1.01] duration-500 group">
        
        {/* Decorative Background Blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Text Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full sm:w-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-forest/5 px-4 py-1.5 rounded-full text-xs font-bold mb-6 self-center sm:self-start text-forest uppercase tracking-wider shadow-sm border border-forest/10">
             <div className="w-2 h-2 rounded-full bg-lime animate-pulse"></div>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight text-forest-dark tracking-tight">
            {t.welcome}, <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-forest via-lime to-gold">
              {user.displayName?.split(' ')[0] || 'Farmer'}
            </span>
          </h2>
          
          <div className="mt-6 flex items-center justify-center sm:justify-start gap-5 bg-cream p-4 rounded-2xl self-center sm:self-start w-fit border border-forest/10 backdrop-blur-sm shadow-sm">
             <div className="bg-forest/5 p-3 rounded-full shadow-sm border border-forest/10">
                <CloudRain size={32} className="text-forest" />
             </div>
             <div className="text-left">
                <p className="text-3xl font-bold leading-none text-forest-dark">{MOCK_WEATHER.temp}°C</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{MOCK_WEATHER.condition}</p>
             </div>
             <div className="w-px h-10 bg-forest/10 mx-2"></div>
             <div className="text-left">
                <div className="flex items-center gap-1 text-blue-600">
                   <Droplets size={16} />
                   <span className="text-sm font-bold">{MOCK_WEATHER.rainChance}%</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Rain Chance</p>
             </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-600 max-w-md italic border-l-4 border-gold pl-4 py-1 bg-linear-to-r from-gold/10 to-transparent rounded-r-lg">
            &quot;{MOCK_WEATHER.advice[lang]}&quot;
          </p>
        </div>

        {/* Right: Image Content */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 mt-4 sm:mt-0 bg-linear-to-br from-gold/20 via-cream to-lime/20 rounded-full flex items-center justify-center border-4 border-white shadow-2xl shadow-forest/10 backdrop-blur-sm">
           <Image 
             src="/woman farmer.jpeg" 
             alt="Farmer"
             width={200}
             height={200}
             className="w-40 h-40 object-cover rounded-full transform hover:scale-110 transition-transform duration-500 drop-shadow-xl" 
             priority
           />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h3 className="text-lg font-bold text-forest-dark mb-5 flex items-center gap-3">
           {t.actions}
           <span className="h-px flex-1 bg-linear-to-r from-forest/20 to-transparent ml-2"></span>
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
      <section className="bg-white p-8 rounded-4xl border border-forest/10 shadow-lg shadow-forest/5">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-xl text-forest-dark flex items-center gap-2">
             <Sprout className="text-lime" />
             My Crops
           </h3>
           <button className="text-xs text-forest font-extrabold tracking-wide uppercase hover:underline flex items-center gap-1 hover:text-gold transition-colors">
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

// ============= ACTION CARD =============
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
    market: "bg-gold shadow-gold/30",
    chat: "bg-[#4A90E2] shadow-[#4A90E2]/30",
    settings: "bg-gray-600 shadow-gray-600/30"
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-4xl text-left transition-all active:scale-95 hover:shadow-xl hover:-translate-y-1 border border-forest/10 hover:border-forest/20 flex flex-col justify-between h-44 relative overflow-hidden group shadow-md shadow-forest/5"
    >
       <div className="z-10 relative h-full flex flex-col justify-between">
          <div className={`mb-3 p-3 w-fit rounded-2xl shadow-lg ${colors[icon]} transform group-hover:scale-110 transition-transform duration-300`}>
             {icons[icon]}
          </div>
          <div>
            <h4 className="font-bold text-xl leading-tight mb-1 text-gray-800 group-hover:text-forest transition-colors">{title}</h4>
            <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
          </div>
       </div>
       {/* Decorative BG shape */}
       <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-linear-to-br from-gold/10 to-lime/10 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
    </button>
  );
};

// ============= CROP STATUS ROW =============
const CropStatusRow: React.FC<{ name: string, stage: string, status: string, isWarning?: boolean }> = ({ name, stage, status, isWarning }) => (
  <div className="flex items-center justify-between p-5 bg-cream rounded-2xl border border-transparent hover:border-forest/20 transition-all cursor-pointer group">
     <div className="flex items-center gap-5">
       <div className={`w-2 h-12 rounded-full shadow-sm ${isWarning ? 'bg-gold shadow-gold/30' : 'bg-lime shadow-lime/30'}`}></div>
       <div>
         <p className="font-bold text-base text-gray-900 group-hover:text-forest transition-colors">{name}</p>
         <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">{stage}</p>
       </div>
     </div>
     <span className={`text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-full shadow-sm ${isWarning ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-lime/20 text-forest border border-lime/30'}`}>
       {status}
     </span>
  </div>
);

export default App;