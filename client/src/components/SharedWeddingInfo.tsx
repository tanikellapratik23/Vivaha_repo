import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Phone, Mail, Hotel, Heart, AlertCircle, Home, Clock } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

export default function SharedWeddingInfo() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [weddingInfo, setWeddingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvp, setRsvp] = useState({ name: '', email: '', attending: true, guestCount: 1, note: '' });
  const [rsvpStatus, setRsvpStatus] = useState('');

  useEffect(() => {
    fetchSharedWeddingInfo();
  }, [token]);

  const fetchSharedWeddingInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sharing/access/${token}`);

      if (response.data.success) {
        setWeddingInfo(response.data.userData);
      }
    } catch (err: any) {
      console.error('Failed to access shared wedding info:', err);
      if (err.response?.status === 404) {
        setError('This share link is invalid or has been revoked.');
      } else if (err.response?.status === 403) {
        setError('This share link has expired.');
      } else {
        setError('Failed to load wedding information. Please check your link and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading wedding information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition mx-auto"
          >
            <Home className="w-5 h-5" />
            Go to Vivaha Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  const submitRsvp = async (event: React.FormEvent) => {
    event.preventDefault(); setRsvpStatus('');
    try { await axios.post(`${API_URL}/api/sharing/access/${token}/rsvp`, rsvp); setRsvpStatus('Thank you—your RSVP has been received!'); }
    catch (err: any) { setRsvpStatus(err.response?.data?.error || 'Could not save your RSVP. Please try again.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Couple Names */}
        <div className="bg-gradient-to-r from-primary-500 via-pink-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">We're Getting Married!</h1>
          
          {/* Couple Names */}
          {(weddingInfo?.weddingPageData?.coupleName1 || weddingInfo?.coupleName1) && (
            <div className="mb-4">
              <p className="text-2xl font-semibold text-white/95">
                {weddingInfo?.weddingPageData?.coupleName1 || weddingInfo?.coupleName1}
                {(weddingInfo?.weddingPageData?.coupleName2 || weddingInfo?.coupleName2) && (
                  <span> & {weddingInfo?.weddingPageData?.coupleName2 || weddingInfo?.coupleName2}</span>
                )}
              </p>
            </div>
          )}
          
          <p className="text-white/90 text-lg">
            {weddingInfo?.role === 'bride' || weddingInfo?.role === 'groom' ? 'Join us for our special day' : 'Wedding Information'}
          </p>
        </div>

        {/* Wedding Date & Time - MOVED TO TOP */}
        {(weddingInfo?.weddingDate || weddingInfo?.weddingTime) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900">Date & Time</h2>
            </div>
            <div className="space-y-2">
              {weddingInfo.weddingDate && (
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Date:</span> {formatDate(weddingInfo.weddingDate)}
                </p>
              )}
              {weddingInfo.weddingTime && (
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Time:</span> {weddingInfo.weddingTime}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {(weddingInfo?.weddingCity || weddingInfo?.weddingState) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900">Location</h2>
            </div>
            <p className="text-lg text-gray-700">
              {weddingInfo.weddingCity}, {weddingInfo.weddingState}
              {weddingInfo.weddingCountry && ` - ${weddingInfo.weddingCountry}`}
            </p>
          </div>
        )}

        {/* Ceremony Schedule */}
        {weddingInfo?.ceremonyDetails?.weddingDays && weddingInfo.ceremonyDetails.weddingDays.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Ceremonies & Events</h2>
            </div>
            <div className="space-y-4">
              {weddingInfo.ceremonyDetails.weddingDays.map((day: any, dayIndex: number) => (
                <div key={dayIndex} className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{day.title}</h3>
                  {day.date && (
                    <p className="text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(day.date)}
                    </p>
                  )}
                  {day.events && day.events.length > 0 && (
                    <div className="space-y-2">
                      {day.events.map((event: any, eventIndex: number) => (
                        <div key={eventIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{event.name}</p>
                              {event.time && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time}
                                </p>
                              )}
                            </div>
                            {event.duration && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {event.duration}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                          )}
                          {event.location && (
                            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location.name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        {weddingInfo?.weddingPageData?.additionalInfo && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{weddingInfo.weddingPageData.additionalInfo}</p>
          </div>
        )}

        {/* Contact Information */}
        {(weddingInfo?.weddingPageData?.contactName || weddingInfo?.weddingPageData?.contactPhone || weddingInfo?.weddingPageData?.contactEmail) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              {weddingInfo.weddingPageData.contactName && (
                <p className="text-gray-700">
                  <span className="font-semibold">Contact:</span> {weddingInfo.weddingPageData.contactName}
                </p>
              )}
              {weddingInfo.weddingPageData.contactPhone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a href={`tel:${weddingInfo.weddingPageData.contactPhone}`} className="hover:text-primary-500">
                    {weddingInfo.weddingPageData.contactPhone}
                  </a>
                </div>
              )}
              {weddingInfo.weddingPageData.contactEmail && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a href={`mailto:${weddingInfo.weddingPageData.contactEmail}`} className="hover:text-primary-500">
                    {weddingInfo.weddingPageData.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expected Guests */}
        {weddingInfo?.guestCount && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Expected Guests</h2>
            </div>
            <p className="text-lg text-gray-700 font-semibold">{weddingInfo.guestCount} guests</p>
          </div>
        )}

        {/* Wedding Style */}
        {weddingInfo?.weddingStyle && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Wedding Style</h2>
            </div>
            <p className="text-lg text-gray-700 capitalize">{weddingInfo.weddingStyle}</p>
            {weddingInfo.preferredColorTheme && (
              <p className="text-md text-gray-600 mt-2">
                <span className="font-semibold">Color Theme:</span> {weddingInfo.preferredColorTheme}
              </p>
            )}
          </div>
        )}

        <form onSubmit={submitRsvp} className="rounded-2xl bg-white p-6 shadow-lg border border-rose-200"><h2 className="text-2xl font-bold text-gray-900">RSVP</h2><p className="mt-1 text-gray-600">Please let us know if you can celebrate with us.</p><div className="mt-5 grid gap-3 md:grid-cols-2"><input required placeholder="Your name" value={rsvp.name} onChange={e => setRsvp({...rsvp, name:e.target.value})}/><input type="email" placeholder="Email (optional)" value={rsvp.email} onChange={e => setRsvp({...rsvp, email:e.target.value})}/><select value={rsvp.attending ? 'yes' : 'no'} onChange={e => setRsvp({...rsvp, attending:e.target.value === 'yes'})}><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select><input type="number" min="1" disabled={!rsvp.attending} value={rsvp.guestCount} onChange={e => setRsvp({...rsvp, guestCount:Number(e.target.value)})}/></div><textarea className="mt-3 w-full" placeholder="Dietary needs or a note for the couple (optional)" value={rsvp.note} onChange={e => setRsvp({...rsvp, note:e.target.value})}/><button className="mt-4 rounded-xl bg-gradient-to-r from-primary-500 to-pink-600 px-6 py-3 font-bold text-white">Send RSVP</button>{rsvpStatus && <p className="mt-3 font-medium text-primary-700">{rsvpStatus}</p>}</form>

        {/* Footer */}
        <div className="text-center py-6">
          <a
            href={window.location.origin}
            className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            Powered by Vivaha - Your Wedding Planner
          </a>
        </div>
      </div>
    </div>
  );
}
