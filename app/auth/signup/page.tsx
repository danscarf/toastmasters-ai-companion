// app/auth/signup/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '../../../app/_lib/supabase'; // Import supabase client
import { useAuth } from '../../_providers/SupabaseAuthProvider';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(true); // Default to magic link
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const signupEnabled = process.env.NEXT_PUBLIC_ENABLE_SIGNUP === 'true';

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && session) {
      console.log('User already logged in, redirecting to home...');
      router.push('/');
    }
  }, [session, isLoading, router]);

  // Block signup page if signups are disabled
  if (!signupEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center space-y-4">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Signups Disabled</h1>
          <p className="text-gray-600 dark:text-gray-400">
            New account registration is currently disabled. Please contact an administrator for access.
          </p>
          <a 
            href="/auth/login" 
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't show signup form if already logged in (while redirecting)
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  const handleMagicLinkSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Magic link error:', error);
        setMessage(error.message);
      } else {
        setMessage('Check your email! We sent you a magic link to sign in.');
      }
    } catch (err) {
      console.error('Unexpected magic link error:', err);
      setMessage('An unexpected error occurred. Check the console for details.');
    }
    setLoading(false);
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Supabase sign-up error:', error);
        setMessage(error.message);
      } else {
        setMessage('Sign-up successful! Check your email for verification.');
      }
    } catch (err) {
      console.error('Unexpected error during sign-up:', err);
      setMessage('An unexpected error occurred. Check the console for details.');
    }
    setLoading(false);
  };

  const handleSignup = useMagicLink ? handleMagicLinkSignup : handlePasswordSignup;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white">Sign Up</h1>
        
        {/* Toggle between Magic Link and Password */}
        <div className="flex justify-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            type="button"
            onClick={() => setUseMagicLink(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              useMagicLink
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            ✉️ Magic Link
          </button>
          <button
            type="button"
            onClick={() => setUseMagicLink(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !useMagicLink
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🔑 Password
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm p-2 border"
              disabled={loading}
            />
          </div>
          {!useMagicLink && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm p-2 border"
                disabled={loading}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading 
              ? (useMagicLink ? 'Sending magic link...' : 'Signing Up...') 
              : (useMagicLink ? 'Send Magic Link' : 'Sign Up')
            }
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
        <div className="text-center text-sm mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
