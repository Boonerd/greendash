import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-forest-dark relative overflow-hidden">
      
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl animate-fade-in flex flex-col items-center">
        <div className="mb-8">
          <div className="bg-forest p-4 rounded-2xl shadow-lg shadow-forest/20 animate-sway">
            <Sprout size={40} className="text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="text-forest">Green</span><span className="text-gold">Dash</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Shamba Smart. Harvest Strong.</p>
        </div>

        <div className="space-y-6 w-full flex flex-col items-center">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="group relative bg-forest text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 hover:bg-forest-dark transition-all hover:shadow-xl active:scale-95 disabled:opacity-50 w-full justify-center"
          >
            <div className="bg-white p-1 rounded-full">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                width="18"
                height="18"
                className="w-4 h-4 flex-shrink-0"
              />
            </div>
            <span className="text-base tracking-wide">{loading ? "Connecting..." : "Sign in with Google"}</span>
          </button>
          
          <p className="text-xs text-center text-gray-400 max-w-xs">
            By continuing, you agree to help Kenyan agriculture grow.
          </p>
        </div>
      </div>
    </div>
  );
};