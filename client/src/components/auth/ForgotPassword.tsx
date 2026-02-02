import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Mail, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email }, { timeout: 10000 });
      setSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const base = import.meta.env.BASE_URL || '/';
  const authBgImages = [
    `${base}hero-images/young-wedding-couple-enjoying-romantic-moments.jpg`,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: `url(${authBgImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-left mb-4">
            <button onClick={() => navigate('/login')} className="text-lg text-white font-medium hover:underline flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-primary-500 text-white p-4 rounded-full">
              <Heart className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Vivaha</h1>
          <p className="text-white font-medium">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">📧</div>
              <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
