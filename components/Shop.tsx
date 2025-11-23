import React, { useState } from 'react';
import { Rod, GameState, Bait } from '../types';
import { RODS, BAITS } from '../constants';

interface ShopProps {
  gameState: GameState;
  onBuyRod: (rod: Rod) => void;
  onBuyBait: (bait: Bait, quantity: number) => void;
  onEquipRod: (rodId: string) => void;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ gameState, onBuyRod, onBuyBait, onEquipRod, onBack }) => {
  const [activeTab, setActiveTab] = useState<'RODS' | 'BAIT'>('RODS');

  return (
    <div className="relative w-full h-full bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 pb-0 flex justify-between items-center shrink-0">
        <button onClick={onBack} className="text-white hover:text-cyan-400 text-lg font-bold">← 返回港口</button>
        <div className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/50">
          <span className="text-yellow-400 font-bold text-xl">💰 {gameState.gold}</span>
        </div>
      </div>

      <div className="px-6 py-4 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">渔具商店</h1>
        <p className="text-gray-400 text-sm">大鱼只咬好钩。</p>
      </div>

      {/* Tabs */}
      <div className="flex px-6 space-x-4 border-b border-gray-700 shrink-0">
        <button 
          onClick={() => setActiveTab('RODS')}
          className={`pb-2 px-2 font-bold ${activeTab === 'RODS' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
        >
          🎣 鱼竿
        </button>
        <button 
          onClick={() => setActiveTab('BAIT')}
          className={`pb-2 px-2 font-bold ${activeTab === 'BAIT' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
        >
          🪱 鱼饵
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* RODS TAB */}
        {activeTab === 'RODS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RODS.map((rod) => {
              const isOwned = gameState.unlockedRods.includes(rod.id);
              const isEquipped = gameState.equippedRodId === rod.id;
              const canAfford = gameState.gold >= rod.price;
              const levelMet = gameState.level >= rod.levelReq;

              return (
                <div key={rod.id} className={`p-4 rounded-xl border-2 transition-all ${isEquipped ? 'bg-cyan-900/40 border-cyan-400' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{rod.name}</h3>
                    {isOwned && <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">已拥有</span>}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">钓力 (Minigame难度)</span>
                        <span className="text-cyan-300 font-bold">{rod.power}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">等级需求</span>
                        <span className={levelMet ? 'text-white' : 'text-red-400'}>Lv.{rod.levelReq}</span>
                     </div>
                     {!isOwned && (
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-400">价格</span>
                          <span className="text-yellow-400 font-bold">${rod.price}</span>
                       </div>
                     )}
                  </div>

                  {isOwned ? (
                    <button 
                      onClick={() => onEquipRod(rod.id)}
                      disabled={isEquipped}
                      className={`w-full py-3 rounded-lg font-bold ${
                        isEquipped 
                        ? 'bg-cyan-600/50 text-white/50 cursor-not-allowed' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      }`}
                    >
                      {isEquipped ? '装备中' : '装备'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => onBuyRod(rod)}
                      disabled={!canAfford || !levelMet}
                      className={`w-full py-3 rounded-lg font-bold ${
                        !levelMet 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : !canAfford 
                          ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
                          : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                      }`}
                    >
                      {!levelMet ? '等级不足' : !canAfford ? '金币不足' : '购买'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BAIT TAB */}
        {activeTab === 'BAIT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BAITS.filter(b => b.price > 0).map((bait) => {
              const canAfford = gameState.gold >= bait.price * 5; // Buy packs of 5 for better UX? Or just 1. Let's do 1.
              const ownedCount = gameState.baitInventory[bait.id] || 0;

              return (
                <div key={bait.id} className="p-4 rounded-xl border-2 bg-slate-800 border-slate-700 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none pointer-events-none">{bait.icon}</div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">{bait.icon}</span> {bait.name}
                      </h3>
                      <span className="text-sm bg-slate-900 text-gray-300 px-2 py-1 rounded border border-slate-600">背包: {ownedCount}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 h-10">{bait.description}</p>

                    <div className="space-y-1 text-xs mb-4 text-gray-300">
                      <div className="flex justify-between">
                        <span>稀有度加成:</span>
                        <span className="text-green-400">+{Math.round((bait.rarityBonus - 1) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>咬钩速度:</span>
                        <span className="text-green-400">+{Math.round((bait.speedBonus - 1) * 100)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="text-yellow-400 font-bold text-lg flex-1">${bait.price}</div>
                       <button 
                        onClick={() => onBuyBait(bait, 1)}
                        disabled={gameState.gold < bait.price}
                        className={`px-4 py-2 rounded-lg font-bold ${
                          gameState.gold < bait.price
                          ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                       >
                         购买 1个
                       </button>
                       <button 
                        onClick={() => onBuyBait(bait, 10)}
                        disabled={gameState.gold < bait.price * 10}
                        className={`px-4 py-2 rounded-lg font-bold ${
                          gameState.gold < bait.price * 10
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-700 hover:bg-green-600 text-white'
                        }`}
                       >
                         买10个
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Free Bread Card */}
             <div className="p-4 rounded-xl border-2 bg-slate-800 border-slate-600 relative overflow-hidden opacity-70">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none">🍞</div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                   <span className="text-2xl">🍞</span> 面包屑
                </h3>
                <p className="text-gray-400 text-sm mb-4">基础鱼饵。虽然不好用，但是它免费无限供应。</p>
                <div className="text-xs text-gray-500">无法购买 (默认无限)</div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;