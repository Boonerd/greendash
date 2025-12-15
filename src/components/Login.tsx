"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface AuthError {
  code?: string;
  message?: string;
}

export const Login: React.FC = () => {
  const { signInWithGoogle, signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const authError = err as AuthError;
      if (authError?.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isSignUp && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err: unknown) {
      const authError = err as AuthError;
      
      if (authError?.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Try signing in instead.");
      } else if (authError?.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      } else if (authError?.code === 'auth/user-not-found') {
        setError("No account found. Sign up instead.");
      } else if (authError?.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else if (authError?.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-[#faf8f4] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 items-stretch rounded-3xl overflow-hidden shadow-2xl bg-white">
        
        {/* Left Side - Hero */}
        <div className="hidden lg:flex flex-col items-center justify-center relative bg-gradient-to-br from-forest to-[#0d3d26] p-12 overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-lime/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            <div className="bg-lime/20 backdrop-blur-sm p-4 rounded-2xl mb-6 border border-lime/30 shadow-lg">
               <Sprout size={48} className="text-white" />
            </div>

            <div className="relative w-72 h-72 mb-8 group">
                <div className="absolute inset-0 rounded-full border-2 border-lime/40 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 scale-110 animate-pulse"></div>
                
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                   <Image 
                     src="/Tea-farmer.png"
                     alt="Tea Farmer"
                     fill
                     className="object-cover group-hover:scale-110 transition-transform duration-700"
                     priority
                   />
                </div>

                <div className="absolute -top-2 -right-2 bg-gold text-forest-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce" style={{ animationDuration: '3s' }}>
                   🌾 5K+ Farmers
                </div>
                <div className="absolute -bottom-2 -left-2 bg-lime text-forest-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
                   ⭐ 4.8/5 Rating
                </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              <span className="text-white">Shamba</span>{' '}
              <span className="text-gold">Smart</span>
            </h2>
            <p className="text-cream/80 text-base leading-relaxed max-w-sm text-center">
              Join thousands of farmers growing smarter with AI-powered crop diagnosis, 
              real-time market prices, and expert agricultural guidance.
            </p>

            <div className="flex gap-2 mt-8 flex-wrap justify-center">
              <span className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">📊 Market Insights</span>
              <span className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">🤖 AI Diagnosis</span>
              <span className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">💬 Expert Chat</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            
            <div className="lg:hidden text-center mb-8">
               <div className="inline-block p-3 bg-gradient-to-br from-forest to-lime rounded-2xl mb-3 shadow-lg">
                 <Sprout size={28} className="text-white" />
               </div>
               <h1 className="text-2xl font-bold mb-1">
                 <span className="text-forest">Shamba</span>{' '}
                 <span className="text-gold">Smart</span>
               </h1>
            </div>

            <div className="mb-8">
               <h2 className="text-3xl font-bold text-forest mb-2">
                 {isSignUp ? "Join Us Today" : "Welcome Back"}
               </h2>
               <p className="text-sm text-gray-600">
                 {isSignUp ? "Create your account and start farming smarter." : "Sign in to access your dashboard."}
               </p>
            </div>

            <div className="flex gap-2 mb-8">
               <button
                 onClick={() => { setIsSignUp(false); setError(null); }}
                 className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                   !isSignUp 
                     ? 'bg-forest text-white shadow-lg' 
                     : 'bg-cream text-gray-600 hover:bg-cream/80'
                 }`}
               >
                 Sign In
               </button>
               <button
                 onClick={() => { setIsSignUp(true); setError(null); }}
                 className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                   isSignUp 
                     ? 'bg-forest text-white shadow-lg' 
                     : 'bg-cream text-gray-600 hover:bg-cream/80'
                 }`}
               >
                 Sign Up
               </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-forest mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Kamau"
                      className="w-full pl-12 pr-4 py-3.5 bg-cream border-2 border-forest/20 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-forest outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-forest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="farmer@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-cream border-2 border-forest/20 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-forest outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-cream border-2 border-forest/20 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-forest outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border-2 border-red-200 flex gap-3 items-start">
                   <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                   <span className="flex-1">{error}</span>
                </div>
              )}

              <div className="pt-2 space-y-3">
                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-forest to-forest-light text-white text-base font-bold py-4 rounded-xl hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                    {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                 </button>

                 <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t-2 border-gray-100"></div>
                    <span className="shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Or</span>
                    <div className="flex-grow border-t-2 border-gray-100"></div>
                 </div>

                 <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-gray-700 text-base font-bold py-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-forest/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                 >
                    <svg width="20" height="20" viewBox="0 0 18 18">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9a8.997 8.997 0 0 0 .957 4.042l3.007-2.332z" fill="#FBBC05" />
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Google
                 </button>
              </div>
            </form>
          </div>
          
          <div className="mt-10 text-center">
             <p className="text-xs text-gray-400">© 2025 Shamba Smart. Empowering Farmers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};