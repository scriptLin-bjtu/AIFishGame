
import React from 'react';
import { Location } from '../types';

interface LocationBackgroundProps {
  location: Location;
}

const LocationBackground: React.FC<LocationBackgroundProps> = ({ location }) => {
  // Render specific elements based on location ID
  const renderEnvironment = () => {
    switch (location.id) {
      case 'loc_beach':
        return (
          <>
            {/* Sun */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-200 blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute top-6 left-6 w-40 h-40 rounded-full border-4 border-yellow-100/20 animate-spin-slow opacity-40 dashed"></div>
            
            {/* Birds */}
            <div className="absolute top-20 right-[20%] text-white/40 text-xl animate-[swim-left_30s_linear_infinite]">🦅</div>
            <div className="absolute top-24 right-[15%] text-white/30 text-sm animate-[swim-left_35s_linear_infinite]">🦅</div>

            {/* Distant Island/Palms */}
            <div className="absolute bottom-[35%] left-[10%] opacity-20 text-8xl transform -scale-x-100 origin-bottom animate-sway-slow select-none pointer-events-none">
              🌴
            </div>
            <div className="absolute bottom-[38%] right-[5%] opacity-30 text-9xl origin-bottom animate-sway select-none pointer-events-none">
              🌴
            </div>

            {/* Surface Sparkles */}
            <div className="absolute bottom-[40%] w-full h-1 bg-white/30 blur-sm"></div>
          </>
        );

      case 'loc_mangrove':
        return (
          <>
            {/* Hanging Roots (SVG) */}
            <svg className="absolute top-0 left-0 w-full h-64 opacity-40 pointer-events-none" preserveAspectRatio="none">
              <path d="M0,0 C50,100 20,200 50,250" stroke="#2f4f4f" strokeWidth="10" fill="none" />
              <path d="M100,0 C150,120 80,180 120,200" stroke="#2f4f4f" strokeWidth="15" fill="none" />
              <path d="M300,0 C280,150 350,200 320,300" stroke="#2f4f4f" strokeWidth="8" fill="none" />
              <path d="M800,0 C750,100 850,200 800,250" stroke="#2f4f4f" strokeWidth="20" fill="none" />
              <path d="M900,0 C950,120 880,180 920,200" stroke="#2f4f4f" strokeWidth="12" fill="none" />
            </svg>

            {/* Fireflies / Spores */}
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-glow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}

            {/* Murky overlay */}
            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay pointer-events-none"></div>
            
            {/* Lily pads or floating debris */}
            <div className="absolute bottom-[35%] left-[20%] text-4xl opacity-40 animate-[float_5s_ease-in-out_infinite] select-none">🍃</div>
            <div className="absolute bottom-[42%] right-[30%] text-3xl opacity-30 animate-[float_7s_ease-in-out_infinite] select-none">🌿</div>
          </>
        );

      case 'loc_reef':
        return (
          <>
             {/* Light Rays */}
             <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 to-transparent pointer-events-none"></div>
             
             {/* Corals (using text emojis for simplicity, but styled) */}
             <div className="absolute bottom-[-20px] left-[10%] text-8xl opacity-40 animate-sway-slow select-none pointer-events-none text-pink-400 filter blur-[1px]">🪸</div>
             <div className="absolute bottom-[-40px] left-[25%] text-9xl opacity-50 animate-sway select-none pointer-events-none text-orange-400 filter blur-[1px]">🪸</div>
             <div className="absolute bottom-[-30px] right-[15%] text-8xl opacity-40 animate-sway-slow select-none pointer-events-none text-purple-400 filter blur-[1px]">🪸</div>

             {/* Tiny background fish school */}
             {[...Array(8)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute text-xs opacity-30 animate-[swim-right_15s_linear_infinite]"
                 style={{
                   top: `${40 + Math.random() * 20}%`,
                   left: `${Math.random() * 20}%`,
                   animationDuration: `${15 + Math.random() * 10}s`,
                   animationDelay: `${Math.random() * 5}s`
                 }}
               >🐟</div>
             ))}
             
             {/* Bubbles */}
             {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `bubble-rise ${Math.random() * 8 + 3}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </>
        );

      case 'loc_deep_sea':
        return (
          <>
            {/* Darkness Overlay (Vignette) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-60 pointer-events-none"></div>

            {/* Shipwreck Silhouette */}
            <div className="absolute bottom-[-5%] right-[-10%] text-[15rem] opacity-20 rotate-12 select-none pointer-events-none grayscale blur-sm text-indigo-950">
              🚢
            </div>

            {/* Rising Bubbles */}
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full border border-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `bubble-rise ${Math.random() * 10 + 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}

            {/* Jellyfish */}
            <div className="absolute top-[20%] left-[10%] opacity-30 animate-jelly select-none pointer-events-none">
              <div className="text-6xl text-pink-400 blur-[1px]">🎐</div>
            </div>
            <div className="absolute top-[40%] right-[20%] opacity-20 animate-jelly select-none pointer-events-none" style={{ animationDelay: '2s' }}>
               <div className="text-4xl text-purple-400 blur-[1px]">🎐</div>
            </div>
          </>
        );
      
      case 'loc_arctic':
        return (
          <>
             {/* Snow */}
             {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-snow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `-${Math.random() * 5}s`,
                    opacity: Math.random()
                  }}
                />
             ))}

             {/* Icebergs */}
             <div className="absolute bottom-[35%] left-[-10%] w-0 h-0 border-l-[100px] border-l-transparent border-r-[50px] border-r-transparent border-b-[150px] border-b-white/10 rotate-12 opacity-50 blur-sm"></div>
             <div className="absolute bottom-[30%] right-[-5%] w-0 h-0 border-l-[80px] border-l-transparent border-r-[120px] border-r-transparent border-b-[120px] border-b-white/20 -rotate-6 opacity-40 blur-sm"></div>
             
             {/* Aurora Hint (Gradient overlay handled in parent, but extra glow here) */}
             <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-green-400/10 to-transparent blur-3xl"></div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-b ${location.bgGradient} transition-colors duration-1000`}></div>
      
      {/* Environmental Elements Layer */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        {renderEnvironment()}
      </div>
    </div>
  );
};

export default LocationBackground;
