import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, CheckSquare, Heart, MapPin, Briefcase } from 'lucide-react';
import axios from 'axios';
import { authStorage } from '../../utils/auth';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGuests: 0,
    confirmedGuests: 0,
    totalBudget: 0,
    spent: 0,
    completedTasks: 0,
    totalTasks: 0,
    daysUntilWedding: 0,
    hoursUntilWedding: 0,
    minutesUntilWedding: 0,
  });

  const [userSettings, setUserSettings] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Helper to capitalize first letter of name
  const capitalizeName = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  useEffect(() => {
    // Load user name immediately from sessionStorage to prevent glitch
    try {
      const user = authStorage.getUser();
      if (user) {
        const firstName = user.name?.split(' ')[0] || '';
        setUserName(capitalizeName(firstName));
      }
    } catch (e) {
      console.error('Failed to load user name:', e);
    }
    
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    // Apply any locally persisted onboarding immediately for fast UX
    try {
      const localOnboarding = JSON.parse(localStorage.getItem('onboarding') || 'null');
      const localUser = JSON.parse(localStorage.getItem('user') || 'null');
      const data = localOnboarding || localUser;
      if (data) {
        setUserSettings(data);
        setStats(prev => ({
          ...prev,
          totalGuests: data.guestCount || 0,
          confirmedGuests: 0,
          totalBudget: data.estimatedBudget || 0,
        }));
        
        // Ensure user name is set from local data
        if (localUser?.name && !userName) {
          const firstName = localUser.name.split(' ')[0] || '';
          setUserName(capitalizeName(firstName));
        }
      }
    } catch (e) {
      // ignore local parse errors
    }
    try {
      const token = authStorage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await axios.get('/api/onboarding', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setUserSettings(response.data);
        
        // Update stats from user data
        setStats(prev => ({
          ...prev,
          totalGuests: response.data.guestCount || 0,
          confirmedGuests: 0,
          totalBudget: response.data.estimatedBudget || 0,
          spent: 0,
          completedTasks: 0,
          totalTasks: 0,
        }));
        
        // Calculate days until wedding
        if (response.data.weddingDate) {
          const weddingDateTime = new Date(response.data.weddingDate);
          
          // If wedding time is set, add it to the date
          if (response.data.weddingTime) {
            const [hours, minutes] = response.data.weddingTime.split(':');
            weddingDateTime.setHours(parseInt(hours), parseInt(minutes));
          }
          
          const now = new Date();
          const diffMs = weddingDateTime.getTime() - now.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          setStats(prev => ({
            ...prev,
            daysUntilWedding: diffDays > 0 ? diffDays : 0,
            hoursUntilWedding: diffHours > 0 ? diffHours : 0,
            minutesUntilWedding: diffMinutes > 0 ? diffMinutes : 0,
          }));
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-500 via-pink-500 to-purple-600 rounded-3xl shadow-2xl p-10 text-white border border-primary-400/30">
        <div className="flex items-center space-x-6">
          <Heart className="w-20 h-20 drop-shadow-lg" />
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">
              Welcome back{userName ? `, ${userName}` : ''}!
            </h1>
            {!isLoading && userSettings?.weddingCity && (
              <div className="flex items-center gap-3 text-white/90 text-lg drop-shadow-md mb-3">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{userSettings.weddingCity}, {userSettings.weddingState || userSettings.weddingCountry}</span>
              </div>
            )}
            {!isLoading && userSettings?.weddingDate && (
              <p className="text-white/90 text-base mb-3 drop-shadow-md">
                📅 {new Date(userSettings.weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Days Until Wedding - Large Prominent Display */}
      {!isLoading && stats.daysUntilWedding > 0 && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-200/50 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Wedding Day</h2>
          <div className="text-8xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-primary-500 bg-clip-text text-transparent mb-2">
            {stats.daysUntilWedding}
          </div>
          <p className="text-2xl font-semibold text-gray-700">
            {stats.daysUntilWedding === 1 ? 'day' : 'days'} to go 💕
          </p>
          {userSettings?.weddingTime && (
            <p className="text-gray-500 text-lg mt-4">
              {stats.hoursUntilWedding} hours, {stats.minutesUntilWedding} minutes
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Add Guest', icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-600', action: () => navigate('/dashboard/guests') },
            { label: 'Add Expense', icon: DollarSign, color: 'bg-gradient-to-br from-green-500 to-green-600', action: () => navigate('/dashboard/budget') },
            { label: 'New Task', icon: CheckSquare, color: 'bg-gradient-to-br from-purple-500 to-purple-600', action: () => navigate('/dashboard/todos') },
            { label: 'Add Vendor', icon: Briefcase, color: 'bg-gradient-to-br from-pink-500 to-pink-600', action: () => navigate('/dashboard/vendor-search') },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} hover:scale-105 text-white p-8 rounded-2xl transition-all shadow-xl hover:shadow-2xl cursor-pointer`}
              >
                <Icon className="w-10 h-10 mx-auto mb-3" />
                <span className="block text-base font-bold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
