
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, Difficulty, Biome, Skin } from './types';
import GameCanvas from './components/GameCanvas';
import Menu from './components/Menu';
import { getMinecraftDeathMessage, getBiomeLore } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [biome, setBiome] = useState<Biome>(Biome.PLAINS);
  const [skin, setSkin] = useState<Skin>(Skin.CREEPER);
  const [botActive, setBotActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [deathMessage, setDeathMessage] = useState<string>('');
  const [biomeLore, setBiomeLore] = useState<string>('');
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [keepBiomeInGame, setKeepBiomeInGame] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappy-craft-highscore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const handleStart = useCallback(() => {
    setStatus(GameStatus.PLAYING);
    setScore(0);
    setBiomeLore('');
    setDeathMessage('');
    setCopied(false);

    getBiomeLore(biome).then(lore => {
      setBiomeLore(lore);
    });
  }, [biome]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    if (newScore === 15) {
      setBiomeLore("HEROBRINE HAS JOINED THE GAME. YOU ARE UNSTOPPABLE.");
    } else if (newScore === 30) {
      setBiomeLore("HEROBRINE HAS LEFT THE GAME. GOOD LUCK.");
    }
  }, []);

  const handleBiomeChange = useCallback((newBiome: Biome) => {
    setBiome(newBiome);
    setScore(prev => {
      if (!(prev >= 15 && prev < 30)) {
        getBiomeLore(newBiome).then(lore => {
          setBiomeLore(lore);
        });
      }
      return prev;
    });
  }, []);

  const handleGameOver = useCallback(async (finalScore: number) => {
    setScore(finalScore);
    setScoreHistory(prev => [finalScore, ...prev].slice(0, 5));
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappy-craft-highscore', finalScore.toString());
    }
    setStatus(GameStatus.GAMEOVER);
    const msg = await getMinecraftDeathMessage(finalScore);
    setDeathMessage(msg);
  }, [highScore]);

  const handleShare = () => {
    const shareText = `⛏️ I just scored ${score} in Flappy Craft! 🐦\nMy personal best is ${highScore}. Can you beat me?\n#FlappyCraft #Minecraft`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (skin !== Skin.CHICKEN) {
      setBotActive(false);
    }
  }, [skin]);

  return (
    <div className="min-h-dvh bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: 'radial-gradient(circle, rgba(112,197,206,1) 0%, rgba(0,0,0,1) 70%)' }} />

      <div className={`z-10 flex flex-col gap-6 items-center ${isMobile ? 'w-full max-w-sm' : 'lg:flex-row lg:gap-8 lg:max-w-[1600px] w-full'}`}>
        <div className={`flex flex-col gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 min-w-0'}`}>
          {!(isMobile && status === GameStatus.START) && (
            <div className={`w-full ${isMobile ? 'aspect-[2/3] max-w-sm mx-auto' : 'aspect-[8/5]'}`}>
              <GameCanvas 
                status={status}
                difficulty={difficulty}
                biome={biome}
                skin={skin}
                botActive={botActive}
                isMobile={isMobile}
                keepBiomeInGame={keepBiomeInGame}
                onGameOver={handleGameOver}
                onScoreUpdate={handleScoreUpdate}
                onBiomeChange={handleBiomeChange}
              />
            </div>
          )}
          
          {status === GameStatus.PLAYING && (
            <div className={`flex flex-col gap-2 ${isMobile ? 'w-full max-w-sm' : 'w-full'}`}>
              {biomeLore && (
                <div className={`bg-black/60 p-4 rounded border text-[10px] text-white animate-in slide-in-from-bottom duration-500 
                                ${score >= 15 && score < 30 ? 'border-red-600' : 'border-white/20'} 
                                ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  <span className={`${score >= 15 && score < 30 ? 'text-red-500' : 'text-yellow-400'} font-bold uppercase`}>
                    {score >= 15 && score < 30 ? 'Entity 303:' : 'Biome Lore:'}
                  </span> {biomeLore}
                </div>
              )}
              <div className="bg-black/40 p-2 rounded text-[10px] text-gray-400 flex justify-between">
                <span>MODE: {difficulty} {botActive ? '(BOT)' : ''}</span>
                <span>BIOME: {biome}</span>
              </div>
            </div>
          )}
        </div>

        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md shrink-0'}`}>
          {status === GameStatus.START && (
            <Menu 
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              biome={biome}
              setBiome={setBiome}
              skin={skin}
              setSkin={setSkin}
              botActive={botActive}
              setBotActive={setBotActive}
              isMobile={isMobile}
              setIsMobile={setIsMobile}
              keepBiomeInGame={keepBiomeInGame}
              setKeepBiomeInGame={setKeepBiomeInGame}
              onStart={handleStart}
            />
          )}

          {status === GameStatus.GAMEOVER && (
            <div className={`${isMobile ? 'absolute inset-0 flex items-center justify-center z-20 p-4' : ''}`}>
              <div className={`bg-gray-900 border-4 border-red-600 p-8 rounded-xl shadow-2xl text-white text-center animate-in fade-in zoom-in duration-300 ${isMobile ? 'w-full max-w-sm' : 'w-full'}`}>
                <h2 className="text-3xl text-red-500 mb-6 font-bold">YOU DIED!</h2>
                <div className="mb-6 space-y-2 bg-black/40 p-6 rounded border border-gray-700">
                  <p className="text-2xl">SCORE: <span className="text-yellow-400 font-bold">{score}</span></p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Personal Best: {highScore}</p>
                </div>
                {deathMessage && (
                  <div className="bg-gray-800 p-4 rounded mb-6 italic text-sm text-gray-300 border-l-4 border-red-500 text-left">
                    {deathMessage}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => setStatus(GameStatus.START)} className="py-4 bg-gray-700 hover:bg-gray-600 border-b-4 border-gray-900 text-white text-xs transition-all active:translate-y-1 active:border-b-2 uppercase">Menu</button>
                  <button onClick={handleShare} className={`py-4 border-b-4 text-xs transition-all active:translate-y-1 active:border-b-2 uppercase ${copied ? 'bg-green-600 border-green-800' : 'bg-blue-600 border-blue-800 hover:bg-blue-500'}`}>{copied ? 'Copied!' : 'Share'}</button>
                </div>
                <button onClick={handleStart} className="w-full py-6 text-2xl bg-yellow-500 hover:bg-yellow-400 border-b-10 border-yellow-700 text-black transition-all active:translate-y-1 active:border-b-4 uppercase font-bold">Respawn</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(!isMobile || status !== GameStatus.START) && (
        <div className="absolute top-6 right-6 bg-gray-800/80 px-4 py-2 border-2 border-gray-600 rounded text-sm text-yellow-400 font-bold shadow-lg">
          BEST: {highScore}
        </div>
      )}
    </div>
  );
};

export default App;
