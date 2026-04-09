
export type EventCategory = 'news' | 'weather' | 'social';

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
  {
    id: '1',
    title: 'Digital Tech Summit 2024',
    description: 'A global gathering of technology leaders in Silicon Valley discussing the future of decentralized AI and its impact on global economies.',
    category: 'news',
    lat: 37.7749,
    lon: -122.4194,
    timestamp: '2024-03-20T10:00:00Z',
    intensity: 8
  },
  {
    id: '2',
    title: 'Cyclone Formation - Pacific',
    description: 'Satellite imagery indicates a developing low-pressure system in the central Pacific, expected to gain strength over the next 48 hours.',
    category: 'weather',
    lat: 15.0,
    lon: 160.0,
    timestamp: '2024-03-21T14:30:00Z',
    intensity: 9
  },
  {
    id: '3',
    title: 'Cultural Festival - Kyoto',
    description: 'The annual spring blossom festival has reached peak social media activity, with millions sharing virtual experiences of the city gardens.',
    category: 'social',
    lat: 35.0116,
    lon: 135.7681,
    timestamp: '2024-03-19T08:00:00Z',
    intensity: 6
  },
  {
    id: '4',
    title: 'Economic Forum - Zurich',
    description: 'European leaders meet to discuss new environmental regulations and sustainable finance frameworks for the upcoming decade.',
    category: 'news',
    lat: 47.3769,
    lon: 8.5417,
    timestamp: '2024-03-22T09:00:00Z',
    intensity: 7
  },
  {
    id: '5',
    title: 'Wildfire Monitoring - Amazon',
    description: 'Real-time thermal monitoring shows increased heat signatures in the eastern Amazon basin. Emergency teams are on standby.',
    category: 'weather',
    lat: -3.4653,
    lon: -62.2159,
    timestamp: '2024-03-18T16:45:00Z',
    intensity: 10
  },
  {
    id: '6',
    title: 'Global Hackathon Activity',
    description: 'Surge in collaborative coding platform activity originating from major tech hubs across India and Southeast Asia.',
    category: 'social',
    lat: 12.9716,
    lon: 77.5946,
    timestamp: '2024-03-21T20:00:00Z',
    intensity: 5
  },
  {
    id: '7',
    title: 'Infrastructure Project - Cape Town',
    description: 'Launch of the Southern Africa renewable energy grid expansion, aiming to provide clean power to millions.',
    category: 'news',
    lat: -33.9249,
    lon: 18.4241,
    timestamp: '2024-03-20T12:00:00Z',
    intensity: 7
  }
];
