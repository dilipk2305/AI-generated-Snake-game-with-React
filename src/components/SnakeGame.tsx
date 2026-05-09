import { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const INITIAL_SNAKE = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ setScore }: { setScore: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number | null>(INITIAL_SPEED);
  
  const currentDirection = useRef(direction);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirection.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setScore(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused(prev => !prev);
      return;
    }

    if (isGameOver && e.key === 'Enter') {
        resetGame();
        return;
    }

    if (isPaused || isGameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDirection.current.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDirection.current.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDirection.current.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDirection.current.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isPaused, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
     currentDirection.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + currentDirection.current.x,
        y: head.y + currentDirection.current.y,
      };

      // Collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        setScore(newSnake.length - INITIAL_SNAKE.length);
        setSpeed(prev => (prev ? Math.max(prev - 2, 50) : null));
      } else {
        newSnake.pop(); 
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, setScore]);

  useInterval(moveSnake, isPaused || isGameOver ? null : speed);

  return (
    <div className={`relative bg-black border-4 outline-none aspect-square flex flex-col font-retro uppercase ${isGameOver ? 'border-[#ff00c1]' : 'border-[#00fff9]'}`} tabIndex={0}>
        <div 
          className="w-full h-full grid relative z-10" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full border-[1px] border-[#00fff9]/10 
                  ${isHead ? 'bg-[#00fff9]' : ''}
                  ${isBody ? 'bg-[#00fff9] opacity-80' : ''}
                  ${isFood ? 'bg-[#ff00c1]' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Glitch Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,249,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,249,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

        {isGameOver && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20 crt-flicker border-8 border-[#ff00c1]">
            <h2 className="text-5xl md:text-6xl font-bold text-[#ff00c1] mb-2 text-center glitch-effect" data-text="KERNEL PANIC">
              KERNEL PANIC
            </h2>
            <h3 className="text-3xl text-[#00fff9] mb-10 glitch-effect" data-text="SEGMENTATION FAULT">
              SEGMENTATION FAULT
            </h3>
            
            <div className="text-[#00fff9] text-2xl font-bold mb-10 flex gap-4 tracking-widest">
              <span>FINAL_YIELD:</span>
              <span className="text-[#ff00c1]">{(snake.length - INITIAL_SNAKE.length) * 10}</span>
            </div>

            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-black border-4 border-[#ff00c1] text-[#ff00c1] text-3xl font-bold hover:bg-[#ff00c1] hover:text-black transition-none shadow-[8px_8px_0_#00fff9] uppercase tracking-widest active:translate-y-1 active:translate-x-1 active:shadow-[4px_4px_0_#00fff9]"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 border-4 border-[#00fff9]">
            <h2 className="text-5xl md:text-6xl font-bold text-[#00fff9] uppercase glitch-effect" data-text="SYSTEM HALTED">
              SYSTEM HALTED
            </h2>
          </div>
        )}

        {!isGameOver && !isPaused && (
           <div className="absolute top-2 left-2 text-[#00fff9]/60 text-lg z-0 font-bold pointer-events-none tracking-widest">
             X:{snake[0].x.toString().padStart(2, '0')} Y:{snake[0].y.toString().padStart(2, '0')}
           </div>
        )}
    </div>
  );
}
