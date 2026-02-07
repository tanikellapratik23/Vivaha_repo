import { useState } from 'react';
import { X, MapPin, Heart, Calendar, Users } from 'lucide-react';

interface WeddingPin {
  id: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
  pairing: string;
  format: string;
  badges: string[];
}

// Representative interfaith weddings across the US
const weddingData: WeddingPin[] = [
  { id: 1, city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, pairing: 'Hindu-Christian', format: 'Dual Ceremonies', badges: ['Two-Day Event', 'Family-Focused'] },
  { id: 2, city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, pairing: 'Jewish-Catholic', format: 'Fusion Ceremony', badges: ['One-Day Event', 'Modern'] },
  { id: 3, city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, pairing: 'Muslim-Christian', format: 'Two Ceremonies', badges: ['Three-Day Event', 'Traditional'] },
  { id: 4, city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, pairing: 'Hindu-Jewish', format: 'Interfaith Fusion', badges: ['Weekend Wedding', 'Inclusive'] },
  { id: 5, city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, pairing: 'Buddhist-Christian', format: 'Spiritual Fusion', badges: ['Intimate', 'Outdoor'] },
  { id: 6, city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, pairing: 'Hindu-Catholic', format: 'Combined Ceremony', badges: ['Modern', 'Eco-Friendly'] },
  { id: 7, city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589, pairing: 'Jewish-Hindu', format: 'Dual Traditions', badges: ['Academic Vibe', 'Cultural Blend'] },
  { id: 8, city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, pairing: 'Christian-Buddhist', format: 'Mountain Ceremony', badges: ['Adventure', 'Intimate'] },
  { id: 9, city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918, pairing: 'Catholic-Hindu', format: 'Tropical Fusion', badges: ['Beach Wedding', 'Colorful'] },
  { id: 10, city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880, pairing: 'Christian-Muslim', format: 'Southern Interfaith', badges: ['Family-Focused', 'Traditional'] },
  { id: 11, city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, pairing: 'Jewish-Buddhist', format: 'Spiritual Union', badges: ['Eco-Conscious', 'Alternative'] },
  { id: 12, city: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.2650, pairing: 'Hindu-Lutheran', format: 'Midwest Fusion', badges: ['Community-Focused', 'Winter Wedding'] },
  { id: 13, city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740, pairing: 'Catholic-Sikh', format: 'Desert Ceremony', badges: ['Colorful', 'Unique'] },
  { id: 14, city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652, pairing: 'Jewish-Christian', format: 'Historic Venue', badges: ['Classic', 'Elegant'] },
  { id: 15, city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611, pairing: 'Hindu-Methodist', format: 'Coastal Fusion', badges: ['Relaxed', 'Beach Vibes'] },
  { id: 16, city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, pairing: 'Baptist-Hindu', format: 'Southern Tradition', badges: ['Music-Themed', 'Family'] },
  { id: 17, city: 'Washington DC', state: 'DC', lat: 38.9072, lng: -77.0369, pairing: 'Muslim-Jewish', format: 'Dual Ceremonies', badges: ['Political', 'Formal'] },
  { id: 18, city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398, pairing: 'Various Faiths', format: 'Quick Fusion', badges: ['Non-Traditional', 'Fun'] },
  { id: 19, city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431, pairing: 'Christian-Hindu', format: 'Southern Charm', badges: ['Garden Wedding', 'Elegant'] },
  { id: 20, city: 'Honolulu', state: 'HI', lat: 21.3099, lng: -157.8581, pairing: 'Buddhist-Christian', format: 'Island Paradise', badges: ['Destination', 'Tropical'] },
];

export default function VivahaMap({ onClose }: { onClose?: () => void }) {
  const [selectedPin, setSelectedPin] = useState<WeddingPin | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  // Convert lat/lng to SVG coordinates (simplified projection)
  const latLngToXY = (lat: number, lng: number) => {
    // US bounds approximately: lat 24-50, lng -125 to -66
    const x = ((lng + 125) / (125 - 66)) * 800 + 50;
    const y = ((50 - lat) / (50 - 24)) * 450 + 50;
    return { x, y };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Vivaha Map
            </h2>
            <p className="text-white/90 text-sm mt-1">Explore real interfaith weddings across America</p>
          </div>
          <button
            onClick={() => onClose?.()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-[500px]">
            {/* Simplified US Map */}
            <svg viewBox="0 0 900 600" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="900" height="600" fill="#f8fafc" />
              
              {/* Simplified US outline */}
              <path
                d="M 100 150 L 150 140 L 200 145 L 250 140 L 300 145 L 350 140 L 400 150 L 450 145 L 500 150 L 550 145 L 600 150 L 650 155 L 700 160 L 750 165 L 800 170 L 820 200 L 830 250 L 825 300 L 820 350 L 810 400 L 800 450 L 750 460 L 700 465 L 650 460 L 600 465 L 550 470 L 500 465 L 450 470 L 400 465 L 350 470 L 300 465 L 250 470 L 200 475 L 150 470 L 100 450 L 80 400 L 70 350 L 75 300 L 80 250 L 85 200 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              
              {/* State dividers (simplified) */}
              <line x1="200" y1="150" x2="200" y2="470" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
              <line x1="350" y1="150" x2="350" y2="470" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
              <line x1="500" y1="150" x2="500" y2="470" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
              <line x1="650" y1="150" x2="650" y2="470" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
              
              {/* Wedding pins */}
              {weddingData.map((wedding) => {
                const { x, y } = latLngToXY(wedding.lat, wedding.lng);
                const isHovered = hoveredPin === wedding.id;
                const isSelected = selectedPin?.id === wedding.id;
                
                return (
                  <g
                    key={wedding.id}
                    transform={`translate(${x}, ${y})`}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={() => setHoveredPin(wedding.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => setSelectedPin(wedding)}
                  >
                    {/* Pin shadow */}
                    {(isHovered || isSelected) && (
                      <circle r="20" fill="black" opacity="0.1" />
                    )}
                    
                    {/* Pin circle */}
                    <circle
                      r={isHovered || isSelected ? '14' : '10'}
                      fill="url(#pinGradient)"
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Heart icon */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize={isHovered || isSelected ? '12' : '10'}
                      fill="white"
                    >
                      💕
                    </text>
                  </g>
                );
              })}
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Selected Wedding Card */}
          {selectedPin && (
            <div className="mt-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200 animate-fadeIn">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    {selectedPin.pairing}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {selectedPin.city}, {selectedPin.state}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700 font-medium">{selectedPin.format}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedPin.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-purple-700 text-sm font-medium rounded-full border border-purple-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                * Representative example - no personal details shared
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"></div>
              <span>Interfaith Wedding</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>{weddingData.length} Ceremonies Shown</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
