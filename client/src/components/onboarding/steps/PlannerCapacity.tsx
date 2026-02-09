import { Users, Calendar } from 'lucide-react';
import { OnboardingData } from '../Onboarding';

interface PlannerCapacityProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerCapacity({
  data,
  updateData,
  onNext,
  onBack,
}: PlannerCapacityProps) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const plannerData = data.plannerData || {};

  const toggleMonth = (month: string) => {
    const unavailable = plannerData.unavailableMonths || [];
    if (unavailable.includes(month)) {
      updateData({
        plannerData: {
          ...plannerData,
          unavailableMonths: unavailable.filter(m => m !== month),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          unavailableMonths: [...unavailable, month],
        },
      });
    }
  };

  const handleNext = () => {
    if (plannerData.weddingsPerYear) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Availability & Capacity</h2>
        <p className="text-gray-600">Help us understand your bandwidth</p>
      </div>

      <div className="space-y-8">
        {/* Weddings Per Year */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <Users className="w-4 h-4 inline mr-2" />
            How many weddings can you handle at one time?
          </label>
          <div className="space-y-2">
            {['1–3', '4–6', '7–10', '10+'].map((option) => (
              <label
                key={option}
                className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="capacity"
                  checked={plannerData.weddingsPerYear === option}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        weddingsPerYear: option,
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{option} weddings</span>
              </label>
            ))}
          </div>
        </div>

        {/* Unavailable Months */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <Calendar className="w-4 h-4 inline mr-2" />
            Which months are you typically unavailable?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <label
                key={month}
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition ${
                  (plannerData.unavailableMonths || []).includes(month)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(plannerData.unavailableMonths || []).includes(month)}
                  onChange={() => toggleMonth(month)}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-900 font-medium">{month.slice(0, 3)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Days */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            Which days do you work events?
          </label>
          <div className="space-y-2">
            {['Weekdays', 'Weekends', 'Both'].map((option) => (
              <label
                key={option}
                className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="workDays"
                  checked={plannerData.workDays === option}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        workDays: option,
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
          disabled={!plannerData.weddingsPerYear}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
