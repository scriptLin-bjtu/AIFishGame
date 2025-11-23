
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, ViewState, FishSpecies, CaughtFish, Rarity, Rod, Bait, Location, GameStats } from './types';
import { FISH_SPECIES, RODS, XP_TABLE, LEVEL_SCALING_FACTOR, BAITS, LOCATIONS, ACHIEVEMENTS } from './constants';
import { generateFishLore } from './services/geminiService';
import Minigame from './components/Minigame';
import Aquarium from './components/Aquarium';
import Shop from './components/Shop';
import Achievements from './components/Achievements';
import LocationBackground from './components/LocationBackground';

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('FISHING');
  
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initial State or Load from LocalStorage (Simulated)
    const initialInventory: CaughtFish[] = [];
    
    // Calculate initial stats based on inventory (if we were loading from save)
    const initialStats: GameStats = {
      totalFishCaught: 0,
      uniqueSpeciesCaught: [],
      legendaryCaught: 0,
      totalGoldEarned: 0
    };

    return {
      gold: 100, // Start with a little gold to try baits
      level: 1,
      xp: 0,
      xpToNextLevel: XP_TABLE[1],
      inventory: initialInventory,
      equippedRodId: 'rod_bamboo',
      unlockedRods: ['rod_bamboo'],
      currentLocationId: 'loc_beach',
      selectedBaitId: 'bait_bread',
      baitInventory: { 'bait_bread': 9999 }, // Infinite bread
      maxInventory: 20,
      stats: initialStats,
      completedAchievementIds: []
    };
  });

  // Fishing Mechanics State
  const [isCasting, setIsCasting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false); // Waiting for bite
  const [biteAlert, setBiteAlert] = useState(false); // Exclamation mark
  const [currentFish, setCurrentFish] = useState<FishSpecies | null>(null);
  const [showMinigame, setShowMinigame] = useState(false);
  const [showResult, setShowResult] = useState<CaughtFish | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const biteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- HELPERS ---

  const getEquippedRod = useCallback(() => {
    return RODS.find(r => r.id === gameState.equippedRodId) || RODS[0];
  }, [gameState.equippedRodId]);

  const getCurrentLocation = useCallback(() => {
    return LOCATIONS.find(l => l.id === gameState.currentLocationId) || LOCATIONS[0];
  }, [gameState.currentLocationId]);

  const getSelectedBait = useCallback(() => {
    return BAITS.find(b => b.id === gameState.selectedBaitId) || BAITS[0];
  }, [gameState.selectedBaitId]);

  const addXP = useCallback((amount: number) => {
    setGameState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpReq = prev.xpToNextLevel;

      if (newXp >= prev.xpToNextLevel) {
        newXp -= prev.xpToNextLevel;
        newLevel += 1;
        newXpReq = Math.floor(prev.xpToNextLevel * LEVEL_SCALING_FACTOR);
        setNotification(`升级了! Lv.${newLevel}`);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpReq
      };
    });
  }, []);

  // --- AUDIO LOGIC ---
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const audio = audioRef.current;
    
    // Map locations to file paths (Assuming files exist in public folder)
    // Since we don't have real files, these will 404, but the logic is correct.
    // Users should add: /sounds/bg_beach.mp3, /sounds/bg_mangrove.mp3, etc.
    const soundMap: Record<string, string> = {
      'loc_beach': 'https://cdn.pixabay.com/audio/2022/03/10/audio_5698b82803.mp3', // Waves
      'loc_mangrove': 'https://cdn.pixabay.com/audio/2022/10/28/audio_0f642c0601.mp3', // Forest/Swamp
      'loc_deep_sea': 'https://cdn.pixabay.com/audio/2023/02/07/audio_321760209e.mp3',  // Deep drone
      'loc_reef': 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3', // Gentle water/bubbles
      'loc_arctic': 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d0.mp3' // Wind/Ice
    };

    const newSrc = soundMap[gameState.currentLocationId] || '';
    
    // Only switch if source changes and valid
    if (audio.src !== newSrc && newSrc) {
      audio.src = newSrc;
      if (!isMuted) {
        audio.play().catch(e => console.log("Audio play failed (user interaction needed):", e));
      }
    }
  }, [gameState.currentLocationId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        // Try to play if we have a source
        if (audioRef.current.src) {
           audioRef.current.play().catch(() => {});
        }
      }
    }
  }, [isMuted]);

  // --- ACHIEVEMENT LOGIC ---
  const checkAchievements = (newState: GameState) => {
    const newlyUnlockedIds: string[] = [];
    let rewardGold = 0;
    let rewardXp = 0;

    ACHIEVEMENTS.forEach(ach => {
      if (newState.completedAchievementIds.includes(ach.id)) return;

      let achieved = false;
      const stats = newState.stats;

      switch (ach.type) {
        case 'TOTAL_CATCH':
          achieved = stats.totalFishCaught >= ach.targetValue;
          break;
        case 'SPECIES_COUNT':
          achieved = stats.uniqueSpeciesCaught.length >= ach.targetValue;
          break;
        case 'GOLD_EARNED':
          achieved = stats.totalGoldEarned >= ach.targetValue;
          break;
        case 'LEGENDARY_COUNT':
          achieved = stats.legendaryCaught >= ach.targetValue;
          break;
      }

      if (achieved) {
        newlyUnlockedIds.push(ach.id);
        rewardGold += ach.rewardGold;
        rewardXp += ach.rewardXp;
        setNotification(`🏆 成就解锁: ${ach.title}`);
      }
    });

    if (newlyUnlockedIds.length > 0) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold + rewardGold,
        xp: prev.xp + rewardXp, 
        completedAchievementIds: [...prev.completedAchievementIds, ...newlyUnlockedIds]
      }));
      if (rewardXp > 0) addXP(rewardXp);
    }
  };

  // --- ACTIONS ---

  const startFishing = () => {
    if (isCasting || isWaiting || showMinigame) return;
    
    // Check Bait
    const baitId = gameState.selectedBaitId;
    const baitCount = gameState.baitInventory[baitId] || 0;
    
    if (baitId !== 'bait_bread' && baitCount <= 0) {
      setNotification("鱼饵不足!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    // Consume Bait (Bread is infinite)
    if (baitId !== 'bait_bread') {
      setGameState(prev => ({
        ...prev,
        baitInventory: {
          ...prev.baitInventory,
          [baitId]: Math.max(0, (prev.baitInventory[baitId] || 0) - 1)
        }
      }));
    }

    setIsCasting(true);
    
    // Animation delay
    setTimeout(() => {
      setIsCasting(false);
      setIsWaiting(true);
      
      // Determine random wait time (Base 2s to 6s)
      // Speed bonus reduces max wait time
      const bait = getSelectedBait();
      const speedFactor = 1 / bait.speedBonus; 
      const waitTime = (Math.random() * 4000 + 2000) * speedFactor;
      
      biteTimerRef.current = setTimeout(() => {
        triggerBite();
      }, waitTime);
    }, 1000);
  };

  const triggerBite = () => {
    setIsWaiting(false);
    setBiteAlert(true);

    // 1. Filter fish by Current Location
    const locationPool = FISH_SPECIES.filter(f => f.locationIds.includes(gameState.currentLocationId));

    // 2. Apply Bait Logic to Rarity Weights
    const bait = getSelectedBait();
    const rand = Math.random(); // 0.0 to 1.0
    
    // Base Probabilities
    let legendaryThreshold = 0.98;
    let epicThreshold = 0.90;
    let rareThreshold = 0.75;

    // Apply Bonus
    const legendaryChance = 0.02 * bait.rarityBonus;
    const epicChance = 0.08 * bait.rarityBonus;
    const rareChance = 0.15 * bait.rarityBonus;

    legendaryThreshold = 1.0 - legendaryChance;
    epicThreshold = legendaryThreshold - epicChance;
    rareThreshold = epicThreshold - rareChance;

    let rarityPool: FishSpecies[] = [];

    if (rand > legendaryThreshold) {
        rarityPool = locationPool.filter(f => f.rarity === Rarity.LEGENDARY);
        if (rarityPool.length === 0) rarityPool = locationPool.filter(f => f.rarity === Rarity.EPIC);
    } 
    else if (rand > epicThreshold) {
        rarityPool = locationPool.filter(f => f.rarity === Rarity.EPIC);
        if (rarityPool.length === 0) rarityPool = locationPool.filter(f => f.rarity === Rarity.RARE);
    } 
    else if (rand > rareThreshold) {
        rarityPool = locationPool.filter(f => f.rarity === Rarity.RARE);
        if (rarityPool.length === 0) rarityPool = locationPool.filter(f => f.rarity === Rarity.COMMON);
    } 
    else {
        rarityPool = locationPool.filter(f => f.rarity === Rarity.COMMON);
    }

    if (rarityPool.length === 0) rarityPool = locationPool; 

    const selectedFish = rarityPool[Math.floor(Math.random() * rarityPool.length)];
    setCurrentFish(selectedFish);

    setTimeout(() => {
      setBiteAlert(false);
      setShowMinigame(true);
    }, 1000);
  };

  const handleCatchSuccess = async () => {
    setShowMinigame(false);
    if (!currentFish) return;

    const weightVariance = Math.random() * (currentFish.maxWeight - currentFish.minWeight);
    const weight = currentFish.minWeight + weightVariance;
    const valueMultiplier = 1 + (weightVariance / (currentFish.maxWeight - currentFish.minWeight)); 
    const finalPrice = Math.floor(currentFish.basePrice * valueMultiplier);

    const newFish: CaughtFish = {
      id: Date.now().toString(),
      speciesId: currentFish.id,
      speciesName: currentFish.name,
      weight: weight,
      price: finalPrice,
      rarity: currentFish.rarity,
      caughtAt: Date.now(),
      inAquarium: true,
      icon: currentFish.icon
    };

    if (currentFish.rarity !== Rarity.COMMON) {
       generateFishLore(newFish).then(lore => {
         setGameState(prev => ({
           ...prev,
           inventory: prev.inventory.map(f => f.id === newFish.id ? { ...f, lore } : f)
         }));
       });
    }

    // UPDATE STATE & STATS
    setGameState(prev => {
      const isUnique = !prev.stats.uniqueSpeciesCaught.includes(newFish.speciesId);
      const isLegendary = newFish.rarity === Rarity.LEGENDARY;

      const newStats = {
        ...prev.stats,
        totalFishCaught: prev.stats.totalFishCaught + 1,
        uniqueSpeciesCaught: isUnique ? [...prev.stats.uniqueSpeciesCaught, newFish.speciesId] : prev.stats.uniqueSpeciesCaught,
        legendaryCaught: isLegendary ? prev.stats.legendaryCaught + 1 : prev.stats.legendaryCaught
      };

      const newState = {
        ...prev,
        inventory: [...prev.inventory, newFish],
        stats: newStats
      };

      // Check achievements immediately
      setTimeout(() => checkAchievements(newState), 0);
      
      return newState;
    });

    addXP(currentFish.basePrice / 2);
    setShowResult(newFish);
  };

  const handleCatchFail = () => {
    setShowMinigame(false);
    setCurrentFish(null);
    setNotification("鱼跑了...");
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSellFish = (fish: CaughtFish) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        gold: prev.gold + fish.price,
        inventory: prev.inventory.filter(f => f.id !== fish.id),
        stats: {
          ...prev.stats,
          totalGoldEarned: prev.stats.totalGoldEarned + fish.price
        }
      };
      
      setTimeout(() => checkAchievements(newState), 0);
      return newState;
    });
  };

  const handleBuyRod = (rod: Rod) => {
    setGameState(prev => ({
      ...prev,
      gold: prev.gold - rod.price,
      unlockedRods: [...prev.unlockedRods, rod.id],
      equippedRodId: rod.id 
    }));
    setNotification(`购买成功: ${rod.name}`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleBuyBait = (bait: Bait, quantity: number) => {
    const cost = bait.price * quantity;
    setGameState(prev => ({
      ...prev,
      gold: prev.gold - cost,
      baitInventory: {
        ...prev.baitInventory,
        [bait.id]: (prev.baitInventory[bait.id] || 0) + quantity
      }
    }));
    setNotification(`获得: ${bait.name} x${quantity}`);
    setTimeout(() => setNotification(null), 2000);
  };

  const switchLocation = (locId: string) => {
     const loc = LOCATIONS.find(l => l.id === locId);
     if (loc && gameState.level >= loc.levelReq) {
        setGameState(prev => ({ ...prev, currentLocationId: locId }));
        setShowLocationMenu(false);
        setNotification(`抵达: ${loc.name}`);
        setTimeout(() => setNotification(null), 2000);
     }
  };

  // --- RENDER HELPERS ---

  if (view === 'AQUARIUM') {
    return <Aquarium inventory={gameState.inventory} onSell={handleSellFish} onBack={() => setView('FISHING')} />;
  }

  if (view === 'SHOP') {
    return (
      <Shop 
        gameState={gameState} 
        onBuyRod={handleBuyRod} 
        onBuyBait={handleBuyBait}
        onEquipRod={(id) => setGameState(p => ({...p, equippedRodId: id}))} 
        onBack={() => setView('FISHING')} 
      />
    );
  }

  if (view === 'ACHIEVEMENTS') {
    return <Achievements gameState={gameState} onBack={() => setView('FISHING')} />;
  }

  const currentLocation = getCurrentLocation();
  const currentBait = getSelectedBait();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
       {/* New Dynamic Background Component */}
       <LocationBackground location={currentLocation} />

      {/* --- HUD --- */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Level Badge */}
          <div className="bg-white/90 backdrop-blur text-slate-800 px-3 py-1 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
            <span className="font-bold text-lg">Lv.{gameState.level}</span>
            <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-400" style={{ width: `${(gameState.xp / gameState.xpToNextLevel) * 100}%` }} />
            </div>
          </div>
          
          {/* Gold Badge */}
          <div className="bg-white/90 backdrop-blur text-slate-800 px-3 py-1 rounded-full shadow-lg border border-white/50 w-fit">
            <span className="font-bold text-yellow-600">💰 {gameState.gold}</span>
          </div>

          {/* Location Selector */}
          <div className="relative mt-2">
            <button 
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="bg-indigo-900/80 text-white px-4 py-2 rounded-lg border border-indigo-500 flex items-center gap-2 hover:bg-indigo-800"
            >
              📍 {currentLocation.name} <span className="text-xs">▼</span>
            </button>
            
            {showLocationMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden flex flex-col gap-1 p-1">
                {LOCATIONS.map(loc => {
                  const locked = gameState.level < loc.levelReq;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => !locked && switchLocation(loc.id)}
                      className={`text-left px-3 py-2 rounded flex justify-between items-center ${
                        locked ? 'opacity-50 cursor-not-allowed bg-slate-900' : 
                        loc.id === gameState.currentLocationId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-gray-200'
                      }`}
                    >
                      <span>{loc.name}</span>
                      {locked && <span className="text-xs text-red-400">Lv.{loc.levelReq}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pointer-events-auto items-end">
           <button onClick={() => setIsMuted(!isMuted)} className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full shadow-lg mb-2 w-10 h-10 flex items-center justify-center" title="静音">
             {isMuted ? '🔇' : '🔊'}
           </button>
           
           <button onClick={() => setView('AQUARIUM')} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110" title="水族箱">
             🐠
           </button>
           <button onClick={() => setView('SHOP')} className="bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110" title="商店">
             🛒
           </button>
           <button onClick={() => setView('ACHIEVEMENTS')} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110" title="成就">
             🏆
           </button>
        </div>
      </div>

      {/* --- NOTIFICATIONS --- */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-2 rounded-full backdrop-blur animate-bounce z-50">
          {notification}
        </div>
      )}

      {/* --- MAIN SCENE --- */}
      <div className="flex-1 relative z-10">
        
        {/* Note: Dynamic clouds/environment moved to LocationBackground component */}
        {/* Clouds are now handled there or can remain if generic, but for immersion better to customize */}

        {/* Sea Surface - Keeping this as the "water line" anchor */}
        <div className="absolute bottom-0 w-full h-[40%] bg-white/5 backdrop-blur-[1px] z-0 border-t border-white/20">
           <div className="absolute -top-4 w-full h-8 bg-white/10 rounded-[50%] scale-x-150 opacity-50"></div>
        </div>

        {/* Character */}
        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          { (isWaiting || biteAlert) && (
             <div className="absolute top-4 right-[-100px] w-[1px] h-[100px] bg-white origin-top -rotate-12 shadow-[0_0_5px_white]">
                <div className={`absolute bottom-0 -left-1 w-3 h-3 bg-red-500 rounded-full shadow-lg border border-white ${biteAlert ? 'animate-ping' : 'animate-bounce'}`}></div>
                {biteAlert && <div className="absolute bottom-4 -left-2 text-4xl animate-bounce drop-shadow-md">❗️</div>}
             </div>
          )}
          <div className="text-6xl relative z-10 drop-shadow-2xl filter contrast-125 transform transition-transform duration-500 hover:scale-105">🚣‍♂️</div>
        </div>
        
        {/* Catch Result Modal */}
        {showResult && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="bg-slate-800 border-2 border-cyan-500 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(34,211,238,0.5)]">
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                  ✨
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">钓到了!</h2>
               <div className="text-6xl my-4 animate-pulse">{showResult.icon}</div>
               <h3 className={`text-2xl font-bold mb-2 ${
                  showResult.rarity === Rarity.LEGENDARY ? 'text-yellow-400' :
                  showResult.rarity === Rarity.EPIC ? 'text-purple-400' :
                  showResult.rarity === Rarity.RARE ? 'text-blue-400' : 'text-white'
               }`}>
                 {showResult.speciesName}
               </h3>
               <div className="flex justify-center gap-4 text-sm text-gray-400 mb-4">
                 <span>⚖️ {showResult.weight.toFixed(2)} kg</span>
                 <span className="text-yellow-400 font-bold">+{showResult.price} G</span>
               </div>
               
               {showResult.lore ? (
                 <div className="bg-black/30 p-3 rounded-lg mb-4 text-sm text-cyan-100 italic border-l-2 border-cyan-500 text-left">
                   "{showResult.lore}"
                 </div>
               ) : (
                  <div className="bg-black/30 p-3 rounded-lg mb-4 text-sm text-gray-500 italic animate-pulse">
                   AI 正在鉴定鱼类信息...
                 </div>
               )}

               <button 
                 onClick={() => { setShowResult(null); setCurrentFish(null); }}
                 className="bg-cyan-600 hover:bg-cyan-500 text-white w-full py-3 rounded-xl font-bold text-lg shadow-lg"
               >
                 放入水族箱
               </button>
             </div>
          </div>
        )}

        {/* Minigame Overlay */}
        {showMinigame && currentFish && (
          <Minigame 
            rod={getEquippedRod()} 
            targetFish={currentFish} 
            onSuccess={handleCatchSuccess} 
            onFail={handleCatchFail} 
          />
        )}
      </div>

      {/* --- FOOTER CONTROLS --- */}
      <div className="h-32 bg-slate-900/95 backdrop-blur border-t border-slate-700 flex items-center justify-between px-6 py-2 z-20 gap-4">
         
         {/* Bait Selector */}
         <div className="flex flex-col gap-1 w-1/3 max-w-[140px]">
           <label className="text-xs text-gray-400 uppercase font-bold">鱼饵</label>
           <div className="relative">
             <select 
               value={gameState.selectedBaitId}
               onChange={(e) => setGameState(p => ({...p, selectedBaitId: e.target.value}))}
               className="w-full bg-slate-800 text-white text-sm rounded p-2 border border-slate-600 appearance-none"
               disabled={isCasting || isWaiting}
             >
               {BAITS.map(b => (
                 <option key={b.id} value={b.id}>
                   {b.icon} {b.name} ({gameState.baitInventory[b.id] || 0})
                 </option>
               ))}
             </select>
             <div className="absolute right-2 top-2 pointer-events-none text-gray-400 text-xs">▼</div>
           </div>
           <div className="text-[10px] text-gray-500 truncate">
             {currentBait.name === '面包屑' ? '基础效果' : `稀有+${Math.round((currentBait.rarityBonus-1)*100)}%`}
           </div>
         </div>

         {/* Cast Button */}
         {!showMinigame && !showResult && (
           <button 
             onClick={startFishing}
             disabled={isCasting || isWaiting || biteAlert}
             className={`flex-1 max-w-md h-16 rounded-2xl font-bold text-2xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
               isWaiting ? 'bg-gray-600 text-gray-300 cursor-wait' :
               biteAlert ? 'bg-red-500 text-white animate-pulse' :
               'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:brightness-110 border-b-4 border-emerald-800'
             }`}
           >
             {isCasting ? <span className="animate-pulse">...</span> : 
              isWaiting ? '...等待...' : 
              biteAlert ? '收杆!!!' : 
              <><span>🎣</span> 抛竿</>}
           </button>
         )}

         {/* Spacer for layout balance or stats */}
         <div className="hidden md:flex flex-col w-1/3 text-right text-xs text-gray-500">
            <div>当前钓力: {getEquippedRod().power}</div>
            <div>幸运加成: x{currentBait.rarityBonus.toFixed(1)}</div>
         </div>
      </div>
    </div>
  );
};

export default App;
