import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Heart, Lock, Check, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. No token provided.');
      setValidating(false);
      return;
    }

    // Token is present, allow user to proceed
    setValidToken(true);
    setValidating(false);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password,
      }, { timeout: 10000 });
      setSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.error || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const base = import.meta.env.BASE_URL || '/';
  const authBgImages = [
    `${base}hero-images/young-wedding-couple-enjoying-romantic-moments.jpg`,
  ];

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-primary-500 text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: `url(${authBgImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: `url(${authBgImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-500 text-white p-4 rounded-full">
              <Heart className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Vivaha</h1>
          <p className="text-white font-medium">Create a new password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
              <p className="text-gray-600">
                Your password has been successfully reset.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition"
              >
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
