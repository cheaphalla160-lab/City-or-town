import { SpawnPoint, WordInfo, DifficultyConfig, LeaderboardEntry, GameDifficulty } from '../types/game';

export const SPAWN_POINTS: SpawnPoint[] = [
  // City Points (left half 0-100% of left side)
  {
    id: 'city-1',
    location: 'city',
    x: 22,
    y: 58,
    spotName: '玩具店和书店门前',
    spotNameEn: 'In front of the toy store',
    hint: 'Near the bookstore and colorful shops!'
  },
  {
    id: 'city-2',
    location: 'city',
    x: 62,
    y: 45,
    spotName: '大马路与公交车旁',
    spotNameEn: 'Next to the big blue city bus',
    hint: 'Watch out for the traffic and the bus!'
  },
  {
    id: 'city-3',
    location: 'city',
    x: 48,
    y: 24,
    spotName: '彩色摩天大厦楼顶',
    spotNameEn: 'Atop the green skyscraper',
    hint: 'High up in the city towers!'
  },
  {
    id: 'city-4',
    location: 'city',
    x: 82,
    y: 65,
    spotName: '斑马线与红绿灯路口',
    spotNameEn: 'By the crosswalk & bakery',
    hint: 'Crossing the busy avenue street!'
  },
  {
    id: 'city-5',
    location: 'city',
    x: 15,
    y: 35,
    spotName: '高楼露台窗口',
    spotNameEn: 'On the tall building balcony',
    hint: 'Looking out over the metropolis!'
  },
  {
    id: 'city-6',
    location: 'city',
    x: 35,
    y: 75,
    spotName: '人行道绿化树荫下',
    spotNameEn: 'Under the green sidewalk tree',
    hint: 'Resting by the avenue curb!'
  },

  // Town Points (right half 0-100% of right side)
  {
    id: 'town-1',
    location: 'town',
    x: 24,
    y: 68,
    spotName: '小镇面包房的长椅旁',
    spotNameEn: 'Beside the town bakery bench',
    hint: 'Smells like fresh warm bread!'
  },
  {
    id: 'town-2',
    location: 'town',
    x: 42,
    y: 42,
    spotName: '红屋顶小木屋门前',
    spotNameEn: 'In front of the red cottage',
    hint: 'At the cozy flower cottage!'
  },
  {
    id: 'town-3',
    location: 'town',
    x: 75,
    y: 56,
    spotName: '白栅栏与蓝色尖顶房边',
    spotNameEn: 'By the blue cottage fence',
    hint: 'Near the ivy and white picket fence!'
  },
  {
    id: 'town-4',
    location: 'town',
    x: 58,
    y: 25,
    spotName: '青青小山丘与弯曲小路',
    spotNameEn: 'On the winding hill path',
    hint: 'Walking up the peaceful green hill!'
  },
  {
    id: 'town-5',
    location: 'town',
    x: 48,
    y: 80,
    spotName: '鹅卵石路的小自行车旁',
    spotNameEn: 'Near the cobblestone bike rider',
    hint: 'Right along the cozy stone street!'
  },
  {
    id: 'town-6',
    location: 'town',
    x: 80,
    y: 78,
    spotName: '池塘小鸭子与花丛边',
    spotNameEn: 'Next to the garden flowers & ducklings',
    hint: 'Quack quack! By the flower garden!'
  }
];

export const VOCABULARY_DATA: WordInfo[] = [
  {
    word: 'city',
    phonetic: '/ˈsɪti/',
    meaning: 'A large and bustling metropolitan area with tall skyscrapers, busy streets, and lots of people.',
    chinese: '城市（高楼林立、车水马龙的大都市）',
    exampleSentence: 'The clown is in the city!',
    audioText: 'city. The clown is in the city!',
    visualHint: 'Tall skyscrapers, traffic lights, and double-decker buses!',
    funFact: 'Cities usually have subways, museums, and skyscrapers!'
  },
  {
    word: 'town',
    phonetic: '/taʊn/',
    meaning: 'A smaller cozy place with charming cottages, quiet streets, friendly neighbors, and green hills.',
    chinese: '小镇（温馨宁静、尖顶小屋、花草庭院的小镇）',
    rhymeKey: '-own',
    exampleSentence: 'The clown is in the town!',
    audioText: 'town. The clown is in the town!',
    visualHint: 'Cozy cottages, bakeries, picket fences, and cobblestones!',
    funFact: 'Town and Clown rhyme with the magical sound /aʊn/!'
  },
  {
    word: 'clown',
    phonetic: '/klaʊn/',
    meaning: 'A funny circus entertainer with a bright red nose, colorful costume, big smile, and balloons!',
    chinese: '小丑（红鼻子、五彩斑斓的马戏明星）',
    rhymeKey: '-own',
    exampleSentence: 'The clown has a red nose and balloons!',
    audioText: 'clown. Look at the funny happy clown!',
    visualHint: 'Red nose, rainbow hat, polka-dot clothes, and balloons!',
    funFact: 'Clowns make people laugh and smile all over the world!'
  }
];

export const DIFFICULTY_CONFIGS: Record<GameDifficulty, DifficultyConfig> = {
  easy: {
    name: 'Easy (慢速探索)',
    durationMs: 4500,
    label: '4.5秒',
    description: '适合低年级初学者，小丑停留时间充裕，有提示光晕',
    speedTag: 'Easy Pace'
  },
  normal: {
    name: 'Normal (标准冒险)',
    durationMs: 3200,
    label: '3.2秒',
    description: '标准课堂节奏，考验眼明手快与英语跟读',
    speedTag: 'Standard'
  },
  challenge: {
    name: 'Fast (极速挑战)',
    durationMs: 2000,
    label: '2.0秒',
    description: '闪电出没！看谁能眼疾手快快速锁定小丑',
    speedTag: 'Fast Challenge'
  }
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    name: 'Team Sunshine ☀️',
    score: 950,
    accuracy: 100,
    stars: 3,
    date: 'Today',
    badge: 'Master Detective'
  },
  {
    id: 'seed-2',
    name: 'Leo 🦁 (Group 1)',
    score: 880,
    accuracy: 95,
    stars: 3,
    date: 'Today',
    badge: 'Clown Catcher'
  },
  {
    id: 'seed-3',
    name: 'Emma 🎈 (Group 2)',
    score: 820,
    accuracy: 90,
    stars: 3,
    date: 'Today',
    badge: 'Town Explorer'
  },
  {
    id: 'seed-4',
    name: 'Star Group ⭐',
    score: 750,
    accuracy: 85,
    stars: 2,
    date: 'Yesterday',
    badge: 'City Scout'
  },
  {
    id: 'seed-5',
    name: 'Lucas 🚀',
    score: 690,
    accuracy: 80,
    stars: 2,
    date: 'Yesterday',
    badge: 'Phonics Star'
  }
];
