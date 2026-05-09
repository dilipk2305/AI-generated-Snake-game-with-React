import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00fff9] flex flex-col font-retro uppercase selection:bg-[#ff00c1] selection:text-black overflow-hidden relative crt-flicker">
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <header className="w-full flex-none p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 border-b-4 border-[#ff00c1] bg-[#050505]">
        <div className="flex items-center gap-3">
          <div className="p-2 border-2 border-[#00fff9] bg-black shadow-[4px_4px_0_#ff00c1]">
            <Terminal className="w-6 h-6 text-[#00fff9] animate-pulse" strokeWidth={2} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-widest text-[#00fff9] screen-tear">
            SYS.OP //<span className="text-[#ff00c1] ml-2">SNAKE_PROTOCOL</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-black px-6 py-2 border-2 border-[#00fff9] shadow-[4px_4px_0_#ff00c1]">
          <span className="text-[#ff00c1] font-bold tracking-widest text-xl">MEM_YIELD:</span>
          <span className="text-4xl sm:text-5xl text-[#00fff9] font-bold glitch-effect" data-text={score * 10}>
            {score * 10}
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 p-6 sm:p-12 z-10 mb-8 lg:mb-0">
        
        {/* Left/Top: The Game */}
        <div className="w-full max-w-[600px] lg:w-3/5 flex justify-center">
            <div className="w-full p-2 border-4 border-[#00fff9] bg-black shadow-[12px_12px_0_#ff00c1] relative screen-tear pointer-events-auto">
              <SnakeGame setScore={setScore} />
            </div>
        </div>

        {/* Right/Bottom: Music Player & Info */}
        <div className="w-full max-w-[600px] lg:w-2/5 flex flex-col gap-10 items-center lg:items-start relative pointer-events-auto">
            <MusicPlayer />
            
            <div className="bg-black border-2 border-[#ff00c1] p-6 w-full flex flex-col gap-4 shadow-[8px_8px_0_#00fff9]">
                <h3 className="text-[#00fff9] font-bold tracking-widest text-2xl border-b-2 border-[#ff00c1] pb-2 uppercase glitch-effect" data-text="EXECUTION_PARAMETERS">
                  EXECUTION_PARAMETERS
                </h3>
                <p className="text-xl leading-relaxed text-[#00fff9]/80 mt-2">
                  <span className="text-[#ff00c1]">&gt;</span> UPTAKE MEMORY SECTORS (MAGENTA).<br/>
                  <span className="text-[#ff00c1]">&gt;</span> AVOID SYSTEM BOUNDARIES.<br/>
                  <span className="text-[#ff00c1]">&gt;</span> OVERLAP CAUSES KERNEL PANIC.
                </p>
                <div className="flex flex-wrap gap-4 mt-6 uppercase font-bold text-xl">
                    <span className="px-3 py-1 bg-[#00fff9] text-black border-2 border-transparent">WASD</span>
                    <span className="px-3 py-1 bg-[#00fff9] text-black border-2 border-transparent">ARROWS</span>
                    <span className="px-3 py-1 border-2 border-[#ff00c1] text-[#ff00c1] shadow-[4px_4px_0_#00fff9]">SPACE=HALT</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
