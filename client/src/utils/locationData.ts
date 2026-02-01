// Location data for bachelor/bachelorette trip planning
// Includes USA states/cities and major international destinations

export const locationData = {
  US: {
    label: 'United States',
    type: 'country',
    states: {
      AL: {
        label: 'Alabama',
        cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Auburn']
      },
      AK: {
        label: 'Alaska',
        cities: ['Anchorage', 'Juneau', 'Fairbanks']
      },
      AZ: {
        label: 'Arizona',
        cities: ['Phoenix', 'Scottsdale', 'Sedona', 'Tucson', 'Flagstaff']
      },
      AR: {
        label: 'Arkansas',
        cities: ['Little Rock', 'Fayetteville', 'Hot Springs']
      },
      CA: {
        label: 'California',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Las Vegas', 'Napa Valley', 'Malibu', 'Palm Springs', 'Santa Barbara']
      },
      CO: {
        label: 'Colorado',
        cities: ['Denver', 'Aspen', 'Boulder', 'Vail', 'Fort Collins']
      },
      CT: {
        label: 'Connecticut',
        cities: ['Hartford', 'New Haven', 'Stamford']
      },
      DE: {
        label: 'Delaware',
        cities: ['Wilmington', 'Dover', 'Rehoboth Beach']
      },
      FL: {
        label: 'Florida',
        cities: ['Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'Key West', 'Miami Beach', 'Daytona Beach', 'Naples']
      },
      GA: {
        label: 'Georgia',
        cities: ['Atlanta', 'Savannah', 'Augusta', 'Athens']
      },
      HI: {
        label: 'Hawaii',
        cities: ['Honolulu', 'Maui', 'Kauai', 'Big Island', 'Lanai']
      },
      ID: {
        label: 'Idaho',
        cities: ['Boise', 'Sun Valley', 'Coeur d\'Alene']
      },
      IL: {
        label: 'Illinois',
        cities: ['Chicago', 'Naperville', 'Springfield']
      },
      IN: {
        label: 'Indiana',
        cities: ['Indianapolis', 'Fort Wayne', 'Evansville']
      },
      IA: {
        label: 'Iowa',
        cities: ['Des Moines', 'Cedar Rapids', 'Iowa City']
      },
      KS: {
        label: 'Kansas',
        cities: ['Kansas City', 'Topeka', 'Wichita']
      },
      KY: {
        label: 'Kentucky',
        cities: ['Louisville', 'Lexington', 'Bowling Green']
      },
      LA: {
        label: 'Louisiana',
        cities: ['New Orleans', 'Baton Rouge', 'Lafayette']
      },
      ME: {
        label: 'Maine',
        cities: ['Portland', 'Bar Harbor', 'Acadia']
      },
      MD: {
        label: 'Maryland',
        cities: ['Baltimore', 'Annapolis', 'Ocean City']
      },
      MA: {
        label: 'Massachusetts',
        cities: ['Boston', 'Cape Cod', 'Martha\'s Vineyard', 'Worcester']
      },
      MI: {
        label: 'Michigan',
        cities: ['Detroit', 'Grand Rapids', 'Traverse City', 'Ann Arbor']
      },
      MN: {
        label: 'Minnesota',
        cities: ['Minneapolis', 'St. Paul', 'Duluth']
      },
      MS: {
        label: 'Mississippi',
        cities: ['Jackson', 'Biloxi', 'Gulfport']
      },
      MO: {
        label: 'Missouri',
        cities: ['St. Louis', 'Kansas City', 'Branson']
      },
      MT: {
        label: 'Montana',
        cities: ['Missoula', 'Bozeman', 'Big Sky', 'Billings']
      },
      NE: {
        label: 'Nebraska',
        cities: ['Omaha', 'Lincoln', 'Grand Island']
      },
      NV: {
        label: 'Nevada',
        cities: ['Las Vegas', 'Reno', 'Lake Tahoe']
      },
      NH: {
        label: 'New Hampshire',
        cities: ['Manchester', 'Portsmouth', 'White Mountains']
      },
      NJ: {
        label: 'New Jersey',
        cities: ['Newark', 'Atlantic City', 'Cape May', 'Trenton']
      },
      NM: {
        label: 'New Mexico',
        cities: ['Albuquerque', 'Santa Fe', 'Taos']
      },
      NY: {
        label: 'New York',
        cities: ['New York City', 'The Hamptons', 'Niagara Falls', 'Ithaca', 'Albany']
      },
      NC: {
        label: 'North Carolina',
        cities: ['Charlotte', 'Raleigh', 'Outer Banks', 'Asheville']
      },
      ND: {
        label: 'North Dakota',
        cities: ['Bismarck', 'Fargo', 'Grand Forks']
      },
      OH: {
        label: 'Ohio',
        cities: ['Columbus', 'Cleveland', 'Cincinnati']
      },
      OK: {
        label: 'Oklahoma',
        cities: ['Oklahoma City', 'Tulsa', 'Norman']
      },
      OR: {
        label: 'Oregon',
        cities: ['Portland', 'Bend', 'Eugene', 'Crater Lake']
      },
      PA: {
        label: 'Pennsylvania',
        cities: ['Philadelphia', 'Pittsburgh', 'Lancaster', 'Poconos']
      },
      RI: {
        label: 'Rhode Island',
        cities: ['Providence', 'Newport', 'Warwick']
      },
      SC: {
        label: 'South Carolina',
        cities: ['Charleston', 'Myrtle Beach', 'Hilton Head']
      },
      SD: {
        label: 'South Dakota',
        cities: ['Sioux Falls', 'Rapid City', 'Mount Rushmore']
      },
      TN: {
        label: 'Tennessee',
        cities: ['Nashville', 'Memphis', 'Gatlinburg', 'Pigeon Forge']
      },
      TX: {
        label: 'Texas',
        cities: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'South Padre Island']
      },
      UT: {
        label: 'Utah',
        cities: ['Salt Lake City', 'Moab', 'Park City', 'Zion']
      },
      VT: {
        label: 'Vermont',
        cities: ['Burlington', 'Stowe', 'Montpelier']
      },
      VA: {
        label: 'Virginia',
        cities: ['Alexandria', 'Virginia Beach', 'Richmond', 'Colonial Williamsburg']
      },
      WA: {
        label: 'Washington',
        cities: ['Seattle', 'Spokane', 'Bellingham', 'San Juan Islands']
      },
      WV: {
        label: 'West Virginia',
        cities: ['Charleston', 'Huntington', 'Harpers Ferry']
      },
      WI: {
        label: 'Wisconsin',
        cities: ['Milwaukee', 'Madison', 'Door County']
      },
      WY: {
        label: 'Wyoming',
        cities: ['Jackson Hole', 'Yellowstone', 'Cheyenne']
      }
    }
  },
  MEXICO: {
    label: 'Mexico',
    type: 'country',
    states: {
      CANCUN: { label: 'Cancún' },
      PLAYA: { label: 'Playa del Carmen' },
      MEXICO_CITY: { label: 'Mexico City' },
      ACAPULCO: { label: 'Acapulco' },
      CABO: { label: 'Cabo San Lucas' },
      PUERTO: { label: 'Puerto Vallarta' }
    }
  },
  CANADA: {
    label: 'Canada',
    type: 'country',
    states: {
      AB: { label: 'Alberta - Calgary, Banff, Lake Louise' },
      BC: { label: 'British Columbia - Vancouver, Victoria' },
      MB: { label: 'Manitoba - Winnipeg' },
      NB: { label: 'New Brunswick' },
      NL: { label: 'Newfoundland' },
      NS: { label: 'Nova Scotia - Halifax' },
      ON: { label: 'Ontario - Toronto, Niagara, Ottawa' },
      PE: { label: 'Prince Edward Island' },
      QC: { label: 'Quebec - Montreal, Quebec City' },
      SK: { label: 'Saskatchewan' }
    }
  },
  CARIBBEAN: {
    label: 'Caribbean',
    type: 'region',
    destinations: {
      BAHAMAS: { label: 'Bahamas - Nassau, Bimini' },
      BARBADOS: { label: 'Barbados - Bridgetown' },
      JAMAICA: { label: 'Jamaica - Montego Bay, Negril' },
      TURKS: { label: 'Turks & Caicos' },
      PUERTO_RICO: { label: 'Puerto Rico - San Juan, Vieques' },
      USVI: { label: 'US Virgin Islands - St. Thomas, St. John' },
      BVI: { label: 'British Virgin Islands' },
      ARUBA: { label: 'Aruba' },
      CURACAO: { label: 'Curaçao' }
    }
  },
  EUROPE: {
    label: 'Europe',
    type: 'region',
    countries: {
      UK: { label: 'United Kingdom - London, Edinburgh, Ibiza' },
      FRANCE: { label: 'France - Paris, Riviera, Provence' },
      SPAIN: { label: 'Spain - Barcelona, Madrid, Valencia' },
      ITALY: { label: 'Italy - Rome, Milan, Amalfi Coast' },
      GREECE: { label: 'Greece - Athens, Mykonos, Santorini' },
      PORTUGAL: { label: 'Portugal - Lisbon, Porto' },
      NETHERLANDS: { label: 'Netherlands - Amsterdam' },
      GERMANY: { label: 'Germany - Berlin, Munich' },
      SWITZERLAND: { label: 'Switzerland - Zurich, Interlaken' },
      AUSTRIA: { label: 'Austria - Vienna, Salzburg' }
    }
  },
  ASIA: {
    label: 'Asia',
    type: 'region',
    countries: {
      THAILAND: { label: 'Thailand - Bangkok, Phuket, Krabi' },
      JAPAN: { label: 'Japan - Tokyo, Kyoto, Osaka' },
      VIETNAM: { label: 'Vietnam - Hanoi, Ho Chi Minh' },
      PHILIPPINES: { label: 'Philippines - Manila, Boracay' },
      INDIA: { label: 'India - Goa, Mumbai, Rajasthan' },
      BALI: { label: 'Bali, Indonesia' },
      SINGAPORE: { label: 'Singapore' },
      SOUTH_KOREA: { label: 'South Korea - Seoul' }
    }
  },
  OTHER: {
    label: 'Other Destinations',
    type: 'region',
    countries: {
      AUSTRALIA: { label: 'Australia - Sydney, Melbourne, Gold Coast' },
      BRAZIL: { label: 'Brazil - Rio, São Paulo' },
      ARGENTINA: { label: 'Argentina - Buenos Aires' },
      SOUTH_AFRICA: { label: 'South Africa - Cape Town, Johannesburg' },
      NEW_ZEALAND: { label: 'New Zealand - Auckland, Queenstown' }
    }
  }
};

