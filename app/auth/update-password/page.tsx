// app/auth/update-password/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../app/_lib/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for access_token in URL (Supabase redirects with it after email link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        // User is logged in, can proceed to update password
      } else if (event === 'SIGNED_OUT') {
        setMessage('Your session has expired or is invalid. Please restart the password reset process.');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Supabase default minimum password length
      setMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage(error.message);
    } else if (data) {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white">Set New Password</h1>
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
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
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm p-2 border"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
