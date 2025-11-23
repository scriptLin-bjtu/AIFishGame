
import { FishSpecies, Rarity, Rod, Bait, Location, Achievement } from './types';

export const LEVEL_SCALING_FACTOR = 1.5;

export const LOCATIONS: Location[] = [
  { 
    id: 'loc_beach', 
    name: '阳光海滩', 
    levelReq: 1, 
    description: '风平浪静的新手钓点，适合练习。',
    bgGradient: 'from-sky-300 via-cyan-200 to-blue-400'
  },
  { 
    id: 'loc_mangrove', 
    name: '神秘红树林', 
    levelReq: 3, 
    description: '半咸水水域，栖息着色彩斑斓的鱼类。',
    bgGradient: 'from-emerald-400 via-teal-500 to-green-800'
  },
  { 
    id: 'loc_reef', 
    name: '绚丽珊瑚礁', 
    levelReq: 5, 
    description: '温暖的热带水域，生物多样性的天堂。',
    bgGradient: 'from-cyan-300 via-blue-500 to-purple-600'
  },
  { 
    id: 'loc_deep_sea', 
    name: '深海裂隙', 
    levelReq: 8, 
    description: '只有资深钓手才敢挑战的黑暗深渊。',
    bgGradient: 'from-blue-900 via-indigo-900 to-black'
  },
  { 
    id: 'loc_arctic', 
    name: '极寒冰川', 
    levelReq: 12, 
    description: '零下的极限挑战，只有最坚韧的鱼类能在此生存。',
    bgGradient: 'from-slate-200 via-sky-300 to-blue-900'
  }
];

export const BAITS: Bait[] = [
  { id: 'bait_bread', name: '面包屑', price: 0, description: '无限供应，但很难吸引大鱼。', rarityBonus: 1.0, speedBonus: 1.0, icon: '🍞' },
  { id: 'bait_worm', name: '红蚯蚓', price: 20, description: '鱼儿的最爱，咬钩速度稍快。', rarityBonus: 1.2, speedBonus: 1.5, icon: '🪱' },
  { id: 'bait_krill', name: '南极磷虾', price: 100, description: '美味多汁，大幅提升稀有度。', rarityBonus: 2.5, speedBonus: 1.2, icon: '🦐' },
  { id: 'bait_magic', name: '发光魔饵', price: 500, description: '散发神秘光芒，传说巨物无法抗拒。', rarityBonus: 5.0, speedBonus: 2.0, icon: '✨' },
];

export const RODS: Rod[] = [
  { id: 'rod_bamboo', name: '竹竿', power: 20, price: 0, levelReq: 1 },
  { id: 'rod_fiberglass', name: '玻璃纤维竿', power: 35, price: 500, levelReq: 3 },
  { id: 'rod_carbon', name: '碳素大师', power: 50, price: 2000, levelReq: 5 },
  { id: 'rod_titanium', name: '海神之怒', power: 75, price: 10000, levelReq: 10 },
];

