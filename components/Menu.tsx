
import React from 'react';
import { Difficulty, Biome, Skin } from '../types';

interface MenuProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  biome: Biome;
  setBiome: (b: Biome) => void;
  skin: Skin;
  setSkin: (s: Skin) => void;
  botActive: boolean;
  setBotActive: (active: boolean) => void;
  isMobile: boolean; // New prop for mobile mode
  setIsMobile: (mobile: boolean) => void; // Setter for mobile mode
  keepBiomeInGame: boolean; // New prop for keeping biome
  setKeepBiomeInGame: (keep: boolean) => void; // Setter for keeping biome
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ 
  difficulty, setDifficulty, biome, setBiome, skin, setSkin, botActive, setBotActive, 
  isMobile, setIsMobile, keepBiomeInGame, setKeepBiomeInGame, onStart 
}) => {
  return (
    <div className={`flex flex-col items-center 
                    ${isMobile ? 'gap-4 p-4' : 'gap-6 p-8'} 
                    bg-gray-900 border-4 border-gray-700 rounded-xl shadow-2xl text-white w-full ${isMobile ? '' : 'max-w-md'}`}>
      {!isMobile && ( // Conditionally render the title
        <h1 className={`text-yellow-400 mb-2 text-center text-2xl`}>FLAPPY CRAFT</h1>
      )}
      
      <div className="w-full">
        <label className={`mb-2 block uppercase ${isMobile ? 'text-sm' : 'text-xs text-gray-400'}`}>Difficulty</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(Difficulty).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`border-b-4 transition-all ${isMobile ? 'py-3 text-sm' : 'py-2 text-xs'} ${
                difficulty === d 
                ? 'bg-yellow-500 border-yellow-700 text-black' 
                : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <label className={`mb-2 block uppercase ${isMobile ? 'text-sm' : 'text-xs text-gray-400'}`}>Skin</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(Skin).map(s => (
            <button
              key={s}
              onClick={() => setSkin(s)}
              className={`border-b-4 transition-all ${isMobile ? 'py-3 text-sm' : 'py-2 text-xs'} ${
                skin === s 
                ? 'bg-blue-500 border-blue-700' 
                : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {skin === Skin.CHICKEN && (
        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <label className={`mb-2 block uppercase font-bold ${isMobile ? 'text-sm text-red-400' : 'text-xs text-red-400'}`}>Bot Option (Chicken Only)</label>
          <button
            onClick={() => setBotActive(!botActive)}
            className={`w-full border-b-4 transition-all flex items-center justify-center gap-2 ${isMobile ? 'py-3 text-xs' : 'py-2 text-[10px]'} ${
              botActive 
              ? 'bg-red-600 border-red-800 text-white' 
              : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
            }`}
          >
            <span className={`w-3 h-3 border-2 ${botActive ? 'bg-white border-white' : 'border-gray-500'}`}></span>
            {botActive ? 'AUTOPILOT: ON' : 'AUTOPILOT: OFF'}
          </button>
        </div>
      )}

      <div className="w-full">
        <label className={`mb-2 block uppercase ${isMobile ? 'text-sm' : 'text-xs text-gray-400'}`}>Biome</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(Biome).map(b => (
            <button
              key={b}
              onClick={() => setBiome(b)}
              className={`border-b-4 transition-all ${isMobile ? 'py-3 text-xs' : 'py-2 text-[10px]'} ${
                biome === b 
                ? 'bg-green-600 border-green-800' 
                : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <label className={`mb-2 block uppercase ${isMobile ? 'text-sm' : 'text-xs text-gray-400'}`}>Game Options</label>
        <button
          onClick={() => setKeepBiomeInGame(!keepBiomeInGame)}
          className={`w-full border-b-4 transition-all flex items-center justify-center gap-2 mb-2 ${isMobile ? 'py-3 text-xs' : 'py-2 text-[10px]'} ${
            keepBiomeInGame 
            ? 'bg-purple-600 border-purple-800 text-white' 
            : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
          }`}
        >
          <span className={`w-3 h-3 border-2 ${keepBiomeInGame ? 'bg-white border-white' : 'border-gray-500'}`}></span>
          {keepBiomeInGame ? 'KEEP BIOME IN-GAME: ON' : 'KEEP BIOME IN-GAME: OFF'}
        </button>
        <button
          onClick={() => setIsMobile(!isMobile)}
          className={`w-full border-b-4 transition-all flex items-center justify-center gap-2 ${isMobile ? 'py-3 text-xs' : 'py-2 text-[10px]'} ${
            isMobile 
            ? 'bg-teal-600 border-teal-800 text-white' 
            : 'bg-gray-700 border-gray-800 hover:bg-gray-600'
          }`}
        >
          <span className={`w-3 h-3 border-2 ${isMobile ? 'bg-white border-white' : 'border-gray-500'}`}></span>
          {isMobile ? 'MOBILE MODE: ON' : 'MOBILE MODE: OFF'}
        </button>
      </div>

      <button
        onClick={onStart}
        className={`mt-6 w-full bg-yellow-400 hover:bg-yellow-300 border-b-8 border-yellow-600 text-black transition-all active:translate-y-1 active:border-b-4 ${isMobile ? 'py-5 text-2xl' : 'py-4 text-xl'}`}
      >
        START
      </button>

      <p className={`text-gray-500 mt-2 ${isMobile ? 'text-xs' : 'text-[10px]'}`}>PRESS [SPACE] OR CLICK TO JUMP</p>
    </div>
  );
};

export default Menu;