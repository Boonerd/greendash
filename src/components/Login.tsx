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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Farmer Illustration & Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="bg-forest p-3 rounded-2xl shadow-lg">
                <Sprout size={36} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-forest">Green</span>
              <span className="text-gold">Dash</span>
            </h1>
            <p className="text-lg text-forest font-medium">
              Shamba Smart. Harvest Strong.
            </p>
          </div>
          
          <div className="w-full max-w-sm">
            <Image 
              src="/woman farmer.jpeg" 
              alt="Farmer" 
              width={400} 
              height={400}
              priority
              className="w-full h-auto drop-shadow-xl"
            />
          </div>
          
          <p className="text-gray-700 text-center max-w-md text-base">
            Join Kenyan farmers growing smarter with AI-powered crop insights, weather forecasts, and market prices.
          </p>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex bg-forest p-3 rounded-2xl mb-3 shadow-lg">
                <Sprout size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-forest">Green</span>
                <span className="text-gold">Dash</span>
              </h1>
              <p className="text-forest text-sm mt-1 font-medium">Shamba Smart. Harvest Strong.</p>
            </div>

            {/* Tab Headers - Strathmore Style */}
            <div className="flex gap-6 mb-6 border-b border-gray-200">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setSuccess(null);
                }}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  !isSignUp 
                    ? 'border-forest text-forest' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
                    ? 'border-forest text-forest' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Kamau"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-1 focus:ring-forest focus:border-forest transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="farmer@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-1 focus:ring-forest focus:border-forest transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-1 focus:ring-forest focus:border-forest transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="text-red-600 bg-red-50 p-2.5 rounded-lg text-xs border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-700 bg-green-50 p-2.5 rounded-lg text-xs border border-green-200">
                  {success}
                </div>
              )}

              {/* Strathmore-Style Buttons - Small & Clean */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-forest text-sm font-semibold py-2.5 px-4 rounded-lg border-2 border-forest hover:bg-forest hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

            <p className="text-xs text-center text-gray-500 mt-6">
              By continuing, you agree to help Kenyan agriculture grow. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};