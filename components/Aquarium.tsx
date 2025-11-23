import React, { useMemo } from 'react';
import { CaughtFish, Rarity } from '../types';

interface AquariumProps {
  inventory: CaughtFish[];
  onSell: (fish: CaughtFish) => void;
  onBack: () => void;
}

const Aquarium: React.FC<AquariumProps> = ({ inventory, onSell, onBack }) => {
  // Only show fish marked as "in aquarium" (currently simplify to all caught fish for visual effect, 
  // normally you'd toggle this state)
  const fishInTank = useMemo(() => inventory.filter(f => f.inAquarium), [inventory]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-cyan-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 w-full h-32 bg-[url('https://cdn.pixabay.com/photo/2017/01/10/16/09/underwater-1969562_1280.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Bubbles */}
      {[...Array(10)].map((_, i) => (
         <div 
           key={i}
           className="absolute rounded-full bg-white/10 animate-float"
           style={{
             left: `${Math.random() * 100}%`,
             bottom: '-10%',
             width: `${Math.random() * 20 + 10}px`,
             height: `${Math.random() * 20 + 10}px`,
             animationDuration: `${Math.random() * 5 + 3}s`,
             animationDelay: `${Math.random() * 2}s`
           }}
         />
      ))}

      {/* Fish Render Layer */}
      {fishInTank.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          <p>水族箱空空如也，去钓点鱼吧！</p>
        </div>
      ) : (
        fishInTank.map((fish, index) => {
          // Generate deterministic random positions based on ID
          const top = (parseInt(fish.id.slice(-4), 16) % 80) + 10; 
          const duration = 15 + (fish.weight % 10);
          const isLeft = index % 2 === 0;

          return (
            <div 
              key={fish.id}
              className={`absolute text-4xl drop-shadow-lg cursor-pointer transition-transform hover:scale-125 z-10 ${isLeft ? 'animate-[swim-left_20s_linear_infinite]' : 'animate-[swim-right_25s_linear_infinite]'}`}
              style={{
                top: `${top}%`,
                animationDuration: `${duration}s`
              }}
              title={fish.speciesName}
            >
              <div className="flex flex-col items-center">
                 <span>{fish.speciesName === '大白鲨' || fish.speciesName === '剑鱼' ? '🦈' : '🐠'}</span>
                 <span className="text-xs text-white/70 bg-black/30 px-1 rounded backdrop-blur-xs whitespace-nowrap hidden group-hover:block">
                   {fish.speciesName}
                 </span>
              </div>
            </div>
          );
        })
      )}

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <button 
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20 font-bold"
        >
          ← 返回
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white text-right">
          <h2 className="text-xl font-bold text-cyan-300">深海珍藏馆</h2>
          <p className="text-sm text-gray-300">
            收藏数: {fishInTank.length} / 50
          </p>
        </div>
      </div>
      
      {/* Scrollable List at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-black/60 backdrop-blur-lg border-t border-white/10 p-4 overflow-x-auto">
         <div className="flex space-x-4">
            {fishInTank.map(fish => (
              <div key={fish.id} className="flex-shrink-0 w-40 bg-slate-800 rounded-lg p-3 border border-slate-700 relative group">
                 <div className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded bg-slate-900 text-gray-400">
                    {fish.weight.toFixed(1)}kg
                 </div>
                 <div className="text-4xl text-center mb-2 mt-4">{fish.speciesName === '大白鲨' ? '🦈' : '🐠'}</div>
                 <h3 className="text-white font-bold text-center">{fish.speciesName}</h3>
                 <p className={`text-xs text-center font-bold mb-2 ${
                   fish.rarity === Rarity.LEGENDARY ? 'text-yellow-400' : 
                   fish.rarity === Rarity.EPIC ? 'text-purple-400' : 
                   fish.rarity === Rarity.RARE ? 'text-blue-400' : 'text-gray-400'
                 }`}>{fish.rarity}</p>
                 
                 {fish.lore && (
                   <p className="text-[10px] text-gray-400 italic mb-2 line-clamp-2 h-8">
                     "{fish.lore}"
                   </p>
                 )}

                 <button 
                   onClick={() => onSell(fish)}
                   className="w-full bg-green-600 hover:bg-green-500 text-white text-xs py-1 rounded"
                 >
                   出售 (${fish.price})
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Aquarium;