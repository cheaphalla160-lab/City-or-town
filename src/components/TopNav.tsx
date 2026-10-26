import React from 'react';
import { Volume2, VolumeX, Music, Trophy, BookOpen, Sparkles, HelpCircle, Play } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface TopNavProps {
  currentView: 'game' | 'vocabulary' | 'leaderboard' | 'guide';
  onNavigate: (view: 'game' | 'vocabulary' | 'leaderboard' | 'guide') => void;
  isBgmPlaying: boolean;
  isMuted: boolean;
  onToggleBgm: () => void;
  onToggleMute: () => void;
  onQuickStart: () => void;
  gameStatus: 'idle' | 'playing' | 'found' | 'finished';
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  isBgmPlaying,
  isMuted,
  onToggleBgm,
  onToggleMute,
  onQuickStart,
  gameStatus,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate('game')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        >
          <span className="text-2xl" role="img" aria-label="circus tent">🎪</span>
          <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-display group-hover:text-amber-600 transition-colors whitespace-nowrap shrink-0">
            Clown in Town & City
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('game')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'game'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => onNavigate('vocabulary')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'vocabulary'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Words & Phonics</span>
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'leaderboard'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => onNavigate('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'guide'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Teacher Guide</span>
          </button>
        </nav>

        {/* Zone 3: Audio toggles & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Music button */}
          <button
            onClick={() => {
              audioManager.playPop();
              onToggleBgm();
            }}
            title={isBgmPlaying ? 'Pause cheerful BGM' : 'Play cheerful BGM'}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isBgmPlaying
                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce text-amber-600' : ''}`} />
            <span className="hidden sm:inline">{isBgmPlaying ? 'Music On' : 'Music Off'}</span>
          </button>

          {/* Mute button */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              isMuted
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          {gameStatus === 'idle' || gameStatus === 'finished' ? (
            <button
              onClick={() => {
                audioManager.playSuccess();
                onQuickStart();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Game</span>
            </button>
          ) : (
            <button
              onClick={() => {
                audioManager.playPop();
                onQuickStart();
              }}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
