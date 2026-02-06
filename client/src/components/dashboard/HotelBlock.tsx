import { useState, useEffect } from 'react';
import { MapPin, Hotel, Star, Phone, DollarSign, Users, Search, Loader } from 'lucide-react';
import axios from 'axios';

export default function HotelBlock() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ city: '', state: '' });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            
            // Reverse geocode to get city/state
            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const city = response.data.address.city || response.data.address.town || '';
              const state = response.data.address.state || '';
              setLocation({ city, state });
              
              if (city) {
                searchHotels(city, state);
              }
            } catch (error) {
              console.error('Failed to reverse geocode:', error);
            }
          },
          (error) => {
            console.error('Location access denied:', error);
          }
        );
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const searchHotels = async (city: string, state: string) => {
    if (!city) return;
    
    setLoading(true);
    try {
      // Mock hotel data with wedding block discounts
      const mockHotels = [
        {
          id: '1',
          name: `${city} Marriott Hotel & Spa`,
          address: `123 Main Street, ${city}, ${state}`,
          rating: 4.5,
          pricePerNight: 189,
          discountedPrice: 149,
          discountPercent: 21,
          amenities: ['Free WiFi', 'Breakfast Included', 'Pool', 'Fitness Center'],
          weddingServices: ['Group Rates', 'Event Space', 'Catering Available'],
          phone: '(555) 123-4567',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
        },
        {
          id: '2',
          name: `Hilton ${city} Downtown`,
          address: `456 Oak Avenue, ${city}, ${state}`,
          rating: 4.3,
          pricePerNight: 199,
          discountedPrice: 159,
          discountPercent: 20,
          amenities: ['Free Parking', 'Restaurant', 'Bar', 'Business Center'],
          weddingServices: ['Wedding Coordinator', 'Discounted Blocks', 'Shuttle Service'],
          phone: '(555) 234-5678',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
        },
        {
          id: '3',
          name: `The Grand ${city} Hotel`,
          address: `789 Park Boulevard, ${city}, ${state}`,
          rating: 4.7,
          pricePerNight: 249,
          discountedPrice: 199,
          discountPercent: 20,
          amenities: ['Spa', 'Fine Dining', 'Valet Parking', 'Concierge'],
          weddingServices: ['Complimentary Suite Upgrade', 'Welcome Gifts', 'Group Discounts'],
          phone: '(555) 345-6789',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
        },
        {
          id: '4',
          name: `${city} Courtyard Hotel`,
          address: `321 Elm Street, ${city}, ${state}`,
          rating: 4.1,
          pricePerNight: 139,
          discountedPrice: 109,
          discountPercent: 22,
          amenities: ['Free WiFi', 'Fitness Center', 'Meeting Rooms'],
          weddingServices: ['Block Rates', 'Extended Stay Discounts'],
          phone: '(555) 456-7890',
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
        },
      ];

      setHotels(mockHotels);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Hotel Block Discounts</h1>
        <p className="text-white/90 text-lg">
          Exclusive wedding hotel blocks near your venue with special group rates for guests
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
            placeholder="Enter city..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <input
            type="text"
            value={location.state}
            onChange={(e) => setLocation({ ...location, state: e.target.value })}
            placeholder="State..."
            className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button
            onClick={() => searchHotels(location.city, location.state)}
            disabled={!location.city}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      )}

      {/* Hotels Grid */}
      {!loading && hotels.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
              <div className="relative h-48">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                  {hotel.discountPercent}% OFF
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(hotel.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{hotel.address}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-gray-500 line-through text-lg">
                    ${hotel.pricePerNight}/night
                  </div>
                  <div className="text-green-600 font-bold text-2xl">
                    ${hotel.discountedPrice}/night
                  </div>
                  <div className="text-sm text-gray-600">wedding rate</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Amenities:</div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-pink-500" />
                    Wedding Services:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.weddingServices.map((service: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${hotel.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Hotel
                  </a>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all">
                    Book Block
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center gap-2">
          <Users className="w-5 h-5" />
          How Hotel Blocks Work
        </h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• Reserve a block of rooms at discounted rates for your guests</li>
          <li>• Guests mention your wedding name to get the special rate</li>
          <li>• No upfront payment required - guests book and pay individually</li>
          <li>• Complimentary suite upgrades often available for couple</li>
        </ul>
      </div>
    </div>
  );
}