export const FISH_SPECIES: FishSpecies[] = [
  // --- Beach Fish ---
  { id: 'fish_sardine', name: '沙丁鱼', rarity: Rarity.COMMON, basePrice: 10, difficulty: 10, minWeight: 0.1, maxWeight: 0.3, icon: '🐟', color: 'text-gray-300', locationIds: ['loc_beach'] },
  { id: 'fish_clownfish', name: '小丑鱼', rarity: Rarity.COMMON, basePrice: 30, difficulty: 20, minWeight: 0.2, maxWeight: 0.5, icon: '🐠', color: 'text-orange-400', locationIds: ['loc_beach', 'loc_mangrove', 'loc_reef'] },
  { id: 'fish_puffer', name: '河豚', rarity: Rarity.RARE, basePrice: 120, difficulty: 40, minWeight: 1, maxWeight: 3, icon: '🐡', color: 'text-yellow-200', locationIds: ['loc_beach'] },
  
  // --- Mangrove Fish ---
  { id: 'fish_carp', name: '红鲤鱼', rarity: Rarity.COMMON, basePrice: 40, difficulty: 25, minWeight: 1, maxWeight: 5, icon: '🐟', color: 'text-red-400', locationIds: ['loc_mangrove'] },
  { id: 'fish_bass', name: '大口黑鲈', rarity: Rarity.RARE, basePrice: 150, difficulty: 50, minWeight: 2, maxWeight: 8, icon: '🐟', color: 'text-green-700', locationIds: ['loc_mangrove'] },
  { id: 'fish_turtle', name: '绿海龟', rarity: Rarity.EPIC, basePrice: 600, difficulty: 65, minWeight: 20, maxWeight: 80, icon: '🐢', color: 'text-green-400', locationIds: ['loc_beach', 'loc_mangrove', 'loc_reef'] },

  // --- Coral Reef Fish (New) ---
  { id: 'fish_tang', name: '蓝倒吊', rarity: Rarity.COMMON, basePrice: 50, difficulty: 30, minWeight: 0.3, maxWeight: 0.8, icon: '🐠', color: 'text-blue-500', locationIds: ['loc_reef'] },
  { id: 'fish_lionfish', name: '狮子鱼', rarity: Rarity.RARE, basePrice: 200, difficulty: 45, minWeight: 0.5, maxWeight: 1.5, icon: '🐠', color: 'text-red-500', locationIds: ['loc_reef'] },
  { id: 'fish_manta', name: '魔鬼鱼', rarity: Rarity.EPIC, basePrice: 700, difficulty: 60, minWeight: 10, maxWeight: 50, icon: '🦇', color: 'text-gray-700', locationIds: ['loc_reef'] },

  // --- Deep Sea Fish ---
  { id: 'fish_tuna', name: '蓝鳍金枪鱼', rarity: Rarity.RARE, basePrice: 250, difficulty: 55, minWeight: 40, maxWeight: 120, icon: '🐟', color: 'text-blue-600', locationIds: ['loc_deep_sea'] },
  { id: 'fish_squid', name: '大王乌贼', rarity: Rarity.EPIC, basePrice: 900, difficulty: 75, minWeight: 100, maxWeight: 300, icon: '🦑', color: 'text-pink-600', locationIds: ['loc_deep_sea'] },
  { id: 'fish_angler', name: '鮟鱇鱼', rarity: Rarity.EPIC, basePrice: 800, difficulty: 70, minWeight: 5, maxWeight: 20, icon: '🏮', color: 'text-indigo-600', locationIds: ['loc_deep_sea'] },

  // --- Arctic Fish (New) ---
  { id: 'fish_cod', name: '北极鳕鱼', rarity: Rarity.COMMON, basePrice: 60, difficulty: 35, minWeight: 2, maxWeight: 10, icon: '🐟', color: 'text-slate-400', locationIds: ['loc_arctic'] },
  { id: 'fish_kingcrab', name: '帝王蟹', rarity: Rarity.RARE, basePrice: 400, difficulty: 65, minWeight: 3, maxWeight: 8, icon: '🦀', color: 'text-red-600', locationIds: ['loc_arctic'] },
  { id: 'fish_narwhal', name: '独角鲸', rarity: Rarity.LEGENDARY, basePrice: 3500, difficulty: 88, minWeight: 800, maxWeight: 1600, icon: '🦄', color: 'text-gray-300', locationIds: ['loc_arctic'] },
  
  // --- Legendary (Global or Specific) ---
  { id: 'fish_swordfish', name: '皇冠剑鱼', rarity: Rarity.LEGENDARY, basePrice: 2500, difficulty: 85, minWeight: 80, maxWeight: 250, icon: '🗡️', color: 'text-purple-400', locationIds: ['loc_mangrove', 'loc_deep_sea', 'loc_reef'] },
  { id: 'fish_shark', name: '大白鲨', rarity: Rarity.LEGENDARY, basePrice: 3000, difficulty: 90, minWeight: 600, maxWeight: 1500, icon: '🦈', color: 'text-gray-500', locationIds: ['loc_deep_sea', 'loc_reef'] },
  { id: 'fish_whale', name: '梦幻蓝鲸', rarity: Rarity.LEGENDARY, basePrice: 8000, difficulty: 95, minWeight: 3000, maxWeight: 10000, icon: '🐋', color: 'text-blue-300', locationIds: ['loc_deep_sea', 'loc_arctic'] },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_novice', title: '钓鱼新手', description: '累计钓到 5 条鱼。', icon: '🎣', type: 'TOTAL_CATCH', targetValue: 5, rewardGold: 50, rewardXp: 50 },
  { id: 'ach_amateur', title: '熟练工', description: '累计钓到 20 条鱼。', icon: '🧺', type: 'TOTAL_CATCH', targetValue: 20, rewardGold: 200, rewardXp: 150 },
  { id: 'ach_master', title: '钓鱼大师', description: '累计钓到 50 条鱼。', icon: '👑', type: 'TOTAL_CATCH', targetValue: 50, rewardGold: 1000, rewardXp: 500 },
  { id: 'ach_collector_1', title: '生物学家', description: '图鉴中收集 5 种不同的鱼。', icon: '📖', type: 'SPECIES_COUNT', targetValue: 5, rewardGold: 300, rewardXp: 300 },
  { id: 'ach_legend', title: '海怪猎人', description: '钓到 1 条传说级(Legendary)鱼类。', icon: '👹', type: 'LEGENDARY_COUNT', targetValue: 1, rewardGold: 2000, rewardXp: 1000 },
  { id: 'ach_rich', title: '第一桶金', description: '累计获得 1000 金币。', icon: '💰', type: 'GOLD_EARNED', targetValue: 1000, rewardGold: 100, rewardXp: 100 },
];

export const RARITY_COLORS = {
  [Rarity.COMMON]: 'bg-gray-500 border-gray-400',
  [Rarity.RARE]: 'bg-blue-500 border-blue-400',
  [Rarity.EPIC]: 'bg-purple-600 border-purple-400',
  [Rarity.LEGENDARY]: 'bg-yellow-500 border-yellow-300',
};

export const XP_TABLE = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 6000, 8000, 12000];
