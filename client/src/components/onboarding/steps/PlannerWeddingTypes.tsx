import { useState } from 'react';
import { Sparkles, Plus, X } from 'lucide-react';
import { OnboardingData } from '../Onboarding';

interface PlannerWeddingTypesProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerWeddingTypes({
  data,
  updateData,
  onNext,
  onBack,
}: PlannerWeddingTypesProps) {
  const [customCeremony, setCustomCeremony] = useState('');
  const [customInterfaith, setCustomInterfaith] = useState('');

  const weddingStyles = [
    'Interfaith',
    'Multicultural',
    'Religious',
    'Secular',
    'Destination',
    'Traditional',
    'Non-traditional',
  ];

  const ceremonyTypes = [
    'Hindu',
    'Muslim',
    'Christian',
    'Jewish',
    'Sikh',
    'Buddhist',
    'Jain',
    'Inter-cultural fusion',
  ];

  const interfaithCombinations = [
    'Hindu–Christian',
    'Hindu–Muslim',
    'Jewish–Christian',
    'Sikh–Hindu',
    'Muslim–Christian',
  ];

  const plannerData = data.plannerData || {};

  const toggleWeddingStyle = (style: string) => {
    const styles = plannerData.weddingStyles || [];
    if (styles.includes(style)) {
      updateData({
        plannerData: {
          ...plannerData,
          weddingStyles: styles.filter((s: string) => s !== style),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          weddingStyles: [...styles, style],
        },
      });
    }
  };

  const toggleCeremonyType = (type: string) => {
    const types = plannerData.ceremonyTypes || [];
    if (types.includes(type)) {
      updateData({
        plannerData: {
          ...plannerData,
          ceremonyTypes: types.filter((t: string) => t !== type),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          ceremonyTypes: [...types, type],
        },
      });
    }
  };

  const toggleInterfaithCombo = (combo: string) => {
    const combos = plannerData.interfaithSpecializations || [];
    if (combos.includes(combo)) {
      updateData({
        plannerData: {
          ...plannerData,
          interfaithSpecializations: combos.filter((c: string) => c !== combo),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          interfaithSpecializations: [...combos, combo],
        },
      });
    }
  };

  const addCustomCeremony = () => {
    if (customCeremony.trim()) {
      const types = plannerData.ceremonyTypes || [];
      updateData({
        plannerData: {
          ...plannerData,
          ceremonyTypes: [...types, customCeremony],
        },
      });
      setCustomCeremony('');
    }
  };

  const addCustomInterfaith = () => {
    if (customInterfaith.trim()) {
      const combos = plannerData.interfaithSpecializations || [];
      updateData({
        plannerData: {
          ...plannerData,
          interfaithSpecializations: [...combos, customInterfaith],
        },
      });
      setCustomInterfaith('');
    }
  };

  const removeCeremonyType = (type: string) => {
    updateData({
      plannerData: {
        ...plannerData,
        ceremonyTypes: (plannerData.ceremonyTypes || []).filter((t: string) => t !== type),
      },
    });
  };

  const removeInterfaithCombo = (combo: string) => {
    updateData({
      plannerData: {
        ...plannerData,
        interfaithSpecializations: (plannerData.interfaithSpecializations || []).filter((c: string) => c !== combo),
      },
    });
  };

  const handleNext = () => {
    if ((plannerData.weddingStyles || []).length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Wedding Types & Specialties</h2>
        <p className="text-gray-600">What wedding styles do you specialize in?</p>
      </div>

      <div className="space-y-8">
        {/* Wedding Styles */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Wedding Styles
          </label>
          {(plannerData.weddingStyles || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(plannerData.weddingStyles || []).map((style: string) => (
                <div
                  key={style}
                  className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                >
                  {style}
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {weddingStyles.map((style) => (
              <label
                key={style}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  (plannerData.weddingStyles || []).includes(style)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(plannerData.weddingStyles || []).includes(style)}
                  onChange={() => toggleWeddingStyle(style)}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <span className="ml-3 text-gray-900 font-medium">{style}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ceremony Types */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">Supported Ceremony Types</label>
          <div className="space-y-2">
            {ceremonyTypes.map((ceremony) => (
              <label
                key={ceremony}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  (plannerData.ceremonyTypes || []).includes(ceremony)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(plannerData.ceremonyTypes || []).includes(ceremony)}
                  onChange={() => toggleCeremonyType(ceremony)}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <span className="ml-3 text-gray-900 font-medium">{ceremony}</span>
              </label>
            ))}
          </div>

          {/* Add Custom Ceremony */}
          {(plannerData.ceremonyTypes || []).length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Add custom ceremony type</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCeremony}
                  onChange={(e) => setCustomCeremony(e.target.value)}
                  placeholder="e.g., Shinto, Wiccan..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addCustomCeremony();
                  }}
                />
                <button
                  onClick={addCustomCeremony}
                  className="px-3 py-2 bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-lg transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {plannerData.ceremonyTypes && plannerData.ceremonyTypes.length > ceremonyTypes.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {plannerData.ceremonyTypes.map((ceremony: string) => (
                    !ceremonyTypes.includes(ceremony) && (
                      <div
                        key={ceremony}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {ceremony}
                        <button
                          onClick={() => removeCeremonyType(ceremony)}
                          className="hover:text-purple-900 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multiple Ceremonies */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">Multiple Ceremonies Frequency</label>
          <div className="space-y-2">
            {['Rare', 'Occasionally', 'Frequently'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  plannerData.multipleCeremoniesFrequency === option
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="radio"
                  name="multipleCeremonies"
                  checked={plannerData.multipleCeremoniesFrequency === option}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        multipleCeremoniesFrequency: option,
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

        {/* Interfaith Specialization */}
        {(plannerData.weddingStyles || []).includes('Interfaith') && (
          <div className="space-y-4 bg-purple-50 p-6 rounded-xl border border-purple-200">
            <label className="block text-sm font-semibold text-gray-900">Interfaith Combinations</label>
            <div className="space-y-2">
              {interfaithCombinations.map((combo) => (
                <label
                  key={combo}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    (plannerData.interfaithSpecializations || []).includes(combo)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(plannerData.interfaithSpecializations || []).includes(combo)}
                    onChange={() => toggleInterfaithCombo(combo)}
                    className="w-4 h-4 text-pink-600 rounded"
                  />
                  <span className="ml-3 text-gray-900 font-medium">{combo}</span>
                </label>
              ))}
            </div>

            {/* Add Custom Interfaith */}
            <div className="pt-4 border-t border-purple-300">
              <p className="text-sm text-gray-600 mb-2">Add custom combination</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterfaith}
                  onChange={(e) => setCustomInterfaith(e.target.value)}
                  placeholder="e.g., Buddhist–Christian"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addCustomInterfaith();
                  }}
                />
                <button
                  onClick={addCustomInterfaith}
                  className="px-3 py-2 bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-lg transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {plannerData.interfaithSpecializations && plannerData.interfaithSpecializations.length > interfaithCombinations.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {plannerData.interfaithSpecializations.map((combo: string) => (
                    !interfaithCombinations.includes(combo) && (
                      <div
                        key={combo}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {combo}
                        <button
                          onClick={() => removeInterfaithCombo(combo)}
                          className="hover:text-purple-900 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Interfaith Sensitivity Level */}
            <div className="mt-6 space-y-3 bg-white p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-900">Interfaith Sensitivity Management</label>
              <div className="space-y-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-2 border rounded-lg cursor-pointer transition ${
                      plannerData.interfaithSensitivityLevel === option
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interfaithSensitivity"
                      checked={plannerData.interfaithSensitivityLevel === option}
                      onChange={() =>
                        updateData({
                          plannerData: {
                            ...plannerData,
                            interfaithSensitivityLevel: option,
                          },
                        })
                      }
                      className="w-4 h-4 text-pink-600"
                    />
                    <span className="ml-3 text-gray-900 font-medium text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
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
          disabled={(plannerData.weddingStyles || []).length === 0}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
