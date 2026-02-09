import React, { useState } from 'react';
import { X, Calendar, MapPin, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface CreateWeddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (workspace: any) => void;
}

const weddingTypes = [
  { id: 'secular', label: 'Secular', icon: '🎉' },
  { id: 'religious', label: 'Religious', icon: '⛪' },
  { id: 'interfaith', label: 'Interfaith', icon: '🤝' },
  { id: 'destination', label: 'Destination', icon: '✈️' },
  { id: 'other', label: 'Other', icon: '💫' },
];

export default function CreateWeddingModal({ isOpen, onClose, onSuccess }: CreateWeddingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weddingDate: '',
    weddingType: 'secular',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Wedding name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.weddingDate) newErrors.weddingDate = 'Wedding date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        setErrors({ submit: 'Authentication failed. Please log in again.' });
        setLoading(false);
        return;
      }

      console.log('Creating workspace with token:', token.slice(0, 20) + '...');
      const response = await axios.post(
        `${API_URL}/api/workspaces`,
        {
          name: formData.name,
          weddingDate: formData.weddingDate,
          weddingType: formData.weddingType,
          notes: formData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('✅ Workspace created successfully:', response.data);
      // Handle both response formats
      const workspace = response.data.workspace || response.data;
      if (!workspace) {
        throw new Error('No workspace in response');
      }
      
      // Save workspace to localStorage for quick access
      const workspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
      workspaces.unshift(workspace);
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
      localStorage.setItem('primaryWorkspaceId', workspace._id);
      
      onSuccess(workspace);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error creating workspace:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: `${API_URL}/api/workspaces`,
      });
      setErrors({ submit: error?.response?.data?.error || error?.message || 'Failed to create wedding workspace' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      weddingDate: '',
      weddingType: 'secular',
      notes: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Wedding</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 2</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white rounded-lg transition">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-600 h-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Wedding Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Ayesha & Ryan – Oct 2026"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                <p className="text-sm text-gray-500 mt-2">Give your wedding a memorable name</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  placeholder="Any special details or notes about this wedding..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Wedding Date *
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${
                    errors.weddingDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.weddingDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.weddingDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Wedding Type (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {weddingTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, weddingType: type.id }))}
                      className={`p-3 rounded-lg border-2 font-medium transition flex items-center justify-center gap-2 ${
                        formData.weddingType === type.id
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between gap-3">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
          {step === 1 ? (
            <button
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className="ml-auto px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-medium rounded-lg transition"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Wedding'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
