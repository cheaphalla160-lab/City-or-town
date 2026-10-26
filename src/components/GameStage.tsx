import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Timer, Zap, HelpCircle, Eye } from 'lucide-react';
import { SpawnPoint, GameDifficulty } from '../types/game';
import { SPAWN_POINTS, DIFFICULTY_CONFIGS } from '../data/gameData';
import { audioManager } from '../utils/audio';

interface GameStageProps {
  difficulty: GameDifficulty;
  roundNumber: number;
  totalRounds: number;
  score: number;
  streak: number;
  onClownFound: (spawnPoint: SpawnPoint, reactionTimeMs: number) => void;
  onMissClown: () => void;
  gameStatus: 'idle' | 'playing' | 'found' | 'finished';
}

export const GameStage: React.FC<GameStageProps> = ({
  difficulty,
  roundNumber,
  totalRounds,
  score,
  streak,
  onClownFound,
  onMissClown,
  gameStatus,
}) => {
  const [currentSpawn, setCurrentSpawn] = useState<SpawnPoint | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(DIFFICULTY_CONFIGS[difficulty].durationMs);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isPopping, setIsPopping] = useState<boolean>(false);

  const spawnTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const spawnStartTimeRef = useRef<number>(0);

  const config = DIFFICULTY_CONFIGS[difficulty];

  // Pick random spawn point different from the previous one
  const spawnNewClown = () => {
    // Clear old timers
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    const available = SPAWN_POINTS.filter((p) => !currentSpawn || p.id !== currentSpawn.id);
    const chosen = available[Math.floor(Math.random() * available.length)];

    setCurrentSpawn(chosen);
    setTimeLeft(config.durationMs);
    setShowHint(false);
    setIsPopping(true);
    spawnStartTimeRef.current = Date.now();

    // Play clown appearance audio
    audioManager.playPop();

    // Countdown interval
    const stepMs = 50;
    countdownIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= stepMs) {
          clearInterval(countdownIntervalRef.current!);
          return 0;
        }
        return prev - stepMs;
      });
    }, stepMs);

    // Timeout if missed
    spawnTimerRef.current = window.setTimeout(() => {
      audioManager.playWhoosh();
      onMissClown();
      // Respawn or move
      spawnNewClown();
    }, config.durationMs);
  };

  useEffect(() => {
    if (gameStatus === 'playing') {
      spawnNewClown();
    } else {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [gameStatus, roundNumber, difficulty]);

  const handleClownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameStatus !== 'playing' || !currentSpawn) return;

    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    const reactionTime = Date.now() - spawnStartTimeRef.current;
    audioManager.playClownHonk();
    audioManager.playSuccess();
    onClownFound(currentSpawn, reactionTime);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / config.durationMs) * 100));

  return (
    <div className="w-full flex flex-col gap-3">
      {/* HUD Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Round & Streak */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Round</span>
            <span className="text-lg font-black text-slate-900 font-display">
              {roundNumber} <span className="text-xs text-slate-400 font-normal">/ {totalRounds}</span>
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Score</span>
            <span className="text-lg font-black text-amber-600 font-display">
              {score}
            </span>
          </div>

          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-orange-500" />
              <span>{streak}x Combo!</span>
            </div>
          )}
        </div>

        {/* Center: Instruction */}
        <div className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Eye className="w-4 h-4 text-amber-600 animate-bounce" />
          <span>快找找小丑在哪里？点击他！(Click the Clown!)</span>
        </div>

        {/* Right: Timer & Hint */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-400" />
            <div className="w-24 md:w-32 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  progressPercent > 50
                    ? 'bg-emerald-500'
                    : progressPercent > 25
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 w-10">
              {(timeLeft / 1000).toFixed(1)}s
            </span>
          </div>

          {/* Teacher / Student Hint Button */}
          <button
            onClick={() => {
              audioManager.playPop();
              setShowHint(!showHint);
            }}
            title="Give visual hint"
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Visual Stage (Left: City / Right: Town) */}
      <div className="relative w-full h-[520px] md:h-[600px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-900 select-none">
        <div className="absolute inset-0 flex flex-col md:flex-row">
          
          {/* LEFT HALF: CITY (城市) */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-slate-700 group">
            <img
              src="/src/assets/images/illustration_city_scenery_1793013807956.jpg"
              alt="City illustration with skyscrapers and buses"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            {/* Header Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-sky-400/40 shadow-lg">
              <span className="text-2xl">🏙️</span>
              <div>
                <div className="text-base font-black tracking-wider text-sky-300 font-display uppercase">
                  CITY
                </div>
                <div className="text-[10px] text-slate-300 font-medium">大城市 · Skyscrapers & Roads</div>
              </div>
            </div>

            {/* City Clown Sprite Container */}
            {gameStatus === 'playing' && currentSpawn && currentSpawn.location === 'city' && (
              <motion.div
                key={currentSpawn.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={handleClownClick}
                style={{
                  top: `${currentSpawn.y}%`,
                  left: `${currentSpawn.x}%`,
                }}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/clown"
              >
                {/* Visual Ring / Hint Beacon */}
                {(showHint || difficulty === 'easy') && (
                  <div className="absolute -inset-4 rounded-full border-4 border-amber-400/80 animate-ping pointer-events-none" />
                )}

                {/* Clown Pop Card */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl p-1 bg-white/95 border-3 border-amber-400 shadow-2xl hover:scale-115 active:scale-95 transition-transform flex items-center justify-center">
                  <img
                    src="/src/assets/images/character_cute_clown_1793013808884.jpg"
                    alt="Cute smiling clown"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating speech bubble */}
                  <div className="absolute -top-7 whitespace-nowrap bg-amber-500 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md animate-bounce">
                    Catch me! 🎈
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT HALF: TOWN (小镇) */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group">
            <img
              src="/src/assets/images/illustration_town_scenery_1793013808607.jpg"
              alt="Town illustration with cottages, bakery, and cobblestones"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            {/* Header Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-emerald-400/40 shadow-lg">
              <span className="text-2xl">🏡</span>
              <div className="text-right">
                <div className="text-base font-black tracking-wider text-emerald-300 font-display uppercase">
                  TOWN
                </div>
                <div className="text-[10px] text-slate-300 font-medium">小镇 · Cottages & Gardens</div>
              </div>
            </div>

            {/* Town Clown Sprite Container */}
            {gameStatus === 'playing' && currentSpawn && currentSpawn.location === 'town' && (
              <motion.div
                key={currentSpawn.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={handleClownClick}
                style={{
                  top: `${currentSpawn.y}%`,
                  left: `${currentSpawn.x}%`,
                }}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/clown"
              >
                {/* Visual Ring / Hint Beacon */}
                {(showHint || difficulty === 'easy') && (
                  <div className="absolute -inset-4 rounded-full border-4 border-amber-400/80 animate-ping pointer-events-none" />
                )}

                {/* Clown Pop Card */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl p-1 bg-white/95 border-3 border-amber-400 shadow-2xl hover:scale-115 active:scale-95 transition-transform flex items-center justify-center">
                  <img
                    src="/src/assets/images/character_cute_clown_1793013808884.jpg"
                    alt="Cute smiling clown"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating speech bubble */}
                  <div className="absolute -top-7 whitespace-nowrap bg-emerald-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md animate-bounce">
                    Catch me! 🎈
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Center Divider Tag */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 hidden md:flex flex-col items-center">
          <div className="bg-slate-900/90 text-amber-300 px-3.5 py-1.5 rounded-full border-2 border-amber-400 text-xs font-black shadow-2xl tracking-widest uppercase">
            VS
          </div>
        </div>

        {/* Start Game Overlay if idle */}
        {gameStatus === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
            <span className="text-6xl mb-3 animate-bounce">🎪</span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">
              Ready to find the clown?
            </h3>
            <p className="text-sm md:text-base text-slate-200 max-w-md mb-6">
              仔细观察左边的 <strong>City (城市)</strong> 和右边的 <strong>Town (小镇)</strong>。
              发现小丑出现后，立即点击他，并大声说出英语句子！
            </p>
          </div>
        )}
      </div>

      {/* Visual Hint Callout when active */}
      {showHint && currentSpawn && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>老师提示 (Hint):</strong> 小丑正在 <strong>{currentSpawn.location === 'city' ? '🏙️ City 城市' : '🏡 Town 小镇'}</strong> 的 &ldquo;{currentSpawn.spotName}&rdquo;（{currentSpawn.hint}）
          </span>
        </div>
      )}
    </div>
  );
};
