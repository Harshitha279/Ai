import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrack: Track;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({ currentTrack, onNext, onPrev }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center relative group overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="w-40 h-40 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-lg shadow-2xl mb-6 relative flex items-center justify-center overflow-hidden border border-white/10">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title}
          className="w-full h-full object-cover absolute inset-0 opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />
        {isPlaying ? (
          <div className="w-16 h-16 border-4 border-white/30 rounded-full border-t-white animate-spin" />
        ) : (
          <Music2 className="w-12 h-12 text-white/50" />
        )}
      </div>

      <motion.div
        key={currentTrack.id}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h3 className="text-xl font-bold text-white tracking-tight">{currentTrack.title}</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-mono">{currentTrack.artist}</p>
      </motion.div>
      
      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={onPrev}
          className="text-gray-500 hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all group/play"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={onNext}
          className="text-gray-500 hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2 group/progress">
          <span className="text-[10px] font-mono text-gray-600">01:24</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
              style={{ width: `${progress}%` }}
              animate={{ boxShadow: isPlaying ? '0 0 10px rgba(34,211,238,0.5)' : 'none' }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-600">
            {Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
