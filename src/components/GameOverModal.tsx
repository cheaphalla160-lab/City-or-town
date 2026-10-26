import React, { useState } from 'react';
import { Trophy, Star, RotateCcw, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  totalRounds: number;
  foundCount: number;
  onSaveScore: (name: string) => void;
  onPlayAgain: () => void;
  onGoToLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  totalRounds,
  foundCount,
  onSaveScore,
  onPlayAgain,
  onGoToLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  const accuracy = Math.round((foundCount / Math.max(1, totalRounds)) * 100);
  const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || hasSaved) return;

    audioManager.playCheer();
    onSaveScore(playerName.trim());
    setHasSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-6 md:p-8 text-center overflow-hidden">
        {/* Confetti Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        {/* Big Trophy Mascot */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
          🏆
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
          Challenge Completed!
        </h2>
        <p className="text-sm font-semibold text-slate-600 mt-1">
          探险结束！所有关卡的小丑都被你找到啦！
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 ${
                i < stars
                  ? 'fill-amber-400 text-amber-400 animate-bounce'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Score & Stats Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Final Score</div>
            <div className="text-3xl font-black text-amber-600 font-mono mt-0.5">
              {score}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Accuracy (正确率)</div>
            <div className="text-3xl font-black text-emerald-600 font-mono mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        {!hasSaved ? (
          <form onSubmit={handleSave} className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-700 text-left">
              📝 登记到班级排行榜 (Save to Leaderboard):
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="学生姓名或小组名 (例: Group 1, Amy)"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                保存成绩
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>成绩已成功保存到排行榜！🎉</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              audioManager.playSuccess();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再玩一次 (Play Again)</span>
          </button>
          <button
            onClick={() => {
              audioManager.playPop();
              onGoToLeaderboard();
            }}
            className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>查看排行榜</span>
          </button>
        </div>
      </div>
    </div>
  );
};
