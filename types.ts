
export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export interface FishSpecies {
  id: string;
  name: string;
  rarity: Rarity;
  basePrice: number;
  difficulty: number; // 1-100, speed of movement in minigame
  minWeight: number;
  maxWeight: number;
  icon: string; // Emoji or URL
  color: string; // Tailwind color class for identification
  locationIds: string[]; // Where can this fish be caught?
}

export interface CaughtFish {
  id: string;
  speciesId: string;
  speciesName: string;
  weight: number;
  price: number;
  rarity: Rarity;
  caughtAt: number;
  lore?: string; // AI Generated description
  inAquarium: boolean;
  icon: string; // Snapshot of the icon
}

export interface Rod {
  id: string;
  name: string;
  power: number; // Affects bar size in minigame
  price: number;
  levelReq: number;
}

export interface Bait {
  id: string;
  name: string;
  price: number;
  description: string;
  rarityBonus: number; // Multiplier for rare fish chance
  speedBonus: number; // Multiplier for bite speed (1.2 = 20% faster)
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  levelReq: number;
  description: string;
  bgGradient: string; // CSS Class for background
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'TOTAL_CATCH' | 'SPECIES_COUNT' | 'GOLD_EARNED' | 'LEGENDARY_COUNT' | 'LOCATION_UNLOCK';
  targetValue: number;
  rewardGold: number;
  rewardXp: number;
}

export interface GameStats {
  totalFishCaught: number;
  uniqueSpeciesCaught: string[]; // List of species IDs
  legendaryCaught: number;
  totalGoldEarned: number; // Cumulative
}

export interface GameState {
  gold: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  inventory: CaughtFish[];
  
  // Equipment
  equippedRodId: string;
  unlockedRods: string[];
  
  // Locations
  currentLocationId: string;
  
  // Baits
  selectedBaitId: string;
  baitInventory: Record<string, number>; // baitId -> count
  
  maxInventory: number;
  
  // Achievements & Stats
  stats: GameStats;
  completedAchievementIds: string[];
}

export type ViewState = 'FISHING' | 'AQUARIUM' | 'SHOP' | 'ACHIEVEMENTS';
