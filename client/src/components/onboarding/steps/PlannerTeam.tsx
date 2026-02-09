import { Users, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { OnboardingData } from '../Onboarding';

interface PlannerTeamProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlannerTeam({
  data,
  updateData,
  onNext,
  onBack,
}: PlannerTeamProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');

  const plannerData = data.plannerData || {};
  const teamMembers = plannerData.teamMembers || [];

  const handleAddTeamMember = () => {
    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }

    if (teamMembers.some(member => member.email === inviteEmail)) {
      setInviteError('This team member is already invited');
      return;
    }

    updateData({
      plannerData: {
        ...plannerData,
        teamMembers: [
          ...teamMembers,
          {
            email: inviteEmail,
            status: 'pending',
          },
        ],
      },
    });

    setInviteEmail('');
    setInviteError('');
  };

  const handleRemoveTeamMember = (email: string) => {
    updateData({
      plannerData: {
        ...plannerData,
        teamMembers: teamMembers.filter(member => member.email !== email),
      },
    });
  };

  const handleNext = () => {
    if (plannerData.teamType) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Your Planning Team</h2>
        <p className="text-gray-600">Are you planning alone or with a team?</p>
      </div>

      <div className="space-y-6">
        {/* Team Type Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            <Users className="w-4 h-4 inline mr-2" />
            Team Structure
          </label>
          <div className="space-y-2">
            {['Solo', 'Team'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  plannerData.teamType === option
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <input
                  type="radio"
                  name="teamType"
                  checked={plannerData.teamType === option}
                  onChange={() =>
                    updateData({
                      plannerData: {
                        ...plannerData,
                        teamType: option,
                        teamMembers: option === 'Solo' ? [] : teamMembers,
                      },
                    })
                  }
                  className="w-4 h-4 text-pink-600"
                />
                <span className="ml-3 text-gray-900 font-medium">
                  {option === 'Solo' ? 'Just me' : 'I work with a team'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Team Members Invitation */}
        {plannerData.teamType === 'Team' && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900">
              Invite Team Members (Optional)
            </label>

            {/* Invite Form */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="team@example.com"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTeamMember();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleAddTeamMember}
                className="px-4 py-2 bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {inviteError && <p className="text-red-500 text-sm">{inviteError}</p>}

            {/* Team Members List */}
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Invited Members</p>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{member.email}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.status === 'pending' ? 'Invitation pending' : 'Accepted'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveTeamMember(member.email)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          disabled={!plannerData.teamType}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
