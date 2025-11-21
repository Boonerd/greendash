import React from 'react';
import { useAuth } from "@/auth/AuthContext";
import { Sprout, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center p-6 text-cream relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-lime opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-earth opacity-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-forest-dark/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-lime p-4 rounded-2xl shadow-lg shadow-lime/20 animate-sway">
            <Sprout size={48} className="text-forest-dark" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">GreenDash</h1>
          <p className="text-lime/80 font-medium">Shamba Smart. Harvest Strong.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white text-forest-dark font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6"
            />
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
            {!loading && <ArrowRight size={18} className="opacity-50" />}
          </button>
          
          <p className="text-xs text-center text-white/40 mt-6">
            By continuing, you agree to help Kenyan agriculture grow.
          </p>
        </div>
      </div>
    </div>
  );
};
