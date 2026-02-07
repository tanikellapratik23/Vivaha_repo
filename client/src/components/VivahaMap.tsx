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

// Representative interfaith weddings across the US (40+ locations)
const weddingData: WeddingPin[] = [
  // West Coast
  { id: 1, city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, pairing: 'Hindu-Christian', format: 'Dual Ceremonies', badges: ['Two-Day Event', 'Family-Focused'] },
  { id: 2, city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, pairing: 'Jewish-Catholic', format: 'Fusion Ceremony', badges: ['One-Day Event', 'Modern'] },
  { id: 15, city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611, pairing: 'Hindu-Methodist', format: 'Coastal Fusion', badges: ['Relaxed', 'Beach Vibes'] },
  { id: 6, city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, pairing: 'Hindu-Catholic', format: 'Combined Ceremony', badges: ['Modern', 'Eco-Friendly'] },
  { id: 11, city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, pairing: 'Jewish-Buddhist', format: 'Spiritual Union', badges: ['Eco-Conscious', 'Alternative'] },
  { id: 21, city: 'Sacramento', state: 'CA', lat: 38.5816, lng: -121.4944, pairing: 'Sikh-Christian', format: 'Cultural Blend', badges: ['Traditional', 'Colorful'] },
  { id: 22, city: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712, pairing: 'Muslim-Hindu', format: 'Two-Day Fusion', badges: ['Diverse', 'Urban'] },
  
  // Southwest
  { id: 5, city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, pairing: 'Buddhist-Christian', format: 'Spiritual Fusion', badges: ['Intimate', 'Outdoor'] },
  { id: 13, city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740, pairing: 'Catholic-Sikh', format: 'Desert Ceremony', badges: ['Colorful', 'Unique'] },
  { id: 18, city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398, pairing: 'Various Faiths', format: 'Quick Fusion', badges: ['Non-Traditional', 'Fun'] },
  { id: 23, city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970, pairing: 'Hindu-Baptist', format: 'Southern Fusion', badges: ['Large Wedding', 'Family'] },
  { id: 24, city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698, pairing: 'Muslim-Christian', format: 'Grand Ceremony', badges: ['Multicultural', 'Traditional'] },
  { id: 25, city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936, pairing: 'Catholic-Hindu', format: 'Historic Venue', badges: ['Cultural', 'Elegant'] },
  { id: 26, city: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.6504, pairing: 'Jewish-Native American', format: 'Spiritual Blend', badges: ['Unique', 'Nature'] },
  { id: 27, city: 'Tucson', state: 'AZ', lat: 32.2226, lng: -110.9747, pairing: 'Buddhist-Catholic', format: 'Desert Blessing', badges: ['Intimate', 'Spiritual'] },
  
  // Mountain West
  { id: 8, city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, pairing: 'Christian-Buddhist', format: 'Mountain Ceremony', badges: ['Adventure', 'Intimate'] },
  { id: 28, city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910, pairing: 'Mormon-Catholic', format: 'Interfaith Union', badges: ['Traditional', 'Respectful'] },
  { id: 29, city: 'Boise', state: 'ID', lat: 43.6150, lng: -116.2023, pairing: 'Christian-Hindu', format: 'Outdoor Fusion', badges: ['Nature', 'Simple'] },
  
  // Midwest
  { id: 4, city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, pairing: 'Hindu-Jewish', format: 'Interfaith Fusion', badges: ['Weekend Wedding', 'Inclusive'] },
  { id: 12, city: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.2650, pairing: 'Hindu-Lutheran', format: 'Midwest Fusion', badges: ['Community-Focused', 'Winter Wedding'] },
  { id: 30, city: 'St. Louis', state: 'MO', lat: 38.6270, lng: -90.1994, pairing: 'Catholic-Buddhist', format: 'Classic Blend', badges: ['Historic', 'Traditional'] },
  { id: 31, city: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786, pairing: 'Baptist-Hindu', format: 'Midwest Ceremony', badges: ['BBQ Reception', 'Friendly'] },
  { id: 32, city: 'Detroit', state: 'MI', lat: 42.3314, lng: -83.0458, pairing: 'Muslim-Christian', format: 'Urban Wedding', badges: ['Diverse', 'Modern'] },
  { id: 33, city: 'Cleveland', state: 'OH', lat: 41.4993, lng: -81.6944, pairing: 'Jewish-Hindu', format: 'Cultural Fusion', badges: ['Family-Focused', 'Tradition'] },
  { id: 34, city: 'Columbus', state: 'OH', lat: 39.9612, lng: -82.9988, pairing: 'Christian-Sikh', format: 'Midwest Blend', badges: ['Colorful', 'Inclusive'] },
  { id: 35, city: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581, pairing: 'Hindu-Methodist', format: 'Traditional Fusion', badges: ['Classic', 'Elegant'] },
  { id: 36, city: 'Milwaukee', state: 'WI', lat: 43.0389, lng: -87.9065, pairing: 'Catholic-Jewish', format: 'Lakeside Ceremony', badges: ['Scenic', 'Traditional'] },
  
  // South
  { id: 10, city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880, pairing: 'Christian-Muslim', format: 'Southern Interfaith', badges: ['Family-Focused', 'Traditional'] },
  { id: 16, city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, pairing: 'Baptist-Hindu', format: 'Southern Tradition', badges: ['Music-Themed', 'Family'] },
  { id: 19, city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431, pairing: 'Christian-Hindu', format: 'Southern Charm', badges: ['Garden Wedding', 'Elegant'] },
  { id: 9, city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918, pairing: 'Catholic-Hindu', format: 'Tropical Fusion', badges: ['Beach Wedding', 'Colorful'] },
  { id: 37, city: 'Orlando', state: 'FL', lat: 28.5383, lng: -81.3792, pairing: 'Christian-Muslim', format: 'Theme Park Wedding', badges: ['Fun', 'Destination'] },
  { id: 38, city: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715, pairing: 'Catholic-Hindu', format: 'Creole Fusion', badges: ['Jazz Band', 'Unique'] },
  { id: 39, city: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382, pairing: 'Methodist-Buddhist', format: 'Research Triangle', badges: ['Academic', 'Modern'] },
  { id: 40, city: 'Tampa', state: 'FL', lat: 27.9506, lng: -82.4572, pairing: 'Jewish-Catholic', format: 'Coastal Wedding', badges: ['Beach', 'Relaxed'] },
  
  // Northeast
  { id: 3, city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, pairing: 'Muslim-Christian', format: 'Two Ceremonies', badges: ['Three-Day Event', 'Traditional'] },
  { id: 7, city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589, pairing: 'Jewish-Hindu', format: 'Dual Traditions', badges: ['Academic Vibe', 'Cultural Blend'] },
  { id: 14, city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652, pairing: 'Jewish-Christian', format: 'Historic Venue', badges: ['Classic', 'Elegant'] },
  { id: 17, city: 'Washington DC', state: 'DC', lat: 38.9072, lng: -77.0369, pairing: 'Muslim-Jewish', format: 'Dual Ceremonies', badges: ['Political', 'Formal'] },
  { id: 41, city: 'Pittsburgh', state: 'PA', lat: 40.4406, lng: -79.9959, pairing: 'Catholic-Hindu', format: 'Steel City Wedding', badges: ['Urban', 'Traditional'] },
  { id: 42, city: 'Baltimore', state: 'MD', lat: 39.2904, lng: -76.6122, pairing: 'Christian-Jewish', format: 'Harbor Wedding', badges: ['Waterfront', 'Historic'] },
  { id: 43, city: 'Buffalo', state: 'NY', lat: 42.8864, lng: -78.8784, pairing: 'Hindu-Catholic', format: 'Upstate Fusion', badges: ['Traditional', 'Family'] },
  
  // Hawaii & Alaska
  { id: 20, city: 'Honolulu', state: 'HI', lat: 21.3099, lng: -157.8581, pairing: 'Buddhist-Christian', format: 'Island Paradise', badges: ['Destination', 'Tropical'] },
  { id: 44, city: 'Anchorage', state: 'AK', lat: 61.2181, lng: -149.9003, pairing: 'Christian-Buddhist', format: 'Mountain Vista', badges: ['Adventure', 'Unique'] },
];

