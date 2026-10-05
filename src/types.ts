export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  imageUrl?: string;
  createdAt: number;
  status?: 'unrated' | 'learning' | 'mastered';
  tags?: string[];
}

export type ModalMode = 'none' | 'add' | 'edit' | 'delete' | 'search' | 'export_import';

export type Theme = 'light' | 'dark';

export const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'starter-1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    imageUrl: '/src/assets/images/eiffel_tower_paris_1790620344319.jpg',
    createdAt: 1727500000000,
    status: 'unrated',
    tags: ['Geography', 'Europe'],
  },
  {
    id: 'starter-2',
    question: 'What does DNA stand for?',
    answer: 'Deoxyribonucleic acid',
    imageUrl: '/src/assets/images/dna_double_helix_1790620363595.jpg',
    createdAt: 1727500010000,
    status: 'unrated',
    tags: ['Science', 'Biology'],
  },
  {
    id: 'starter-3',
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
    imageUrl: '/src/assets/images/mars_red_planet_1790620377946.jpg',
    createdAt: 1727500020000,
    status: 'unrated',
    tags: ['Science', 'Astronomy'],
  },
  {
    id: 'starter-4',
    question: 'What is the time complexity of binary search?',
    answer: 'O(log n), because the search interval is halved in each step.',
    imageUrl: '/src/assets/images/binary_search_diagram_1790620395744.jpg',
    createdAt: 1727500030000,
    status: 'unrated',
    tags: ['Computer Science', 'Algorithms'],
  },
  {
    id: 'starter-5',
    question: 'What is photosynthesis?',
    answer: 'The biological process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.',
    imageUrl: '/src/assets/images/plant_photosynthesis_1790620409810.jpg',
    createdAt: 1727500040000,
    status: 'unrated',
    tags: ['Science', 'Biology'],
  },
  {
    id: 'starter-6',
    question: 'What is the speed of light in a vacuum?',
    answer: 'Approximately 299,792 kilometers per second (or about 186,282 miles per second).',
    imageUrl: '/src/assets/images/speed_of_light_1790621942319.jpg',
    createdAt: 1727500050000,
    status: 'unrated',
    tags: ['Science', 'Physics'],
  },
  {
    id: 'starter-7',
    question: 'Which organ produces insulin in the human body?',
    answer: 'The pancreas (specifically the beta cells located in the islets of Langerhans).',
    imageUrl: '/src/assets/images/human_pancreas_1790621960747.jpg',
    createdAt: 1727500060000,
    status: 'unrated',
    tags: ['Science', 'Medicine'],
  },
  {
    id: 'starter-8',
    question: 'What is the deepest known location in Earth’s oceans?',
    answer: 'The Mariana Trench (specifically Challenger Deep, reaching approximately 10,994 meters / 36,070 feet deep).',
    imageUrl: '/src/assets/images/mariana_trench_1790621975288.jpg',
    createdAt: 1727500070000,
    status: 'unrated',
    tags: ['Geography', 'Earth Science'],
  },
  {
    id: 'starter-9',
    question: 'What is the most abundant gas in Earth’s atmosphere?',
    answer: 'Nitrogen gas (N₂), constituting about 78% of Earth’s atmosphere by volume, followed by Oxygen at roughly 21%.',
    imageUrl: '/src/assets/images/earth_atmosphere_1790621989210.jpg',
    createdAt: 1727500080000,
    status: 'unrated',
    tags: ['Science', 'Earth Science'],
  },
  {
    id: 'starter-10',
    question: 'Who painted the famous masterpiece "The Starry Night"?',
    answer: 'Vincent van Gogh, painted in June 1889 depicting the view from his asylum room in Saint-Rémy-de-Provence.',
    imageUrl: '/src/assets/images/starry_night_sky_1790622004063.jpg',
    createdAt: 1727500090000,
    status: 'unrated',
    tags: ['Arts', 'History'],
  },
];
