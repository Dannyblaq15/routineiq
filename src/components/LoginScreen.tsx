'use client';

import { useState } from 'react';
import Image from 'next/image';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setIsLoggingIn(true);
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Simplify Firebase error messages
      let message = err.message || 'Authentication failed.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered. Please sign in.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') message = 'Invalid email or password.';
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      
      setError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] dark:bg-[#090d16] p-4 text-slate-900 dark:text-slate-100 selection:bg-teal-500/30">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[400px] w-full"
      >
        {/* Logo Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden"
          >
            <Image src="/icon-192.png" alt="RoutineIQ Logo" width={56} height={56} className="rounded-xl" />
          </motion.div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? 'Create an account' : 'Welcome to RoutineIQ'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            {isSignUp ? 'Sign up to build your autonomous skincare memory.' : 'Sign in to access your personalized AI agent.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-teal-900/5 dark:shadow-black/40 border border-slate-200/60 dark:border-slate-800 p-8">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/50"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3.5 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-teal-600/20"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3.5 px-4 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
        </div>

        {/* Toggle Mode */}
        <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <button 
            onClick={toggleMode}
            className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
