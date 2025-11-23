
import React from 'react';
import { GameState, GameStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsProps {
  gameState: GameState;
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ gameState, onBack }) => {
  const getProgress = (ach: typeof ACHIEVEMENTS[0], stats: GameStats) => {
    switch (ach.type) {
      case 'TOTAL_CATCH': return stats.totalFishCaught;
      case 'SPECIES_COUNT': return stats.uniqueSpeciesCaught.length;
      case 'GOLD_EARNED': return stats.totalGoldEarned;
      case 'LEGENDARY_COUNT': return stats.legendaryCaught;
      case 'LOCATION_UNLOCK': return 1; // Simplify for now
      default: return 0;
    }
  };

  const completedCount = gameState.completedAchievementIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="relative w-full h-full bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 pb-0 flex justify-between items-center shrink-0">
        <button onClick={onBack} className="text-white hover:text-cyan-400 text-lg font-bold">← 返回</button>
        <div className="bg-purple-900/50 px-4 py-2 rounded-full border border-purple-500/50">
          <span className="text-purple-300 font-bold text-sm">成就进度: {percentage}%</span>
        </div>
      </div>

      <div className="px-6 py-4 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">荣誉殿堂</h1>
        <p className="text-gray-400 text-sm">记录你的辉煌时刻。</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {ACHIEVEMENTS.map((ach) => {
          const isCompleted = gameState.completedAchievementIds.includes(ach.id);
          const currentProgress = getProgress(ach, gameState.stats);
          const progressPercent = Math.min(100, (currentProgress / ach.targetValue) * 100);

          return (
            <div 
              key={ach.id} 
              className={`relative rounded-xl border-2 p-4 transition-all ${
                isCompleted 
                ? 'bg-gradient-to-r from-purple-900/40 to-slate-800 border-purple-500' 
                : 'bg-slate-800 border-slate-700 opacity-90'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl p-2 rounded-full ${isCompleted ? 'bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-700 grayscale'}`}>
                  {ach.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-lg font-bold ${isCompleted ? 'text-purple-300' : 'text-gray-300'}`}>
                      {ach.title}
                    </h3>
                    {isCompleted && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-bold">已达成</span>}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{ach.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-purple-500' : 'bg-cyan-600'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>进度: {Math.floor(currentProgress)} / {ach.targetValue}</span>
                    <span>奖励: 💰{ach.rewardGold} XP{ach.rewardXp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
