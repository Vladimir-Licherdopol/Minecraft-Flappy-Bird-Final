
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GameStatus, Difficulty, Biome, Skin, Pipe, 
  BirdState, Particle, JumpParticle 
} from '../types';
import { 
  LANDSCAPE_WIDTH, LANDSCAPE_HEIGHT, PORTRAIT_WIDTH, PORTRAIT_HEIGHT,
  BIRD_SIZE, PIPE_WIDTH, GROUND_HEIGHT, DIFFICULTY_SETTINGS, 
  BIOME_THEMES, SKIN_COLORS, STEAK_COLORS, PARTICLE_GRAVITY,
  JUMP_PARTICLE_COUNT, JUMP_PARTICLE_LIFETIME,
  JUMP_PARTICLE_VELOCITY_Y_MIN, JUMP_PARTICLE_VELOCITY_Y_MAX
} from '../constants';

interface GameCanvasProps {
  status: GameStatus;
  difficulty: Difficulty;
  biome: Biome;
  skin: Skin;
  botActive: boolean;
  isMobile: boolean;
  keepBiomeInGame: boolean;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onBiomeChange: (biome: Biome) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  status, difficulty, biome, skin, botActive, isMobile, keepBiomeInGame, onGameOver, onScoreUpdate, onBiomeChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  
  // Calculate dynamic dimensions
  const width = isMobile ? PORTRAIT_WIDTH : LANDSCAPE_WIDTH;
  const height = isMobile ? PORTRAIT_HEIGHT : LANDSCAPE_HEIGHT;

