import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login Page Error:", err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else if (err?.code === 'auth/configuration-not-found') {
        setError("Firebase authentication is not configured correctly.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-forest-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2E7D32 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl animate-fade-in flex flex-col items-center z-10">
        <div className="mb-8">
          <div className="bg-forest p-4 rounded-2xl shadow-lg shadow-forest/20 animate-sway">
            <Sprout size={40} className="text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="text-forest">Green</span><span className="text-gold">Dash</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide uppercase">Shamba Smart. Harvest Strong.</p>
        </div>

        <div className="space-y-6 w-full flex flex-col items-center">
          <button
            onClick={handleLogin}
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
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-medium border border-red-100 max-w-xs w-full">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
          
          <p className="text-xs text-center text-gray-400 max-w-xs">
            By continuing, you agree to help Kenyan agriculture grow.
          </p>
        </div>
      </div>
    </div>
  );
};