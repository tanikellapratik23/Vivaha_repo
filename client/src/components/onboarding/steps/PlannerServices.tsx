import { Briefcase } from 'lucide-react';
import { OnboardingData } from '../Onboarding';

interface PlannerServicesProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerServices({
  data,
  updateData,
  onNext,
  onBack,
}: PlannerServicesProps) {
  const services = [
    { id: 'full', label: 'Full wedding planning', description: 'Complete A-Z planning' },
    { id: 'partial', label: 'Partial planning', description: 'Selected services' },
    { id: 'month', label: 'Month-of coordination', description: 'Final month coordination' },
    { id: 'day', label: 'Day-of coordination', description: 'Day-of execution only' },
    { id: 'vendor', label: 'Vendor sourcing only', description: 'Vendor research & selection' },
    { id: 'cultural', label: 'Cultural consultation', description: 'Cultural ceremony guidance' },
    { id: 'timeline', label: 'Timeline & logistics only', description: 'Planning logistics' },
  ];

  const plannerData = data.plannerData || {};

  const toggleService = (serviceId: string) => {
    const services = plannerData.services || [];
    if (services.includes(serviceId)) {
      updateData({
        plannerData: {
          ...plannerData,
          services: services.filter(s => s !== serviceId),
        },
      });
    } else {
      updateData({
        plannerData: {
          ...plannerData,
          services: [...services, serviceId],
        },
      });
    }
  };

  const handleNext = () => {
    if ((plannerData.services || []).length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">What services do you offer?</h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <label
            key={service.id}
            className="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={(plannerData.services || []).includes(service.id)}
              onChange={() => toggleService(service.id)}
              className="w-5 h-5 text-pink-600 rounded mt-1"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-900">{service.label}</p>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Custom Packages */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-900">
          <Briefcase className="w-4 h-4 inline mr-2" />
          Do you offer custom packages?
        </label>
        <div className="space-y-2">
          {['Yes', 'No'].map((option) => (
            <label
              key={option}
              className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition"
            >
              <input
                type="radio"
                name="customPackages"
                checked={plannerData.customPackages === (option === 'Yes')}
                onChange={() =>
                  updateData({
                    plannerData: {
                      ...plannerData,
                      customPackages: option === 'Yes',
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

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={(plannerData.services || []).length === 0}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