  const birdRef = useRef<BirdState>({ y: height / 2, velocity: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const explodedParticlesRef = useRef<Particle[]>([]);
  const jumpParticlesRef = useRef<JumpParticle[]>([]);
  const frameCountRef = useRef(0);
  const scoreRef = useRef(0);
  const frameIdRef = useRef<number>(0);

  const currentBiomeRef = useRef<Biome>(biome);
  const currentThemeRef = useRef(BIOME_THEMES[biome]);

  const config = DIFFICULTY_SETTINGS[difficulty];

  useEffect(() => {
    if (status !== GameStatus.PLAYING) {
      currentBiomeRef.current = biome;
      currentThemeRef.current = BIOME_THEMES[biome];
    }
  }, [biome, status]);

  const handleJump = useCallback(() => {
    if (status === GameStatus.PLAYING) {
      birdRef.current.velocity = config.jumpStrength;

      const birdX = 50;
      const birdY = birdRef.current.y;
      const birdColor = SKIN_COLORS[skin].body;

      for (let i = 0; i < JUMP_PARTICLE_COUNT; i++) {
        // Fix: Corrected typo JUMP_PARTETIME_LIFETIME to JUMP_PARTICLE_LIFETIME
        jumpParticlesRef.current.push({
          x: birdX + BIRD_SIZE / 2 + (Math.random() * 10 - 5),
          y: birdY + BIRD_SIZE - (Math.random() * 5),
          size: Math.random() * 3 + 2,
          color: birdColor, 
          velocityX: (Math.random() - 0.5) * 1.5,
          velocityY: Math.random() * (JUMP_PARTICLE_VELOCITY_Y_MAX - JUMP_PARTICLE_VELOCITY_Y_MIN) + JUMP_PARTICLE_VELOCITY_Y_MIN,
          lifetime: JUMP_PARTICLE_LIFETIME,
        });
      }
    }
  }, [status, config.jumpStrength, skin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') handleJump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  const drawSun = (ctx: CanvasRenderingContext2D) => {
    if (currentBiomeRef.current === Biome.NETHER) return;

    ctx.save();
    const isHerobrineActive = scoreRef.current >= 15 && scoreRef.current < 30;
    const sunSize = 50;
    const sunX = width - 100; 
    const sunY = 50;

    if (isHerobrineActive) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(sunX - 10, sunY - 10, sunSize + 20, sunSize + 20);
      ctx.fillStyle = '#FF0000';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(sunX - 5, sunY - 5, sunSize + 10, sunSize + 10);
      ctx.fillStyle = '#FFFFFF';
    }

    ctx.fillRect(sunX, sunY, sunSize, sunSize);
    ctx.restore();
  };

  const drawBird = (ctx: CanvasRenderingContext2D, y: number) => {
    const x = 50;
    const isHerobrineActive = scoreRef.current >= 15 && scoreRef.current < 30;
    const isDuckClipping = skin === Skin.DUCK && currentBiomeRef.current === Biome.OCEAN;
    const isChickenSteak = skin === Skin.CHICKEN && currentBiomeRef.current === Biome.NETHER;

    ctx.save();
    if (isDuckClipping || isChickenSteak) {
      ctx.globalAlpha = isChickenSteak ? 0.9 : 0.8;
    }
    
    let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdRef.current.velocity * 0.1));
    if (isChickenSteak) {
      rotation = Math.min(Math.PI / 8, Math.max(-Math.PI / 8, birdRef.current.velocity * 0.05));
    }

    ctx.translate(x + BIRD_SIZE / 2, y + BIRD_SIZE / 2);
    ctx.rotate(rotation);
    ctx.translate(-(x + BIRD_SIZE / 2), -(y + BIRD_SIZE / 2));

    if (isChickenSteak) {
      const colors = STEAK_COLORS;
      ctx.fillStyle = colors.body;
      ctx.fillRect(x, y + BIRD_SIZE / 4, BIRD_SIZE, BIRD_SIZE * 0.75);
      ctx.fillRect(x + BIRD_SIZE / 4, y, BIRD_SIZE / 2, BIRD_SIZE / 2);
      ctx.fillStyle = colors.detail;
      ctx.fillRect(x + BIRD_SIZE / 8, y + BIRD_SIZE / 2, BIRD_SIZE * 0.75, BIRD_SIZE / 4);
      ctx.fillRect(x + BIRD_SIZE / 2, y + BIRD_SIZE / 8, BIRD_SIZE / 4, BIRD_SIZE / 2);
    } else {
      const colors = SKIN_COLORS[skin];
      ctx.fillStyle = colors.body;
      ctx.fillRect(x, y, BIRD_SIZE, BIRD_SIZE);
      if (skin === Skin.CREEPER) {
        ctx.fillStyle = colors.head;
        ctx.fillRect(x + 12, y + 14, 10, 8);
        ctx.fillRect(x + 8, y + 18, 4, 10);
        ctx.fillRect(x + 22, y + 18, 4, 10);
      } else {
        ctx.fillStyle = colors.detail;
        ctx.fillRect(x + BIRD_SIZE - 4, y + 15, 6, 8); 
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x + 4, y + 15, 12, 10);
      }
      if (isHerobrineActive) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        if (skin === Skin.CREEPER) {
          ctx.fillRect(x + 6, y + 6, 8, 8);
          ctx.fillRect(x + 20, y + 6, 8, 8);
        } else {
          ctx.fillRect(x + BIRD_SIZE - 12, y + 6, 6, 6); 
        }
      } else {
        ctx.fillStyle = '#000';
        if (skin === Skin.CREEPER) {
          ctx.fillRect(x + 6, y + 6, 8, 8);
          ctx.fillRect(x + 20, y + 6, 8, 8);
        } else {
          ctx.fillRect(x + BIRD_SIZE - 10, y + 8, 4, 4); 
        }
      }
    }
    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    if (pipe.exploded) return; 
    const theme = currentThemeRef.current;
    const isHerobrineActive = scoreRef.current >= 15 && scoreRef.current < 30;
    const isDuckClipping = skin === Skin.DUCK && currentBiomeRef.current === Biome.OCEAN;
    const isChickenSteak = skin === Skin.CHICKEN && currentBiomeRef.current === Biome.NETHER;
    
    ctx.save();
    if (isHerobrineActive || isDuckClipping || isChickenSteak) {
      ctx.globalAlpha = isHerobrineActive ? 0.5 : (isChickenSteak ? 0.8 : 0.7); 
    }
    const pipeColor = theme.pipeColor; 
    const pipeBorder = theme.pipeBorder;
    ctx.lineWidth = 4;
    ctx.strokeStyle = pipeBorder;
    ctx.fillStyle = pipeColor;
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
    ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
    const bottomY = pipe.topHeight + config.pipeGap;
    const bottomHeight = height - GROUND_HEIGHT - bottomY;
    ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);
    ctx.strokeRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);
    ctx.restore();
  };

  const drawGround = (ctx: CanvasRenderingContext2D) => {
    const theme = currentThemeRef.current;
    const groundY = height - GROUND_HEIGHT;
    const blockSize = 40;
    const pixelSize = 5; 
    for (let x = -blockSize; x < width + blockSize; x += blockSize) {
      ctx.fillStyle = theme.ground;
      ctx.fillRect(x, groundY, blockSize, GROUND_HEIGHT);
      for (let px = 0; px < blockSize; px += pixelSize) {
        for (let py = 0; py < GROUND_HEIGHT; py += pixelSize) {
          const noise = Math.sin((x + px) * 0.7) * Math.cos((groundY + py) * 0.7);
          if (currentBiomeRef.current === Biome.PLAINS) {
            if (py < 15) ctx.fillStyle = (noise > 0.2) ? '#2ECC71' : (noise < -0.2) ? '#27AE60' : '#229954';
            else if (py < 25) ctx.fillStyle = (noise > 0) ? '#5D4037' : '#229954';
            else ctx.fillStyle = (noise > 0.3) ? '#8D6E63' : (noise < -0.3) ? '#4E342E' : '#6D4C41';
          } else if (currentBiomeRef.current === Biome.DESERT) {
            ctx.fillStyle = (noise > 0.5) ? '#F7DC6F' : (noise < -0.5) ? '#D4AC0D' : '#F1C40F';
          } else if (currentBiomeRef.current === Biome.NETHER) {
            ctx.fillStyle = (noise > 0.4) ? '#922B21' : (noise < -0.4) ? '#641E16' : '#7B241C';
          } else if (currentBiomeRef.current === Biome.OCEAN) {
            const waveAnim = Math.sin((x + px + frameCountRef.current * 2) * 0.1) * 2;
            if (py + waveAnim < 15) ctx.fillStyle = '#A9CCE3'; 
            else ctx.fillStyle = (noise > 0.3) ? '#2980B9' : (noise < -0.3) ? '#1A5276' : '#2471A3';
          }
          ctx.fillRect(x + px, groundY + py, pixelSize, pixelSize);
        }
      }
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, groundY, blockSize, pixelSize);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, groundY, blockSize, GROUND_HEIGHT);
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    explodedParticlesRef.current.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
  };

  const drawJumpParticles = (ctx: CanvasRenderingContext2D) => {
    jumpParticlesRef.current.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
  };

  const drawHUD = (ctx: CanvasRenderingContext2D) => {
    if (status === GameStatus.PLAYING) {
      const scoreText = scoreRef.current.toString();
      const isHerobrineActive = scoreRef.current >= 15 && scoreRef.current < 30;
      const isChickenSteak = skin === Skin.CHICKEN && currentBiomeRef.current === Biome.NETHER;

      ctx.font = '40px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(scoreText, width / 2 + 4, 104);
      ctx.fillStyle = isHerobrineActive ? '#ff0000' : '#fff';
      ctx.fillText(scoreText, width / 2, 100);

      const barY = height - GROUND_HEIGHT - 15;
      const barWidth = width - 40;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(20, barY, barWidth, 8);

      if (isHerobrineActive) {
        const hProgress = (scoreRef.current - 15) / 15;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(20, barY, barWidth * (1 - hProgress), 8); 
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#FF0000';
        ctx.fillText("HEROBRINE INVINCIBILITY ACTIVE", width / 2, barY - 10);
      } else {
        const progress = (scoreRef.current % 5) / 5; 
        ctx.fillStyle = (scoreRef.current + 1) % 5 === 0 ? '#ffcc00' : '#7cfc00'; 
        ctx.fillRect(20, barY, barWidth * progress, 8);
        ctx.font = '8px "Press Start 2P"';
        if (isChickenSteak) {
          ctx.fillStyle = '#FF0000';
          ctx.fillText("STEAK: GROUND/CEILING INVINCIBLE!", width / 2, barY - 10);
        } else if (skin === Skin.DUCK && currentBiomeRef.current === Biome.OCEAN) {
          ctx.fillStyle = '#00d2ff';
          ctx.fillText("CLIPPING & FLOATING ACTIVE", width / 2, barY - 10);
        } else if (skin === Skin.CHICKEN && botActive) {
          ctx.fillStyle = '#ff6b6b';
          ctx.fillText("CHICKEN AUTOPILOT ENGAGED", width / 2, barY - 10);
        } else if (keepBiomeInGame) {
          ctx.fillStyle = '#C8A2C8';
          ctx.fillText("BIOME LOCKED", width / 2, barY - 10);
        } else if (skin === Skin.CREEPER && currentBiomeRef.current === Biome.PLAINS) {
          ctx.fillStyle = '#45a049';
          ctx.fillText("CREEPER EXPLOSION ACTIVE", width / 2, barY - 10);
        }
      }
    }
  };

  const loop = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const theme = currentThemeRef.current;
    const isHerobrineActive = scoreRef.current >= 15 && scoreRef.current < 30;
    const isDuckInOcean = skin === Skin.DUCK && currentBiomeRef.current === Biome.OCEAN;
    const isChickenSteak = skin === Skin.CHICKEN && currentBiomeRef.current === Biome.NETHER;

    if (botActive && skin === Skin.CHICKEN) {
      const birdX = 50;
      const nextPipe = pipesRef.current.find(p => p.x + PIPE_WIDTH > birdX);
      if (nextPipe) {
        const gapCenter = nextPipe.topHeight + config.pipeGap / 2;
        if (birdRef.current.y > gapCenter - 10) birdRef.current.velocity = config.jumpStrength;
      } else {
        if (birdRef.current.y > height / 2) birdRef.current.velocity = config.jumpStrength;
      }
    }

    birdRef.current.velocity += config.gravity;
    birdRef.current.y += birdRef.current.velocity;
    const groundLimit = height - GROUND_HEIGHT;

    if (birdRef.current.y + BIRD_SIZE > groundLimit) {
      if (isDuckInOcean || isHerobrineActive || isChickenSteak) {
        birdRef.current.y = groundLimit - BIRD_SIZE;
        birdRef.current.velocity = 0;
      } else {
        onGameOver(scoreRef.current);
        return;
      }
    }
    if (birdRef.current.y < 0) {
      if (isHerobrineActive || isChickenSteak) {
        birdRef.current.y = 0;
        birdRef.current.velocity = 0.5; 
      } else {
        onGameOver(scoreRef.current);
        return;
      }
    }

    explodedParticlesRef.current.forEach(particle => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += PARTICLE_GRAVITY;
      particle.lifetime--;
    });
    explodedParticlesRef.current = explodedParticlesRef.current.filter(p => p.lifetime > 0);
    jumpParticlesRef.current.forEach(particle => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += PARTICLE_GRAVITY;
      particle.lifetime--;
    });
    jumpParticlesRef.current = jumpParticlesRef.current.filter(p => p.lifetime > 0);

    frameCountRef.current++;
    if (frameCountRef.current % config.pipeFrequency === 0) {
      const minH = 50;
      const maxH = height - GROUND_HEIGHT - config.pipeGap - 50;
      pipesRef.current.push({
        x: width,
        topHeight: Math.random() * (maxH - minH) + minH,
        passed: false
      });
    }

    pipesRef.current.forEach(pipe => {
      pipe.x -= config.pipeSpeed;
      const birdX = 50;
      const birdY = birdRef.current.y;
      const isCreeperExplodingPipes = skin === Skin.CREEPER && currentBiomeRef.current === Biome.PLAINS;
      if (!pipe.exploded && birdX + BIRD_SIZE > pipe.x && birdX < pipe.x + PIPE_WIDTH) {
        if (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.topHeight + config.pipeGap) {
          if (isHerobrineActive || isDuckInOcean || isCreeperExplodingPipes) { 
            if (isCreeperExplodingPipes) {
              pipe.exploded = true;
              const pipeCenterX = pipe.x + PIPE_WIDTH / 2;
              const pipeCenterY = pipe.topHeight + config.pipeGap / 2;
              for (let i = 0; i < 8; i++) {
                explodedParticlesRef.current.push({
                  x: pipeCenterX + (Math.random() * 20 - 10),
                  y: pipeCenterY + (Math.random() * 20 - 10),
                  size: Math.random() * 5 + 3,
                  color: Math.random() > 0.5 ? '#FFFFFF' : '#CCCCCC',
                  velocityX: (Math.random() - 0.5) * 4,
                  velocityY: (Math.random() - 1) * 3,
                  lifetime: Math.floor(Math.random() * 30) + 30,
                });
              }
            }
          } else {
            onGameOver(scoreRef.current);
            return;
          }
        }
      }
      if (!pipe.passed && !pipe.exploded && pipe.x + PIPE_WIDTH < birdX) {
        pipe.passed = true;
        scoreRef.current += 1;
        setScoreDisplay(scoreRef.current);
        onScoreUpdate(scoreRef.current);
        if (!keepBiomeInGame && scoreRef.current > 0 && scoreRef.current % 5 === 0) {
          const biomes = [Biome.PLAINS, Biome.DESERT, Biome.NETHER, Biome.OCEAN];
          const currentIndex = biomes.indexOf(currentBiomeRef.current);
          const nextIndex = (currentIndex + 1) % biomes.length;
          const nextBiome = biomes[nextIndex];
          currentBiomeRef.current = nextBiome;
          currentThemeRef.current = BIOME_THEMES[nextBiome];
          onBiomeChange(nextBiome);
        }
      }
    });
    pipesRef.current = pipesRef.current.filter(p => p.x + PIPE_WIDTH > -20 && !p.exploded);

    if (isHerobrineActive && frameCountRef.current % 60 < 5) ctx.fillStyle = '#111';
    else ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);
    
    drawSun(ctx);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    const cloud1X = (50 + (frameCountRef.current * 0.2)) % (width + 100) - 50;
    const cloud2X = (width - 100 + (frameCountRef.current * 0.1)) % (width + 100) - 50;
    ctx.fillRect(cloud1X, 80, 40, 20);
    ctx.fillRect(cloud2X, 120, 60, 30);
    
    pipesRef.current.forEach(pipe => drawPipe(ctx, pipe));
    drawParticles(ctx);
    drawGround(ctx);
    drawJumpParticles(ctx);
    drawBird(ctx, birdRef.current.y);
    drawHUD(ctx);
    frameIdRef.current = requestAnimationFrame(loop);
  }, [status, config, skin, botActive, keepBiomeInGame, onGameOver, onScoreUpdate, onBiomeChange, handleJump, width, height]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      scoreRef.current = 0;
      setScoreDisplay(0);
      birdRef.current = { y: height / 2, velocity: 0 };
      pipesRef.current = [];
      explodedParticlesRef.current = [];
      jumpParticlesRef.current = [];
      frameCountRef.current = 0;
      frameIdRef.current = requestAnimationFrame(loop);
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const theme = currentThemeRef.current;
          ctx.fillStyle = theme.background;
          ctx.fillRect(0, 0, width, height);
          drawSun(ctx);
          drawGround(ctx);
          if (status === GameStatus.START) drawBird(ctx, height / 2);
        }
      }
    }
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [status, loop, width, height]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border-8 border-gray-800 rounded-lg shadow-2xl cursor-pointer ${isMobile ? 'w-full h-auto max-w-[400px]' : 'w-full h-auto'}`}
        onClick={handleJump}
      />
    </div>
  );
};

export default GameCanvas;
