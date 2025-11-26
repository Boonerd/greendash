import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, AlertCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
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
        setSuccess("Account created successfully! Welcome to GreenDash! 🌱");
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
        setError("No account found with this email. Sign up instead.");
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
    <div className="min-h-screen bg-linear-to-br from-green-50 via-cream to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Farmer Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-forest">Green</span>
              <span className="text-gold">Dash</span>
            </h2>
            <p className="text-2xl text-gray-600 font-medium">Shamba Smart. Harvest Strong.</p>
          </div>
          
          {/* Farmer SVG Illustration */}
          <div className="w-full max-w-md">
            <Image 
              src="/Farmer-rafiki.svg" 
              alt="Farmer illustration" 
              width={400} 
              height={400}
              priority
              className="w-full h-auto"
            />
          </div>
          
          <div className="mt-6 text-center max-w-md">
            <p className="text-gray-600 text-lg">
              Join thousands of Kenyan farmers managing their crops smarter with AI-powered insights.
            </p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex bg-forest p-3 rounded-2xl mb-3">
                <Sprout size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-forest">Green</span>
                <span className="text-gold">Dash</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">Shamba Smart. Harvest Strong.</p>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  !isSignUp 
                    ? 'bg-white text-forest shadow-sm' 
                    : 'text-gray-500 hover:text-forest'
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
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  isSignUp 
                    ? 'bg-white text-forest shadow-sm' 
                    : 'text-gray-500 hover:text-forest'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Kamau"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="farmer@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm border border-green-100">
                  <Sprout size={18} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-white font-bold py-3.5 rounded-xl hover:bg-forest-dark transition-all hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-98 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9a8.997 8.997 0 0 0 .957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-center text-gray-400 mt-6">
              By continuing, you agree to help Kenyan agriculture grow. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};