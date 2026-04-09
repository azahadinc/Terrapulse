
export type EventCategory = 'news' | 'weather' | 'social' | 'politics' | 'trends';

export interface TerraEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  lat: number;
  lon: number;
  timestamp: string;
  intensity: number; // 1-10
}

export const MOCK_EVENTS: TerraEvent[] = [
  // NORTH AMERICA
  {
    id: 'na-1',
    title: 'Digital Tech Summit',
    description: 'A global gathering of technology leaders in Silicon Valley discussing the future of decentralized AI and its impact on global economies.',
    category: 'news',
    lat: 37.7749,
    lon: -122.4194,
    timestamp: '2024-03-20T10:00:00Z',
    intensity: 8
  },
  {
    id: 'na-2',
    title: 'Wall Street Market Shift',
    description: 'Unexpected volatility in the tech sector leads to a major repositioning of global investment funds.',
    category: 'trends',
    lat: 40.7128,
    lon: -74.0060,
    timestamp: '2024-03-21T15:30:00Z',
    intensity: 9
  },
  {
    id: 'na-3',
    title: 'Arctic Cold Front',
    description: 'Unseasonal cold air moving south from the Canadian territories, affecting agriculture in the Midwest.',
    category: 'weather',
    lat: 53.5461,
    lon: -113.4938,
    timestamp: '2024-03-19T06:00:00Z',
    intensity: 7
  },
  {
    id: 'na-4',
    title: 'Mexico City Art Biennale',
    description: 'A massive surge in cultural tourism as the city hosts its largest contemporary art festival in a decade.',
    category: 'social',
    lat: 19.4326,
    lon: -99.1332,
    timestamp: '2024-03-22T20:00:00Z',
    intensity: 6
  },

  // SOUTH AMERICA
  {
    id: 'sa-1',
    title: 'Amazon Reforestation Initiative',
    description: 'A landmark agreement between three nations to implement satellite-monitored protection zones in the rainforest.',
    category: 'politics',
    lat: -3.4653,
    lon: -62.2159,
    timestamp: '2024-03-18T16:45:00Z',
    intensity: 10
  },
  {
    id: 'sa-2',
    title: 'Buenos Aires Tech Hub Expansion',
    description: 'New incentives for digital nomads lead to a 40% increase in remote workers relocating to the Argentinian capital.',
    category: 'trends',
    lat: -34.6037,
    lon: -58.3816,
    timestamp: '2024-03-23T12:00:00Z',
    intensity: 7
  },
  {
    id: 'sa-3',
    title: 'Rio Carnival Data Pulse',
    description: 'Social media activity peaks globally as the annual festival reaches its spectacular finale.',
    category: 'social',
    lat: -22.9068,
    lon: -43.1729,
    timestamp: '2024-03-20T22:00:00Z',
    intensity: 9
  },
  {
    id: 'sa-4',
    title: 'Andean Geothermal Project',
    description: 'Breakthrough in sustainable energy as the first large-scale geothermal plant begins operations in Chile.',
    category: 'news',
    lat: -33.4489,
    lon: -70.6693,
    timestamp: '2024-03-24T09:00:00Z',
    intensity: 8
  },

  // EUROPE
  {
    id: 'eu-1',
    title: 'Brussels Climate Accord',
    description: 'European Parliament votes on a sweeping new set of regulations for carbon-neutral industrial production.',
    category: 'politics',
    lat: 50.8503,
    lon: 4.3517,
    timestamp: '2024-03-23T11:00:00Z',
    intensity: 9
  },
  {
    id: 'eu-2',
    title: 'London Fintech Surge',
    description: 'Record-breaking investments in blockchain-based banking platforms reported by the City of London.',
    category: 'news',
    lat: 51.5074,
    lon: -0.1278,
    timestamp: '2024-03-21T09:00:00Z',
    intensity: 7
  },
  {
    id: 'eu-3',
    title: 'Berlin Green Infrastructure',
    description: 'The city announces a complete transition of public transit to hydrogen-powered vehicles by 2030.',
    category: 'trends',
    lat: 52.5200,
    lon: 13.4050,
    timestamp: '2024-03-19T14:00:00Z',
    intensity: 6
  },
  {
    id: 'eu-4',
    title: 'Paris Fashion Evolution',
    description: 'The latest runway shows spark a global conversation about ethical manufacturing and textile recycling.',
    category: 'trends',
    lat: 48.8566,
    lon: 2.3522,
    timestamp: '2024-03-22T15:00:00Z',
    intensity: 8
  },
  {
    id: 'eu-5',
    title: 'Scandinavian Storm System',
    description: 'High-intensity winds and heavy snowfall affecting maritime routes in the North Sea.',
    category: 'weather',
    lat: 59.9139,
    lon: 10.7522,
    timestamp: '2024-03-24T03:00:00Z',
    intensity: 7
  },

  // AFRICA
  {
    id: 'af-1',
    title: 'Lagos Tech Ecosystem Growth',
    description: 'A new venture capital fund focused on West African entrepreneurs reaches its first billion-dollar milestone.',
    category: 'news',
    lat: 6.5244,
    lon: 3.3792,
    timestamp: '2024-03-22T10:00:00Z',
    intensity: 8
  },
  {
    id: 'af-2',
    title: 'Cairo Renewable Mega-Project',
    description: 'Inauguration of one of the world\'s largest solar arrays in the Egyptian desert.',
    category: 'news',
    lat: 30.0444,
    lon: 31.2357,
    timestamp: '2024-03-20T14:00:00Z',
    intensity: 9
  },
  {
    id: 'af-3',
    title: 'Nairobi Social Innovation Hub',
    description: 'Youth-led digital activism platform goes viral, connecting communities for water management projects.',
    category: 'social',
    lat: -1.2921,
    lon: 36.8219,
    timestamp: '2024-03-21T18:00:00Z',
    intensity: 7
  },
  {
    id: 'af-4',
    title: 'Johannesburg Economic Summit',
    description: 'Leaders from across the continent meet to discuss the implementation of a unified digital currency.',
    category: 'politics',
    lat: -26.2041,
    lon: 28.0473,
    timestamp: '2024-03-19T11:00:00Z',
    intensity: 8
  },

  // ASIA
  {
    id: 'as-1',
    title: 'Tokyo Robotics Expo',
    description: 'The unveiling of new companion robots designed for elder care sparks ethics debates worldwide.',
    category: 'news',
    lat: 35.6762,
    lon: 139.6503,
    timestamp: '2024-03-21T02:00:00Z',
    intensity: 8
  },
  {
    id: 'as-2',
    title: 'Seoul Esports Championship',
    description: 'Record viewership numbers as the global finals reach their climax in a sold-out stadium.',
    category: 'trends',
    lat: 37.5665,
    lon: 126.9780,
    timestamp: '2024-03-23T19:00:00Z',
    intensity: 9
  },
  {
    id: 'as-3',
    title: 'Delhi Legislative Shift',
    description: 'Significant policy changes in the agricultural sector lead to nationwide discussions on food security.',
    category: 'politics',
    lat: 28.6139,
    lon: 77.2090,
    timestamp: '2024-03-24T08:00:00Z',
    intensity: 9
  },
  {
    id: 'as-4',
    title: 'Singapore Smart City Initiative',
    description: 'Deployment of AI-driven traffic and energy management systems across the entire city-state.',
    category: 'trends',
    lat: 1.3521,
    lon: 103.8198,
    timestamp: '2024-03-20T12:00:00Z',
    intensity: 7
  },
  {
    id: 'as-5',
    title: 'Himalayan Melting Rate Alert',
    description: 'New satellite data shows an unprecedented rate of glacial retreat, triggering regional water alerts.',
    category: 'weather',
    lat: 27.9881,
    lon: 86.9250,
    timestamp: '2024-03-18T04:00:00Z',
    intensity: 10
  },
  {
    id: 'as-6',
    title: 'Beijing Space Station Expansion',
    description: 'Successful docking of the newest research module, establishing a permanent deep-space monitoring lab.',
    category: 'news',
    lat: 39.9042,
    lon: 116.4074,
    timestamp: '2024-03-22T03:00:00Z',
    intensity: 8
  },

  // OCEANIA
  {
    id: 'oc-1',
    title: 'Sydney Coral Recovery Study',
    description: 'Marine biologists report a higher-than-expected recovery rate in the northern Great Barrier Reef.',
    category: 'news',
    lat: -33.8688,
    lon: 151.2093,
    timestamp: '2024-03-21T10:00:00Z',
    intensity: 7
  },
  {
    id: 'oc-2',
    title: 'Auckland Social Media Trend',
    description: 'New Zealand\'s unique "Slow Travel" movement becomes the top trending lifestyle topic globally.',
    category: 'social',
    lat: -36.8485,
    lon: 174.7633,
    timestamp: '2024-03-20T21:00:00Z',
    intensity: 6
  },
  {
    id: 'oc-3',
    title: 'Outback Heat Warning',
    description: 'Extreme temperature peaks recorded across central Australia, impacting local wildlife and logistics.',
    category: 'weather',
    lat: -25.2744,
    lon: 133.7751,
    timestamp: '2024-03-22T14:00:00Z',
    intensity: 9
  },

  // MIDDLE EAST
  {
    id: 'me-1',
    title: 'Riyadh Energy Transformation',
    description: 'Major investments in green hydrogen production facilities to diversify the national energy portfolio.',
    category: 'politics',
    lat: 24.7136,
    lon: 46.6753,
    timestamp: '2024-03-19T10:00:00Z',
    intensity: 8
  },
  {
    id: 'me-2',
    title: 'Dubai Future Forum',
    description: 'International delegates meet to discuss urban living solutions for hyper-arid climates.',
    category: 'trends',
    lat: 25.2048,
    lon: 55.2708,
    timestamp: '2024-03-24T16:00:00Z',
    intensity: 7
  }
];
