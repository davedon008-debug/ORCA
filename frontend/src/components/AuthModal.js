"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register, loginWithGoogle } = useContext(AuthContext);
  const { t } = useLanguage();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Load Google Client SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize and Render Google Sign In Button
  useEffect(() => {
    const handleGoogleLoginSuccess = async (response) => {
      setError('');
      const idToken = response.credential;
      try {
        await loginWithGoogle(idToken);
        setAuthModalOpen(false);
        router.refresh();
      } catch (err) {
        setError(err.response?.data?.message || 'Google Authentication failed.');
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google && isAuthModalOpen) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
          return;
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLoginSuccess,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large', width: 380, shape: 'pill' }
        );
      }
    };

    if (isAuthModalOpen) {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        const interval = setInterval(() => {
          if (window.google) {
            initializeGoogleSignIn();
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginView) {
        await login(email, password);
        setAuthModalOpen(false);
        router.refresh();
      } else {
        if (password !== confirmPassword) {
          setError(t('passwordsDoNotMatch'));
          return;
        }
        await register(name, email, password);
        setAuthModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span className="font-outfit font-bold text-white text-3xl">B</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-outfit tracking-tight">
              {isLoginView ? t('welcomeBack') : t('joinBIGDON')}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLoginView ? t('welcomeBackSub') : t('joinBIGDONSub')}
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-medium text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('fullName')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder={t('emailAddress')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('passwordLabel')}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLoginView && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPasswordLabel')}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
            >
              {isLoginView ? t('signIn') : t('createAccount')}
            </button>
          </form>

          {/* Google Sign In Divider & Button */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div id="googleSignInButton" className="w-full flex justify-center mt-4"></div>

          <div className="mt-8 text-center text-sm text-gray-600">
            {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
            <button 
              onClick={() => { setIsLoginView(!isLoginView); setError(''); setShowPassword(false); setShowConfirmPassword(false); }} 
              className="font-bold text-blue-600 hover:text-indigo-600 hover:underline transition-colors focus:outline-none"
            >
              {isLoginView ? t('signUp') : t('logIn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
