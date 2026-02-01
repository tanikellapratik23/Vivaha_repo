import { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Users, DollarSign, Plane, Home, Loader, Heart, Share2, Download, Hotel } from 'lucide-react';
import axios from 'axios';
import { locationData, getActivities } from '../../utils/locationData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface BachelorTrip {
  _id?: string;
  userId: string;
  eventType: 'bachelor' | 'bachelorette';
  destination: string;
  state?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  attendees: Array<{ name: string; email?: string }>;
  activities: string[];
  guestList: Array<{ name: string; email?: string; rsvp?: 'pending' | 'accepted' | 'declined' }>;
  expenses: any[];
  flights: any[];
  stays: any[];
  status: 'planning' | 'booked' | 'completed';
}

export default function BachelorDashboard() {
  const [activeTab, setActiveTab] = useState<'trip-setup' | 'budget' | 'attendees' | 'flights' | 'stays'>('trip-setup');
  const [trip, setTrip] = useState<BachelorTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('CA');
  const [eventType, setEventType] = useState<'bachelor' | 'bachelorette'>('bachelor');
  const [destination, setDestination] = useState('');
  const [totalBudget, setTotalBudget] = useState('');

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/bachelor-trip`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      if (response.data && response.data.length > 0) {
        setTrip(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async () => {
    if (!destination || !totalBudget) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const newTrip: BachelorTrip = {
        userId: '',
        eventType,
        destination,
        state: selectedState,
        city: destination,
        budget: parseFloat(totalBudget),
        attendees: [],
        activities: getActivities(destination),
        guestList: [],
        expenses: [],
        flights: [],
        stays: [],
        status: 'planning',
      };

      const response = await axios.post(`${API_URL}/api/bachelor-trip/create`, newTrip, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrip(response.data);
      setDestination('');
      setTotalBudget('');
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Failed to create trip');
    }
  };

  // Get countries/regions list
  const countryList = Object.entries(locationData).map(([key, val]) => ({
    code: key,
    label: val.label,
  }));

  // Get states/cities for selected country
  const getStateList = () => {
    const country = locationData[selectedCountry as keyof typeof locationData];
    if (!country) return [];

    if ('states' in country) {
      return Object.entries(country.states).map(([key, state]) => ({
        code: key,
        label: typeof state === 'string' ? state : state.label,
      }));
    }
    if ('destinations' in country) {
      return Object.entries(country.destinations).map(([key, dest]) => ({
        code: key,
        label: dest.label,
      }));
    }
    if ('countries' in country) {
      return Object.entries(country.countries).map(([key, dest]) => ({
        code: key,
        label: dest.label,
      }));
    }
    return [];
  };

  // Get cities for selected state (US only)
  const getCitiesList = () => {
    const country = locationData[selectedCountry as keyof typeof locationData];
    if (selectedCountry === 'US' && 'states' in country) {
      const state = (country as any).states[selectedState];
      if (state && typeof state === 'object' && 'cities' in state) {
        return (state as any).cities;
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {eventType === 'bachelor' ? '🎉 Bachelor Trip' : '👰 Bachelorette Party'}
          </h1>
          <p className="text-gray-500 mt-1">Plan your perfect celebration</p>
        </div>
      </div>

      {/* Event Type Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600 font-medium mb-4">Event Type</p>
        <div className="flex gap-4">
          {(['bachelor', 'bachelorette'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setEventType(type)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                eventType === type
                  ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium'
                  : 'border-gray-200 hover:border-pink-300 text-gray-600'
              }`}
            >
              {type === 'bachelor' ? '🎯 Bachelor Trip' : '💎 Bachelorette Party'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'trip-setup', label: 'Trip Setup', icon: MapPin },
            { id: 'budget', label: 'Budget', icon: DollarSign },
            { id: 'attendees', label: 'Guest List', icon: Users },
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'stays', label: 'Stays', icon: Home },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-b-2 transition ${
                activeTab === id
                  ? 'border-pink-500 text-pink-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Trip Setup Tab */}
          {activeTab === 'trip-setup' && (
            <div className="space-y-6">
              {!trip ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Country/Region
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedState('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {countryList.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Region/City
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      {getStateList().map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCountry === 'US' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select city...</option>
                        {getCitiesList().map((city: string) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget
                    </label>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-3 text-gray-600">$</span>
                      <input
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        placeholder="5000"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={createTrip}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Trip
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {trip.eventType === 'bachelor' ? '🎉 Bachelor Trip' : '👰 Bachelorette Party'}
                    </h3>
                    <p className="text-2xl font-bold text-pink-600 mb-2">{trip.destination}</p>
                    <p className="text-gray-600">
                      Budget: <span className="font-semibold text-gray-900">${trip.budget?.toLocaleString()}</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Suggested Activities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(Array.isArray(trip.activities) ? trip.activities : []).map((activity, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200"
                        >
                          ✓ {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Flights Tab with Google Flights */}
          {activeTab === 'flights' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-3">
                  🔗 <strong>Google Flights</strong> - Search and compare flights
                </p>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/flights?q=flights+to+${trip?.destination || 'destination'}`;
                    window.open(url, 'flights', 'width=1000,height=700');
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Open Google Flights
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Pro tip: Use filters to find direct flights and best prices for your group.
              </p>
            </div>
          )}

          {/* Stays Tab with Airbnb */}
          {activeTab === 'stays' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 mb-3">
                  🏠 <strong>Airbnb Search</strong> - Find group accommodations
                </p>
                <button
                  onClick={() => {
                    const url = `https://www.airbnb.com/s/${trip?.destination || 'destination'}/homes`;
                    window.open(url, 'airbnb', 'width=1000,height=700');
                  }}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
                >
                  Search Airbnb
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Pro tip: Filter by "Entire place" for group-friendly rentals with common spaces.
              </p>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              {trip && (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                    <p className="text-3xl font-bold text-green-600">${trip.budget?.toLocaleString()}</p>
                  </div>
                  <div className="text-center text-gray-600 py-6">
                    <p>Budget tracking coming soon</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Attendees Tab */}
          {activeTab === 'attendees' && (
            <div className="space-y-4">
              {trip && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Trip Attendees</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition">
                      <Plus className="w-4 h-4" />
                      Add Attendee
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(Array.isArray(trip.attendees) ? trip.attendees : []).map((attendee, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{attendee.name}</p>
                          {attendee.email && <p className="text-sm text-gray-600">{attendee.email}</p>}
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
