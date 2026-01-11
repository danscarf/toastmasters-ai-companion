// app/auth/reset-password/page.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '../../../app/_lib/supabase'; // Import supabase client

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`, // URL to redirect to after password reset
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white">Reset Password</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
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
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-500">{message}</p>
        )}
        <div className="text-center text-sm mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Remembered your password?{' '}
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
