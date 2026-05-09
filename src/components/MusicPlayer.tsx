import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setProgress(audio.currentTime);
    const handleEnded = () => nextTrack();

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("AUDIO_ERROR", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("AUDIO_ERROR", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-[#00fff9] p-6 w-full max-w-xl shadow-[8px_8px_0_#ff00c1] flex flex-col gap-6 uppercase font-bold relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[#ff00c1] animate-pulse"></div>
      
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 bg-black border-2 border-[#ff00c1] flex items-center justify-center shrink-0 shadow-[4px_4px_0_#00fff9] relative overflow-hidden group">
             <Disc3 className={`text-[#ff00c1] w-12 h-12 ${isPlaying ? 'animate-spin' : ''}`} strokeWidth={1.5} />
             <div className="absolute inset-0 bg-[#ff00c1]/20 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex-1 min-w-0 mt-1">
          <p className="text-[#00fff9]/70 text-lg tracking-widest mb-1">AUDIO_STREAM // {currentTrack.artist}</p>
          <h3 className="text-[#00fff9] font-bold truncate text-4xl glitch-effect" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-2xl text-[#ff00c1]">
          <span>[{formatTime(progress)}]</span>
          <span>[{formatTime(duration)}]</span>
        </div>
        <div className="relative w-full h-[14px] bg-black border-2 border-[#00fff9] flex items-center px-1">
          <div 
            className="h-full bg-[#ff00c1] transition-all duration-100" 
            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t-4 border-[#00fff9]/30 pt-6 mt-2">
         <div className="flex items-center gap-3 w-1/3">
             <button onClick={() => setIsMuted(!isMuted)} className="text-[#00fff9] hover:text-[#ff00c1] transition-none bg-black p-2 border-2 border-transparent hover:border-[#ff00c1]">
                {isMuted || volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
             </button>
         </div>

        <div className="flex items-center gap-4 w-auto justify-center">
          <button onClick={prevTrack} className="p-3 border-2 border-[#00fff9] text-[#00fff9] hover:bg-[#00fff9] hover:text-black transition-none shadow-[2px_2px_0_#ff00c1]">
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          <button 
            onClick={togglePlayPause} 
            className="p-4 border-2 border-[#ff00c1] bg-black text-[#ff00c1] hover:bg-[#ff00c1] hover:text-black transition-none shadow-[4px_4px_0_#00fff9]"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>
          <button onClick={nextTrack} className="p-3 border-2 border-[#00fff9] text-[#00fff9] hover:bg-[#00fff9] hover:text-black transition-none shadow-[2px_2px_0_#ff00c1]">
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>
        
        <div className="w-1/3 flex justify-end text-[#00fff9]/70 text-xl font-bold tracking-wider">
           VOL:{Math.round(volume*100)}%
        </div>
      </div>
    </div>
  );
}