// Activity suggestions by location
export const activitySuggestions: { [key: string]: string[] } = {
  'Miami': ['Beach clubs', 'Nightlife', 'Water sports', 'Art Deco district tour', 'Party boats'],
  'Las Vegas': ['Nightclubs', 'Casino night', 'Shows', 'Pool parties', 'Helicopter tours'],
  'New Orleans': ['French Quarter bars', 'Live music clubs', 'Boat tours', 'Jazz concerts', 'Food tours'],
  'Cancun': ['Beach day', 'Snorkeling', 'Club hopping', 'Cenote adventure', 'Water sports'],
  'Cabo San Lucas': ['Beach clubs', 'Deep sea fishing', 'Sunset cruise', 'Golf', 'ATV tours'],
  'New York City': ['Rooftop bars', 'Broadway show', 'Club crawl', 'Cigar lounge', 'Comedy show'],
  'Scottsdale': ['Golf tournament', 'Desert ATV', 'Spa day', 'Wine tasting', 'Pool party'],
  'Nashville': ['Honky Tonk Central', 'Live music venues', 'Bar crawl', 'Brewery tour', 'Line dancing'],
  'Austin': ['Live music', 'Food tours', 'Club hopping', 'Kayaking', 'Brewery tour'],
  'Bali': ['Beach clubs', 'Hiking adventure', 'Spa day', 'Nightlife', 'Water sports'],
  'Barcelona': ['Beach party', 'Flamenco show', 'Bar crawl', 'Football match', 'Club night'],
  'Mykonos': ['Beach club', 'Sunset party', 'Nightclub', 'Yacht party', 'Beach volleyball'],
};

export const getLocationKey = (state: string, city: string): string => {
  return `${state}-${city}`;
};

export const getActivities = (location: string): string[] => {
  return activitySuggestions[location] || [
    'Local dining',
    'Sightseeing',
    'Outdoor activities',
    'Nightlife',
    'Adventure sports'
  ];
};
