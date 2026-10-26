import React, { useState } from 'react';
import { Volume2, Snail, Sparkles, Building2, Home, Smile, ArrowRight, Check } from 'lucide-react';
import { VOCABULARY_DATA } from '../data/gameData';
import { audioManager } from '../utils/audio';

export const VocabularyDeckModal: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string>('city');

  const currentInfo = VOCABULARY_DATA.find((w) => w.word === selectedWord) || VOCABULARY_DATA[0];

  const handlePlayWord = (text: string, slow = false) => {
    audioManager.playPop();
    audioManager.speak(text, slow ? 0.65 : 0.85);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
        <span className="text-3xl mb-2 inline-block">📚</span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
          Core Vocabulary & Phonics Lab
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1">
          本课核心三词：<strong>city</strong>、<strong>town</strong> 与 <strong>clown</strong>。通过视觉卡片、标准发音和自然拼读押韵，带孩子们打下坚实基础。
        </p>
      </div>

      {/* Phonics Rhyme Highlight Box */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Phonics Magic · 自然拼读押韵</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-display">
            &ldquo;Town&rdquo; and &ldquo;Clown&rdquo; Rhyme!
          </h3>
          <p className="text-sm text-amber-100 max-w-lg">
            注意观察发音规律：<strong>t-<u>own</u></strong> 和 <strong>cl-<u>own</u></strong> 都含有相同的元音双字母组合 <strong>-own</strong>，发音都是 <span className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold">/aʊn/</span>！
          </p>
        </div>

        <button
          onClick={() => handlePlayWord('clown and town rhyme! clown, town!')}
          className="px-5 py-3 bg-white text-orange-600 hover:bg-orange-50 font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Volume2 className="w-5 h-5 text-orange-500" />
          <span>听押韵发音 (Listen Rhyme)</span>
        </button>
      </div>

      {/* 3 Interactive Word Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VOCABULARY_DATA.map((item) => {
          const isSelected = selectedWord === item.word;
          return (
            <div
              key={item.word}
              onClick={() => {
                audioManager.playPop();
                setSelectedWord(item.word);
              }}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-xl scale-102 ring-4 ring-amber-100'
                  : 'bg-white/90 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                {/* Word Icon & Phonics tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">
                    {item.word === 'city' && '🏙️'}
                    {item.word === 'town' && '🏡'}
                    {item.word === 'clown' && '🤡'}
                  </span>
                  {item.rhymeKey ? (
                    <span className="text-[11px] font-extrabold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                      Rhyme: {item.rhymeKey}
                    </span>
                  ) : (
                    <span className="text-[11px] font-extrabold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      Metropolis
                    </span>
                  )}
                </div>

                {/* Big Word */}
                <div className="text-3xl font-black text-slate-900 font-display">
                  {item.word}
                </div>
                <div className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                  {item.phonetic}
                </div>

                <div className="text-sm font-bold text-slate-800 mt-2.5">
                  {item.chinese}
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {item.meaning}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWord(item.word);
                  }}
                  className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>单词发音</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWord(item.exampleSentence);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>读例句</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Card for Selected Word */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-slate-900 font-display capitalize">
                {currentInfo.word}
              </h3>
              <span className="text-sm font-mono text-slate-500 font-semibold">
                {currentInfo.phonetic}
              </span>
            </div>
            <p className="text-base font-bold text-amber-700 mt-1">
              {currentInfo.chinese}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayWord(currentInfo.audioText)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>标准语速</span>
            </button>
            <button
              onClick={() => handlePlayWord(currentInfo.audioText, true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Snail className="w-4 h-4 text-amber-600" />
              <span>慢速辨音</span>
            </button>
          </div>
        </div>

        {/* Example sentence highlight */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              课堂高频句型 (Target Sentence)
            </span>
            <div className="text-xl font-black text-slate-800 font-display mt-2">
              &ldquo;{currentInfo.exampleSentence}&rdquo;
            </div>
            <p className="text-xs text-slate-500 mt-2">
              让学生在找到小丑后，以完整句形式大声跟读，巩固方位介词 <strong>in</strong> 与地点名词的搭配。
            </p>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              趣味知识与记忆技巧 (Fun Memory Tip)
            </span>
            <div className="text-sm font-semibold text-slate-700 mt-2">
              {currentInfo.funFact}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              视觉线索：{currentInfo.visualHint}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table: City vs Town */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 font-display mb-4">
          City vs. Town 差异对比表（帮助孩子理解概念）
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">对比维度</th>
                <th className="py-3 px-4 text-sky-700">🏙️ City (大城市)</th>
                <th className="py-3 px-4 text-emerald-700">🏡 Town (温馨小镇)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">建筑形态</td>
                <td className="py-3 px-4">摩天高楼 (Skyscrapers)、大百货商场</td>
                <td className="py-3 px-4">小木屋 (Cottages)、面包房、红瓦房</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">道路与交通</td>
                <td className="py-3 px-4">宽阔马路、双层巴士、黄色出租车、斑马线</td>
                <td className="py-3 px-4">鹅卵石小道、自行车、青草山丘小路</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">生活氛围</td>
                <td className="py-3 px-4">快节奏、繁华喧闹、人流如织</td>
                <td className="py-3 px-4">宁静悠闲、邻里亲密、鸟语花香</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">发音规律</td>
                <td className="py-3 px-4 font-mono">/ˈsɪti/ （双音节，软音 c 发 /s/）</td>
                <td className="py-3 px-4 font-mono font-bold text-orange-700">/taʊn/ （单音节，与 clown 押韵）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
