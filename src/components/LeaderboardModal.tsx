import React, { useState } from 'react';
import { Trophy, Medal, Star, Plus, RotateCcw, Award, CheckCircle } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { audioManager } from '../utils/audio';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  onAddEntry: (name: string, score: number, accuracy: number, stars: number) => void;
  onResetLeaderboard: () => void;
  currentSessionScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  onAddEntry,
  onResetLeaderboard,
  currentSessionScore,
}) => {
  const [newName, setNewName] = useState('');
  const [customScore, setCustomScore] = useState(currentSessionScore || 500);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sort descending by score
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    audioManager.playCheer();
    onAddEntry(newName.trim(), customScore, 100, 3);
    setNewName('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-xs">
            🏆
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              Classroom Leaderboard
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              寻找小丑眼明手快大冲榜 · 记录每位小朋友或小组的精彩表现
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioManager.playPop();
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>登记新得分</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('确定要重置当前排行榜为初始数据吗？（适合开启新班级）')) {
                audioManager.playPop();
                onResetLeaderboard();
              }
            }}
            title="Reset to initial entries"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              ➕ 快速登记学生/小组得分
            </span>
            {submitted && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 登记成功！
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="输入名字或组名 (例: Group 1, Leo, Lily)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="number"
              min="0"
              max="2000"
              placeholder="得分 (Score)"
              value={customScore}
              onChange={(e) => setCustomScore(Number(e.target.value))}
              className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              提交入榜 (Submit)
            </button>
          </div>
        </form>
      )}

      {/* Top 3 Podium Visual */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 items-end pt-4">
        {/* 2nd Place */}
        {sortedEntries[1] && (
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mb-2 border-2 border-slate-300">
              🥈
            </div>
            <div className="text-xs font-bold uppercase text-slate-400">2nd Place</div>
            <div className="text-sm md:text-base font-extrabold text-slate-800 truncate max-w-full">
              {sortedEntries[1].name}
            </div>
            <div className="text-lg md:text-xl font-black text-slate-700 font-mono mt-1">
              {sortedEntries[1].score} <span className="text-xs font-normal">pts</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {sortedEntries[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-5 md:p-7 border-2 border-amber-400 shadow-md text-center flex flex-col items-center -translate-y-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-2 border-2 border-amber-300 shadow-xs">
              👑
            </div>
            <div className="text-xs font-bold uppercase text-amber-600">Champion</div>
            <div className="text-base md:text-lg font-black text-slate-900 truncate max-w-full">
              {sortedEntries[0].name}
            </div>
            <div className="text-xl md:text-2xl font-black text-amber-600 font-mono mt-1">
              {sortedEntries[0].score} <span className="text-xs font-normal">pts</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 mt-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {sortedEntries[2] && (
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-50 flex items-center justify-center text-xl mb-2 border-2 border-amber-200">
              🥉
            </div>
            <div className="text-xs font-bold uppercase text-amber-700">3rd Place</div>
            <div className="text-sm md:text-base font-extrabold text-slate-800 truncate max-w-full">
              {sortedEntries[2].name}
            </div>
            <div className="text-lg md:text-xl font-black text-slate-700 font-mono mt-1">
              {sortedEntries[2].score} <span className="text-xs font-normal">pts</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Student Rankings (全部成绩排名)
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {sortedEntries.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-3 px-6 w-16">Rank</th>
                <th className="py-3 px-6">Player / Group</th>
                <th className="py-3 px-6">Badge</th>
                <th className="py-3 px-6 text-right">Accuracy</th>
                <th className="py-3 px-6 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {sortedEntries.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    idx < 3 ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-6 font-display font-black text-base">
                    {idx === 0 && <span className="text-amber-500 font-bold">#1 🥇</span>}
                    {idx === 1 && <span className="text-slate-500 font-bold">#2 🥈</span>}
                    {idx === 2 && <span className="text-amber-700 font-bold">#3 🥉</span>}
                    {idx >= 3 && <span className="text-slate-400 font-mono">#{idx + 1}</span>}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {item.badge}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono text-xs text-slate-600">
                    {item.accuracy}%
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-black text-base text-amber-600">
                    {item.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