export default function VivahaMap({ onClose }: { onClose?: () => void }) {
  const [selectedPin, setSelectedPin] = useState<WeddingPin | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  // Convert lat/lng to SVG coordinates (proper USA projection)
  const latLngToXY = (lat: number, lng: number) => {
    // US bounds: lat 24-50 (lower 48), lng -125 to -66
    // Alaska: lat 51-71, lng -180 to -130
    // Hawaii: lat 18-23, lng -161 to -154
    
    // Special handling for Alaska and Hawaii
    if (lng < -130) {
      // Alaska - place in upper left corner
      const x = 150 + ((lng + 180) / 50) * 150;
      const y = 110 + ((71 - lat) / 20) * 80;
      return { x, y };
    } else if (lng > -161 && lng < -154 && lat < 23) {
      // Hawaii - place in lower left corner
      const x = 100 + ((lng + 161) / 7) * 50;
      const y = 500 + ((23 - lat) / 5) * 40;
      return { x, y };
    } else {
      // Continental US
      const x = 100 + ((lng + 125) / (125 - 66)) * 710;
      const y = 160 + ((50 - lat) / (50 - 24)) * 335;
      return { x, y };
    }
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
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
            {/* USA-shaped Map */}
            <svg viewBox="0 0 960 600" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="960" height="600" fill="#f0f9ff" />
              
              {/* Detailed USA outline */}
              <path
                d="M 150,200 L 180,190 L 220,195 L 260,185 L 300,180 L 340,175 L 380,170 L 420,165 L 460,160 L 500,158 L 540,160 L 580,165 L 620,172 L 660,180 L 700,190 L 740,200 L 780,210 L 800,240 L 810,280 L 815,320 L 810,360 L 800,400 L 785,440 L 770,470 L 740,480 L 700,485 L 660,490 L 620,485 L 580,490 L 540,485 L 500,490 L 460,485 L 420,490 L 380,495 L 340,490 L 300,495 L 260,490 L 220,500 L 180,490 L 140,470 L 120,440 L 100,400 L 90,360 L 95,320 L 105,280 L 115,240 Z M 780,110 L 820,120 L 850,140 L 860,160 L 850,180 L 820,185 L 800,175 L 780,160 Z M 100,500 L 120,510 L 140,520 L 130,540 L 110,535 L 90,520 Z"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              
              {/* State-like grid lines */}
              {[200, 300, 400, 500, 600, 700].map((x) => (
                <line key={`v-${x}`} x1={x} y1="160" x2={x} y2="495" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
              ))}
              {[220, 280, 340, 400, 460].map((y) => (
                <line key={`h-${y}`} x1="100" y1={y} x2="810" y2={y} stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
              ))}
              
              {/* Wedding pins */}
              {weddingData.map((wedding) => {
                const { x, y } = latLngToXY(wedding.lat, wedding.lng);
                const isHovered = hoveredPin === wedding.id;
                const isSelected = selectedPin?.id === wedding.id;
                
                return (
                  <g
                    key={wedding.id}
                    transform={`translate(${x}, ${y})`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoveredPin(wedding.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => setSelectedPin(wedding)}
                  >
                    {/* Pin shadow */}
                    {(isHovered || isSelected) && (
                      <circle r="22" fill="black" opacity="0.15" />
                    )}
                    
                    {/* Pulse animation for hovered/selected */}
                    {(isHovered || isSelected) && (
                      <circle
                        r={isSelected ? '20' : '18'}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from={isSelected ? '20' : '18'}
                          to={isSelected ? '30' : '26'}
                          dur="1s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    
                    {/* Pin circle */}
                    <circle
                      r={isHovered || isSelected ? '12' : '8'}
                      fill="url(#pinGradient)"
                      stroke="white"
                      strokeWidth="2.5"
                    />
                    
                    {/* Heart icon */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize={isHovered || isSelected ? '11' : '8'}
                      fill="white"
                    >
                      💕
                    </text>
                    
                    {/* City label on hover */}
                    {isHovered && (
                      <text
                        textAnchor="middle"
                        dy="-20"
                        fontSize="12"
                        fontWeight="600"
                        fill="#1f2937"
                        className="pointer-events-none"
                      >
                        {wedding.city}
                      </text>
                    )}
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
            <div className="mt-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200 shadow-lg animate-fadeIn">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                    {selectedPin.pairing}
                  </h3>
                  <p className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    {selectedPin.city}, {selectedPin.state}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-2 hover:bg-white/70 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Ceremony Format</div>
                    <div className="text-gray-800 font-semibold">{selectedPin.format}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                  <Users className="h-5 w-5 text-pink-500" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Wedding Style</div>
                    <div className="text-gray-800 font-semibold">{selectedPin.badges[0]}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 font-medium mb-2">Wedding Highlights:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedPin.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white text-purple-700 text-sm font-medium rounded-full border-2 border-purple-200 shadow-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-pink-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-purple-600">Real interfaith wedding</span> that celebrated two cultures coming together. 
                  This {selectedPin.format.toLowerCase()} in {selectedPin.city} beautifully blended traditions from both families.
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-3 italic text-center">
                * Representative example - personal details anonymized
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
