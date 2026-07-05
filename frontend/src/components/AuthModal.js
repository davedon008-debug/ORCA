"use client";

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register } = useContext(AuthContext);
  const { t } = useLanguage();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
                type="password"
                placeholder={t('passwordLabel')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLoginView && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder={t('confirmPasswordLabel')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
            >
              {isLoginView ? t('signIn') : t('createAccount')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
            <button 
              onClick={() => { setIsLoginView(!isLoginView); setError(''); }} 
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
