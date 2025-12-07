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
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setSuccess(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const authError = err as AuthError;
      console.error("Google Login Error:", authError);
      
      if (authError?.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else if (authError?.code === 'auth/unauthorized-domain') {
        setError("Domain not allowed. Add your domain to Firebase authorized domains.");
      } else {
        setError(authError.message || "Failed to sign in with Google.");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
        setSuccess("Account created! Welcome to GreenDash! 🌱");
      } else {
        await signIn(formData.email, formData.password);
        setSuccess("Welcome back, farmer! 🌾");
      }
    } catch (err: unknown) {
      const authError = err as AuthError;
      console.error("Email Auth Error:", authError);
      
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
        setError(authError.message || "Authentication failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#051F10] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Clean Image & Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          {/* Branding */}
          <div className="text-center">
            <div className="inline-flex bg-forest dark:bg-lime p-3 rounded-2xl mb-3 shadow-lg transition-colors duration-300">
              <Sprout size={36} className="text-white dark:text-forest-dark" />
            </div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-forest dark:text-cream">Green</span>
              <span className="text-gold dark:text-gold-light">Dash</span>
            </h1>
            <p className="text-lg text-forest dark:text-lime font-medium">
              Shamba Smart. Harvest Strong.
            </p>
          </div>
          
          {/* Clean circular image */}
          <div className="relative w-80 h-80">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-forest/20 dark:border-lime/20 shadow-2xl transition-colors duration-300">
              <Image 
                src="/woman farmer.jpeg"
                alt="Kenyan Woman Farmer"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Text below */}
          <div className="text-center max-w-md">
            <h3 className="text-2xl font-bold mb-2 text-forest-dark dark:text-cream">Empowering Farmers</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base">
              Join thousands of Kenyan farmers using smart technology to grow better harvests
            </p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 transition-colors duration-300">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex bg-forest dark:bg-lime p-3 rounded-2xl mb-3 shadow-lg transition-colors duration-300">
                <Sprout size={28} className="text-white dark:text-forest-dark" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-forest dark:text-cream">Green</span>
                <span className="text-gold dark:text-gold-light">Dash</span>
              </h1>
              <p className="text-forest dark:text-lime text-sm mt-1 font-medium">Shamba Smart. Harvest Strong.</p>
            </div>

            {/* Tab Headers */}
            <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-white/10">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setSuccess(null);
                }}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  !isSignUp 
                    ? 'border-forest dark:border-lime text-forest dark:text-lime' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setSuccess(null);
                }}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  isSignUp 
                    ? 'border-forest dark:border-lime text-forest dark:text-lime' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Kamau"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-cream border border-gray-300 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-forest dark:focus:ring-lime focus:border-forest dark:focus:border-lime transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="farmer@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-cream border border-gray-300 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-forest dark:focus:ring-lime focus:border-forest dark:focus:border-lime transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-cream border border-gray-300 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-forest dark:focus:ring-lime focus:border-forest dark:focus:border-lime transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg text-xs border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2.5 rounded-lg text-xs border border-green-200 dark:border-green-800">
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white dark:bg-white/5 text-forest dark:text-lime text-sm font-semibold py-2.5 px-4 rounded-lg border-2 border-forest dark:border-lime hover:bg-forest dark:hover:bg-lime hover:text-white dark:hover:text-forest-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white dark:bg-white/5 text-gray-700 dark:text-cream text-sm font-semibold py-2.5 px-4 rounded-lg border-2 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9a8.997 8.997 0 0 0 .957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </form>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
              By continuing, you agree to help Kenyan agriculture grow. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};