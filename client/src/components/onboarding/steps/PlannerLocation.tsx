import { useState, useEffect } from 'react';
import { MapPin, Plus, X, Loader } from 'lucide-react';
import { OnboardingData } from '../Onboarding';

interface PlannerLocationProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerLocation({ data, updateData, onNext, onBack }: PlannerLocationProps) {
  const [customRegion, setCustomRegion] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(true);

  // Auto-detect location on mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      if (!navigator.geolocation) {
        setDetectingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use OpenStreetMap Nominatim for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const locationData = await response.json();

            if (locationData.address) {
              const city = locationData.address.city || locationData.address.town || locationData.address.village || '';
              const state = locationData.address.state || '';
              const country = locationData.address.country || 'United States';

              if (city && state) {
                updateData({
                  plannerData: {
                    ...data.plannerData,
                    baseCity: city,
                    baseState: state,
                    baseCountry: country,
                  },
                });
              }
            }
          } catch (err) {
            console.error('Geocoding error:', err);
          } finally {
            setDetectingLocation(false);
          }
        },
        (err) => {
          console.log('Location detection declined or unavailable');
          setDetectingLocation(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } catch (err) {
      console.error('Error detecting location:', err);
      setDetectingLocation(false);
    }
  }

  const serviceRegions = [
    'Northeast US',
    'Southeast US',
    'Midwest US',
    'West Coast US',
    'International',
  ];

  const toggleServiceRegion = (region: string) => {
    const plannerData = data.plannerData || {};
    const regions = plannerData.serviceRegions || [];
    if (regions.includes(region)) {
      updateData({
        plannerData: {
          ...plannerData,
          serviceRegions: regions.filter(r => r !== region),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          serviceRegions: [...regions, region],
        },
      });
    }
  };

  const addCustomRegion = () => {
    if (customRegion.trim()) {
      const plannerData = data.plannerData || {};
      const regions = plannerData.serviceRegions || [];
      updateData({
        plannerData: {
          ...plannerData,
          serviceRegions: [...regions, customRegion],
        },
      });
      setCustomRegion('');
    }
  };

  const removeRegion = (region: string) => {
    const plannerData = data.plannerData || {};
    updateData({
      plannerData: {
        ...plannerData,
        serviceRegions: (plannerData.serviceRegions || []).filter(r => r !== region),
      },
    });
  };

  const handleNext = () => {
    const plannerData = data.plannerData || {};
    if (plannerData.baseCity && plannerData.baseState && (plannerData.serviceRegions || []).length > 0) {
      onNext();
    }
  };

  const plannerData = data.plannerData || {};

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Where are you based?</h2>
        <p className="text-gray-600">Help us understand your service area</p>
      </div>

      <div className="space-y-6">
        {/* Base Location */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <MapPin className="w-4 h-4 inline mr-2" />
            Your Base Location
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={plannerData.baseCity || ''}
              onChange={(e) =>
                updateData({
                  plannerData: { ...plannerData, baseCity: e.target.value },
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="State / Region"
              value={plannerData.baseState || ''}
              onChange={(e) =>
                updateData({
                  plannerData: { ...plannerData, baseState: e.target.value },
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Country"
            value={plannerData.baseCountry || ''}
            onChange={(e) =>
              updateData({
                plannerData: { ...plannerData, baseCountry: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Service Regions */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">Which regions do you serve?</label>

          <div className="space-y-2">
            {serviceRegions.map((region) => (
              <label
                key={region}
                className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={(plannerData.serviceRegions || []).includes(region)}
                  onChange={() => toggleServiceRegion(region)}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <span className="ml-3 text-gray-900 font-medium">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Region */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Add custom region (optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Caribbean Islands"
              value={customRegion}
              onChange={(e) => setCustomRegion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') addCustomRegion();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
            <button
              onClick={addCustomRegion}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Regions */}
        {(plannerData.serviceRegions || []).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Selected regions:</p>
            <div className="flex flex-wrap gap-2">
              {(plannerData.serviceRegions || []).map((region) => (
                <div
                  key={region}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                >
                  {region}
                  <button
                    onClick={() => removeRegion(region)}
                    className="hover:text-pink-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Destination Weddings */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Do you plan destination weddings?</label>
          <div className="space-y-2">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition">
                <input
                  type="radio"
                  name="destination"
                  checked={plannerData.destinationWeddings === (option === 'Yes')}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        destinationWeddings: option === 'Yes',
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!plannerData.baseCity || !plannerData.baseState || (plannerData.serviceRegions || []).length === 0}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
