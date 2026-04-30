import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
}

export default function SnakeGame({ score, setScore, highScore }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, gameStarted, generateFood, setScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case 'w': if (direction !== 'DOWN') setDirection('UP'); break;
        case 's': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'a': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'd': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, isGameOver, moveSnake]);

  return (
    <div className="relative w-[500px] h-[500px] bg-bg-card border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-sm overflow-hidden flex items-center justify-center">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', 
          backgroundSize: '25px 25px' 
        }} 
      />

      <div 
        className="relative"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              x: segment.x * 20, 
              y: segment.y * 20,
              scale: i === 0 ? 1 : 0.85,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute w-5 h-5 rounded-sm ${i === 0 ? 'bg-cyan-400 z-20 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-500/40 z-10'}`}
            style={{ opacity: 1 - (i / (snake.length + 5)) }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            boxShadow: ['0 0 10px #d946ef', '0 0 20px #d946ef', '0 0 10px #d946ef']
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute w-5 h-5 bg-fuchsia-500 rounded-full z-10"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20 
          }}
        />

        {/* Game UI Labels */}
        <div className="absolute -top-8 -left-4 text-[10px] font-mono text-cyan-500/40 tracking-widest uppercase">
          SEC_04 // GRID_{GRID_SIZE}x{GRID_SIZE}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {(isGameOver || !gameStarted) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center border border-cyan-500/20"
            >
              <div className="mb-4 w-12 h-12 bg-cyan-500/20 border border-cyan-500 flex items-center justify-center rounded-sm">
                <div className="w-4 h-4 bg-cyan-400 animate-ping rounded-full" />
              </div>
              
              <motion.h2 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-3xl font-black text-white mb-2 tracking-[0.2em] uppercase"
              >
                {isGameOver ? 'SYSTEM ERROR' : 'INITIALIZING'}
              </motion.h2>
              <p className="text-cyan-500/60 mb-8 font-mono text-[10px] uppercase tracking-widest">
                {isGameOver ? `Fragment Recovery: ${score} Units` : 'Wait for neural synchronization...'}
              </p>
              
              <button 
                onClick={resetGame}
                className="px-10 py-3 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                {isGameOver ? 'REBOOT_CORE' : 'START_LINK'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="px-2 py-1 bg-black/80 border border-cyan-500/30 text-[9px] text-cyan-400 uppercase font-mono tracking-widest">
          WASD or Arrows to navigate
        </div>
      </div>
    </div>
  );
}
