'use client';
import { useState } from 'react';

export default function SetupPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sistem Kurulumu
        </h1>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleSetup}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium
            ${loading 
              ? 'bg-pink-300 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'
            } transition-colors`}
        >
          {loading ? 'Kuruluyor...' : 'Kurulumu Başlat'}
        </button>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Bu işlem ilk admin kullanıcısını oluşturacak
        </div>
      </div>
    </div>
  );
} 