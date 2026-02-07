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
            {/* Actual USA-shaped Map */}
            <svg viewBox="0 0 960 600" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="960" height="600" fill="#f0f9ff" />
              
              {/* Accurate USA mainland outline */}
              <path
                d="M 895,230 L 885,235 L 870,240 L 860,250 L 855,265 L 850,275 L 840,285 L 825,290 L 815,300 L 810,315 L 800,325 L 790,330 L 780,340 L 770,345 L 760,350 L 750,360 L 740,365 L 730,370 L 720,372 L 710,370 L 700,365 L 695,360 L 690,350 L 688,340 L 690,330 L 695,320 L 700,315 L 710,310 L 715,305 L 720,295 L 725,285 L 730,280 L 735,275 L 740,268 L 745,260 L 748,250 L 750,242 L 750,235 L 748,228 L 745,222 L 740,218 L 735,215 L 728,213 L 720,212 L 710,213 L 700,215 L 690,218 L 680,222 L 670,228 L 660,232 L 650,238 L 640,243 L 630,247 L 620,250 L 610,252 L 600,253 L 590,254 L 580,254 L 570,253 L 560,251 L 550,248 L 540,244 L 530,240 L 520,236 L 510,233 L 500,231 L 490,230 L 480,230 L 470,232 L 460,235 L 450,238 L 440,242 L 430,245 L 420,247 L 410,248 L 400,248 L 390,247 L 380,245 L 370,242 L 360,239 L 350,237 L 340,236 L 330,236 L 320,237 L 310,239 L 300,242 L 290,245 L 280,249 L 270,252 L 260,254 L 250,255 L 240,255 L 230,254 L 220,252 L 210,250 L 200,247 L 190,245 L 180,244 L 170,244 L 160,245 L 150,247 L 140,250 L 130,254 L 125,260 L 122,268 L 120,277 L 119,287 L 119,297 L 120,307 L 122,317 L 125,327 L 128,337 L 130,347 L 131,357 L 131,367 L 130,377 L 128,387 L 125,395 L 122,402 L 120,408 L 119,414 L 119,420 L 120,426 L 122,432 L 125,438 L 130,443 L 135,447 L 142,450 L 150,452 L 158,453 L 167,453 L 176,452 L 185,450 L 194,448 L 203,446 L 212,445 L 221,445 L 230,446 L 239,448 L 248,450 L 257,452 L 266,453 L 275,453 L 284,452 L 293,450 L 302,448 L 311,446 L 320,445 L 329,445 L 338,446 L 347,448 L 356,450 L 365,452 L 374,453 L 383,453 L 392,452 L 401,450 L 410,448 L 419,446 L 428,445 L 437,445 L 446,446 L 455,448 L 464,450 L 473,452 L 482,453 L 491,453 L 500,452 L 509,450 L 518,448 L 527,446 L 536,445 L 545,445 L 554,446 L 563,448 L 572,450 L 581,452 L 590,453 L 599,453 L 608,452 L 617,450 L 626,448 L 635,446 L 644,445 L 653,445 L 662,446 L 671,448 L 680,450 L 689,451 L 698,451 L 707,450 L 716,448 L 725,445 L 734,442 L 743,439 L 752,437 L 761,436 L 770,436 L 779,437 L 788,439 L 797,442 L 806,445 L 815,448 L 824,450 L 833,451 L 842,451 L 851,450 L 860,448 L 869,445 L 878,442 L 887,438 L 895,433 L 900,428 L 903,422 L 905,415 L 905,408 L 903,401 L 900,394 L 897,387 L 895,380 L 894,373 L 894,366 L 895,359 L 897,352 L 900,345 L 903,338 L 905,331 L 905,324 L 903,317 L 900,310 L 897,303 L 895,296 L 894,289 L 894,282 L 895,275 L 897,268 L 900,261 L 903,254 L 905,247 L 905,240 Z"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Florida peninsula */}
              <path
                d="M 730,370 L 735,380 L 738,392 L 740,405 L 741,418 L 740,431 L 738,444 L 735,456 L 731,467 L 726,476 L 720,483 L 713,488 L 705,491 L 697,492 L 689,491 L 682,488 L 676,483 L 671,476 L 668,467 L 666,456 L 665,444 L 666,431 L 668,418 L 671,405 L 675,392 L 680,380 L 686,370 Z"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Alaska (scaled down, positioned top-left) */}
              <path
                d="M 50,80 L 80,75 L 110,78 L 140,85 L 165,95 L 185,108 L 200,123 L 208,140 L 210,158 L 205,175 L 195,188 L 180,197 L 162,202 L 142,202 L 122,197 L 104,188 L 88,175 L 75,158 L 67,140 L 63,120 L 62,100 L 65,85 Z"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              
              {/* Hawaii (positioned bottom-left) */}
              <ellipse cx="90" cy="520" rx="15" ry="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
              <ellipse cx="120" cy="525" rx="18" ry="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
              <ellipse cx="155" cy="520" rx="12" ry="7" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
              
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
