import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeBack() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Get user's first name from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const name = user.name || '';
        const first = name.split(' ')[0]; // Get first name
        setFirstName(first);
      }
    } catch (e) {
      console.error('Failed to get user name:', e);
    }

    // Start fade-in immediately
    setFadeIn(true);

    // Redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
      <div
        className={`text-center transition-opacity duration-1000 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-6">
          <span className="text-6xl">💕</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome Back{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Let's continue planning your perfect Vivaha...
        </p>
        <div className="flex justify-center">
          <div className="animate-pulse">
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
