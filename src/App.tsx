/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { GameStage } from './components/GameStage';
import { SentenceFollowModal } from './components/SentenceFollowModal';
import { VocabularyDeckModal } from './components/VocabularyDeckModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { GameOverModal } from './components/GameOverModal';
import { SpawnPoint, GameDifficulty, LeaderboardEntry } from './types/game';
import { INITIAL_LEADERBOARD, DIFFICULTY_CONFIGS } from './data/gameData';
import { audioManager } from './utils/audio';
import { Play, Sparkles, BookOpen, Trophy, Sliders, Volume2, HelpCircle } from 'lucide-react';

const STORAGE_KEY_LEADERBOARD = 'clown_game_leaderboard_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<'game' | 'vocabulary' | 'leaderboard' | 'guide'>('game');
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'found' | 'finished'>('idle');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [foundCount, setFoundCount] = useState<number>(0);
  const [currentFoundSpawn, setCurrentFoundSpawn] = useState<SpawnPoint | null>(null);

  // Audio state
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEADERBOARD;
  });

  const saveLeaderboard = (newEntries: LeaderboardEntry[]) => {
    setLeaderboard(newEntries);
    try {
      localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(newEntries));
    } catch {
      // LocalStorage error fallback
    }
  };

  const handleStartGame = () => {
    setCurrentRound(1);
    setScore(0);
    setStreak(0);
    setFoundCount(0);
    setCurrentFoundSpawn(null);
    setGameStatus('playing');
    setCurrentView('game');

    // Start background music automatically if not playing
    if (!isBgmPlaying && !isMuted) {
      audioManager.startBgm();
      setIsBgmPlaying(true);
    }
  };

  const handleClownFound = (spawnPoint: SpawnPoint, reactionTimeMs: number) => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    setFoundCount((prev) => prev + 1);

    // Speed bonus
    const speedBonus = Math.max(20, Math.round((4000 - reactionTimeMs) / 25));
    const streakBonus = (newStreak - 1) * 20;
    const roundScore = 100 + speedBonus + streakBonus;

    setScore((prev) => prev + roundScore);
    setCurrentFoundSpawn(spawnPoint);
    setGameStatus('found');
  };

  const handleMissClown = () => {
    setStreak(0);
  };

  const handleNextRound = (speechBonus: number) => {
    setScore((prev) => prev + speechBonus);
    setCurrentFoundSpawn(null);

    if (currentRound >= totalRounds) {
      audioManager.playCheer();
      setGameStatus('finished');
    } else {
      setCurrentRound((prev) => prev + 1);
      setGameStatus('playing');
    }
  };

  const handleAddLeaderboardEntry = (name: string, entryScore: number, accuracy: number, stars: number) => {
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}`,
      name,
      score: entryScore,
      accuracy,
      stars,
      date: 'Just now',
      badge: entryScore >= 900 ? 'Master Detective' : entryScore >= 700 ? 'Clown Catcher' : 'Star Scout',
    };

    const updated = [newEntry, ...leaderboard];
    saveLeaderboard(updated);
  };

  const handleResetLeaderboard = () => {
    saveLeaderboard(INITIAL_LEADERBOARD);
  };

  const handleToggleBgm = () => {
    const nextState = audioManager.toggleBgm();
    setIsBgmPlaying(nextState);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioManager.setMute(nextMuted);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar adhering to Section 2 Top Bar Contract */}
      <TopNav
        currentView={currentView}
        onNavigate={(view) => {
          audioManager.playPop();
          setCurrentView(view);
        }}
        isBgmPlaying={isBgmPlaying}
        isMuted={isMuted}
        onToggleBgm={handleToggleBgm}
        onToggleMute={handleToggleMute}
        onQuickStart={handleStartGame}
        gameStatus={gameStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* GAME VIEW */}
        {currentView === 'game' && (
          <div className="space-y-6">
            {/* Quick Classroom / Teacher Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                {/* Difficulty selector */}
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 font-bold uppercase">Difficulty:</span>
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {(['easy', 'normal', 'challenge'] as GameDifficulty[]).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => {
                          audioManager.playPop();
                          setDifficulty(diff);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          difficulty === diff
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {diff === 'easy' && 'Easy (4.5s)'}
                        {diff === 'normal' && 'Normal (3.2s)'}
                        {diff === 'challenge' && 'Fast (2.0s)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rounds selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold uppercase">Rounds:</span>
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {[5, 10, 15].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          audioManager.playPop();
                          setTotalRounds(r);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          totalRounds === r
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick links to Words & Phonics */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioManager.playPop();
                    setCurrentView('vocabulary');
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>单词预习 (Words & Phonics)</span>
                </button>
                <button
                  onClick={() => {
                    audioManager.playPop();
                    setCurrentView('guide');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>备课教案 (Lesson Guide)</span>
                </button>
              </div>
            </div>

            {/* Main Game Stage */}
            <GameStage
              difficulty={difficulty}
              roundNumber={currentRound}
              totalRounds={totalRounds}
              score={score}
              streak={streak}
              onClownFound={handleClownFound}
              onMissClown={handleMissClown}
              gameStatus={gameStatus}
            />

            {/* Start Game Hero CTA if Idle */}
            {gameStatus === 'idle' && (
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-amber-200 text-xs font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>小学英语课堂互动课件 · Interactive English</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-display">
                    Find the Clown: In the City or in the Town?
                  </h2>
                  <p className="text-sm text-amber-100 max-w-xl">
                    在屏幕两边的 <strong>City</strong> 与 <strong>Town</strong> 寻找随机出现的小丑！点击锁定后，全班大声跟读重点句型并参与语音打卡！
                  </p>
                </div>

                <button
                  onClick={handleStartGame}
                  className="px-8 py-4 bg-white hover:bg-amber-50 text-slate-900 font-black text-lg rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center gap-2.5 shrink-0 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-slate-900" />
                  <span>立即开始游戏 (Start Game)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* VOCABULARY VIEW */}
        {currentView === 'vocabulary' && <VocabularyDeckModal />}

        {/* LEADERBOARD VIEW */}
        {currentView === 'leaderboard' && (
          <LeaderboardModal
            entries={leaderboard}
            onAddEntry={handleAddLeaderboardEntry}
            onResetLeaderboard={handleResetLeaderboard}
            currentSessionScore={score}
          />
        )}

        {/* TEACHER'S LESSON GUIDE VIEW */}
        {currentView === 'guide' && <TeacherGuideModal />}
      </main>

      {/* Found Clown Sentence Follow-Along Modal */}
      {gameStatus === 'found' && currentFoundSpawn && (
        <SentenceFollowModal
          spawnPoint={currentFoundSpawn}
          roundNumber={currentRound}
          totalRounds={totalRounds}
          onNextRound={handleNextRound}
        />
      )}

      {/* Game Over Modal */}
      {gameStatus === 'finished' && (
        <GameOverModal
          score={score}
          totalRounds={totalRounds}
          foundCount={foundCount}
          onSaveScore={(name) => {
            const acc = Math.round((foundCount / Math.max(1, totalRounds)) * 100);
            const stars = acc >= 80 ? 3 : acc >= 50 ? 2 : 1;
            handleAddLeaderboardEntry(name, score, acc, stars);
          }}
          onPlayAgain={handleStartGame}
          onGoToLeaderboard={() => {
            setCurrentView('leaderboard');
            setGameStatus('idle');
          }}
        />
      )}

      {/* Footer conforming to Section 1.B */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 md:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Clown in Town & City</span>
            <span>·</span>
            <span>小学英语互动备课课件与自然拼读教学系统</span>
          </div>
          <div>
            Learning Targets: <code className="font-mono text-slate-600 font-bold">city</code> · <code className="font-mono text-slate-600 font-bold">town</code> · <code className="font-mono text-slate-600 font-bold">clown</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
