import { MessageSquare, Bell } from 'lucide-react';
import { OnboardingData } from '../Onboarding';

interface PlannerCommunicationProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerCommunication({
  data,
  updateData,
  onNext,
  onBack,
}: PlannerCommunicationProps) {
  const plannerData = data.plannerData || {};
  const communicationPrefs = plannerData.communicationPreferences || {};

  const handleNext = () => {
    if (communicationPrefs.preferredMethod && communicationPrefs.reminderFrequency) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Communication Preferences</h2>
        <p className="text-gray-600">How do you want to stay connected?</p>
      </div>

      <div className="space-y-8">
        {/* Preferred Communication Method */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Preferred Communication Method
          </label>
          <div className="space-y-2">
            {['Email', 'SMS', 'In-app notifications', 'All'].map((method) => (
              <label
                key={method}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  communicationPrefs.preferredMethod === method
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="radio"
                  name="communicationMethod"
                  checked={communicationPrefs.preferredMethod === method}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        communicationPreferences: {
                          ...communicationPrefs,
                          preferredMethod: method,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reminder Frequency */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <Bell className="w-4 h-4 inline mr-2" />
            How often would you like reminders?
          </label>
          <div className="space-y-2">
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'biweekly', label: 'Bi-weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'asneeded', label: 'As needed' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  communicationPrefs.reminderFrequency === option.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="radio"
                  name="reminderFrequency"
                  checked={communicationPrefs.reminderFrequency === option.value}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        communicationPreferences: {
                          ...communicationPrefs,
                          reminderFrequency: option.value,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Response Time */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            Typical Response Time
          </label>
          <div className="space-y-2">
            {[
              { value: 'sameday', label: 'Same day' },
              { value: '24hours', label: 'Within 24 hours' },
              { value: '2-3days', label: '2-3 business days' },
              { value: 'asscheduled', label: 'As scheduled' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  communicationPrefs.responseTime === option.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="radio"
                  name="responseTime"
                  checked={communicationPrefs.responseTime === option.value}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        communicationPreferences: {
                          ...communicationPrefs,
                          responseTime: option.value,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule Meetings Toggle */}
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-pink-50 transition">
            <input
              type="checkbox"
              checked={communicationPrefs.canScheduleMeetings || false}
              onChange={(e) =>
                updateData({
                  plannerData: {
                    ...plannerData,
                    communicationPreferences: {
                      ...communicationPrefs,
                      canScheduleMeetings: e.target.checked,
                    },
                  },
                })
              }
              className="w-4 h-4 text-pink-600 rounded"
            />
            <span className="ml-3 text-gray-900 font-medium">Couples can schedule meetings</span>
          </label>
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
          disabled={!communicationPrefs.preferredMethod || !communicationPrefs.reminderFrequency}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
