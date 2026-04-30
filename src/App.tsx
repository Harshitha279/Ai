import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Triangle, Radio, Music2 } from 'lucide-react';
import { Track } from './types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Circuit',
    artist: 'SynthWave AI',
    duration: 222,
    coverUrl: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '2',
    title: 'Cybernetic Drift',
    artist: 'DataStream Alpha',
    duration: 255,
    coverUrl: 'https://picsum.photos/seed/synth/400/400'
  },
  {
    id: '3',
    title: 'Neon Horizon',
    artist: 'Pixel Beats',
    duration: 178,
    coverUrl: 'https://picsum.photos/seed/cyber/400/400'
  }
];

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="h-screen w-full bg-bg-deep text-white font-sans flex flex-col overflow-hidden border-8 border-[#111] relative">
      {/* Header Section */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-cyan-500/30 bg-black/40 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
             <Triangle className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-xl font-black tracking-widest text-cyan-400">NEON PULSE</span>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-cyan-500/60 font-mono">CURRENT_SCORE</span>
            <span className="text-2xl font-mono text-cyan-400 leading-none text-glow-cyan">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-fuchsia-500/60 font-mono">HIGH_SCORE</span>
            <span className="text-2xl font-mono text-fuchsia-500 leading-none text-glow-pink">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-6 gap-6 z-10">
        {/* Sidebar Left: Audio Datastream */}
        <aside className="w-72 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Audio Datastream</div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {DUMMY_TRACKS.map((track, idx) => (
              <button 
                key={track.id}
                onClick={() => setCurrentTrackIndex(idx)}
                className={`p-3 rounded-sm text-left transition-all flex items-center gap-3 group ${
                  currentTrackIndex === idx ? 'bg-white/5 border-l-2 border-cyan-500' : 'bg-transparent border-l-2 border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center transition-all ${
                  currentTrackIndex === idx ? 'bg-gradient-to-br from-cyan-600 to-blue-900 shadow-inner' : 'opacity-60 bg-gradient-to-br from-gray-700 to-gray-900'
                }`}>
                  {currentTrackIndex === idx && <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate ${currentTrackIndex === idx ? 'text-cyan-400' : 'text-gray-300'}`}>
                    {track.title}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase">{track.artist}</div>
                </div>
                <div className={`text-xs ${currentTrackIndex === idx ? 'text-cyan-500' : 'text-gray-500'}`}>
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 rounded-xl bg-gradient-to-t from-cyan-900/20 to-transparent border border-cyan-500/20">
            <div className="text-[10px] text-cyan-400/80 mb-2 font-mono flex justify-between">
              <span>SYSTEM_STATUS</span>
              <span className="text-cyan-500">82%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" 
              />
            </div>
            <div className="text-[10px] mt-2 text-gray-500 uppercase tracking-tighter">CORE_FREQ: 1.25GHZ // TEMP: 42°C</div>
          </div>
        </aside>

        {/* Center Section: Snake Game */}
        <section className="flex-1 flex flex-col items-center justify-center relative">
          <SnakeGame 
            score={score} 
            setScore={setScore} 
            highScore={highScore}
          />
        </section>

        {/* Sidebar Right: Controls & Visualizer */}
        <aside className="w-80 flex flex-col gap-6">
          <MusicPlayer 
            currentTrack={currentTrack}
            onNext={() => setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length)}
            onPrev={() => setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length)}
          />

          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Spectral Analysis</div>
            <div className="flex-1 flex items-end justify-between gap-1.5 px-2">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [20, 60, 40, 80, 50, 90, 30][(i + Math.floor(Math.random() * 7)) % 7],
                    backgroundColor: i % 3 === 0 ? '#d946ef' : i % 3 === 1 ? '#22d3ee' : '#ffffff'
                  }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  className="w-2.5 rounded-t-sm opacity-80"
                  style={{ 
                    boxShadow: i % 3 === 0 ? '0 0 12px #d946ef' : i % 3 === 1 ? '0 0 12px #22d3ee' : '0 0 12px #ffffff'
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[8px] font-mono text-gray-600 tracking-widest uppercase">
              <span>20hz</span>
              <span>440hz</span>
              <span>20khz</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Status Bar */}
      <footer className="h-8 bg-cyan-950/20 border-t border-cyan-500/10 px-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-4 text-[9px] text-cyan-500/50 uppercase font-mono">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> Node: US-EAST-01</span>
          <span>//</span>
          <span>Link State: OPTIMAL</span>
          <span>//</span>
          <span>Latency: 14MS</span>
        </div>
        <div className="text-[9px] font-mono text-fuchsia-500/50 uppercase">
          Build: v2.4.99-RHYTHM_PULSE
        </div>
      </footer>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
    </div>
  );
}
