import React, { useState, useEffect } from 'react';
import { User, MapPin, Ruler, Sprout, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS, COUNTIES, CROPS_LIST } from '../constants';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProfileProps {
  lang: Language;
}

export const Profile: React.FC<ProfileProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const { user } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || 'Farmer',
    phone: '',
    county: 'Kiambu',
    farmSize: '',
    crops: []
  });

  // Load data from Firestore
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Could not load your profile data.");
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadProfile();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    setError(null);

    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save changes. Check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCrop = (crop: string) => {
    if (profile.crops.includes(crop)) {
      setProfile({...profile, crops: profile.crops.filter(c => c !== crop)});
    } else {
      setProfile({...profile, crops: [...profile.crops, crop]});
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-forest" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-forest dark:text-cream">{t.profile}</h2>
        <span className="text-xs px-3 py-1 bg-gold/10 dark:bg-gold/20 text-amber-700 dark:text-gold-light rounded-full font-bold border border-gold/20">
          Premium Member
        </span>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-forest-light/10 p-6 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-white/5 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-forest to-lime flex items-center justify-center text-3xl font-bold text-white shadow-md">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-forest-dark dark:text-white">{profile.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">{user?.email}</p>
        </div>
      </div>

      {/* Farm Details Form */}
      <div className="bg-white dark:bg-forest-light/10 p-8 rounded-3xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-white/5 space-y-8">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="p-2 bg-cream rounded-lg dark:bg-forest-dark">
            <Sprout size={20} className="text-forest" />
          </div>
          <h3 className="text-lg font-bold text-forest dark:text-cream">{t.farm_details}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-forest dark:text-gray-300 flex items-center gap-2">
              <MapPin size={16} className="text-lime" />
              {t.location}
            </label>
            <div className="relative">
              <select 
                value={profile.county}
                onChange={(e) => setProfile({...profile, county: e.target.value})}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-forest-light/30 bg-gray-50 dark:bg-forest-dark/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime focus:border-lime outline-none appearance-none font-medium transition-all"
              >
                {COUNTIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Farm Size */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-forest dark:text-gray-300 flex items-center gap-2">
              <Ruler size={16} className="text-lime" />
              {t.size}
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={profile.farmSize}
                onChange={(e) => setProfile({...profile, farmSize: e.target.value})}
                placeholder="e.g. 2.5"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-forest-light/30 bg-gray-50 dark:bg-forest-dark/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime focus:border-lime outline-none font-medium transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase">Acres</span>
            </div>
          </div>

          {/* Phone */}
           <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-forest dark:text-gray-300 flex items-center gap-2">
              <User size={16} className="text-lime" />
              Phone Number
            </label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="+254..."
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-forest-light/30 bg-gray-50 dark:bg-forest-dark/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime focus:border-lime outline-none font-medium transition-all"
            />
          </div>
        </div>

        {/* Crops */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-forest dark:text-gray-300 flex items-center gap-2">
            <Sprout size={16} className="text-lime" />
            {t.crops_grown}
          </label>
          <div className="flex flex-wrap gap-2">
            {CROPS_LIST.map(crop => {
              const isSelected = profile.crops.includes(crop);
              return (
                <button
                  key={crop}
                  onClick={() => toggleCrop(crop)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 border ${
                    isSelected
                      ? 'bg-forest text-white border-forest shadow-md shadow-forest/20'
                      : 'bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-lime hover:text-lime'
                  }`}
                >
                  {crop}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button 
            onClick={handleSave} 
            isLoading={isSaving}
            className={`w-full flex items-center justify-center gap-2 transition-all py-4 ${isSaved ? 'bg-lime text-forest-dark' : ''}`}
          >
            {isSaved ? <><Check size={20} /> {t.saved}</> : <><Save size={20} /> {t.save}</>}
          </Button>
        </div>
      </div>
    </div>
  );
};