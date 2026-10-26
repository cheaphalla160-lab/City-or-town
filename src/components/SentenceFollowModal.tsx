import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Star, CheckCircle, ArrowRight, Snail, Award, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { startListening, isSpeechRecognitionSupported, SpeechRecognitionResult } from '../utils/speechRecognition';
import { SpawnPoint } from '../types/game';

interface SentenceFollowModalProps {
  spawnPoint: SpawnPoint;
  roundNumber: number;
  totalRounds: number;
  onNextRound: (speechBonus: number) => void;
}

export const SentenceFollowModal: React.FC<SentenceFollowModalProps> = ({
  spawnPoint,
  roundNumber,
  totalRounds,
  onNextRound,
}) => {
  const isCity = spawnPoint.location === 'city';
  const targetWord = isCity ? 'city' : 'town';
  const targetSentence = `The clown is in the ${targetWord}!`;
  const chineseSentence = isCity ? '小丑在城市里！' : '小丑在小镇里！';

  const [isListening, setIsListening] = useState(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [transcript, setTranscript] = useState('');
  const [readAloudDone, setReadAloudDone] = useState(false);
  const [readStars, setReadStars] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('点击麦克风，大声跟着读句子吧！');
  const [micSupported, setMicSupported] = useState(true);

  useEffect(() => {
    setMicSupported(isSpeechRecognitionSupported());
    // Automatically read out the sentence on appearance
    const timer = setTimeout(() => {
      audioManager.speak(targetSentence, 0.85);
    }, 350);

    return () => {
      clearTimeout(timer);
      if (stopListeningFn) {
        stopListeningFn();
      }
    };
  }, [targetSentence]);

  const handleListenNormal = () => {
    audioManager.playPop();
    audioManager.speak(targetSentence, 0.85);
  };

  const handleListenSlow = () => {
    audioManager.playPop();
    audioManager.speak(targetSentence, 0.65);
  };

  const handleStartSpeech = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      setIsListening(false);
      return;
    }

    audioManager.playPop();
    setTranscript('');
    setFeedbackMsg('正在倾听... 请大声说: "' + targetSentence + '"');
    setIsListening(true);

    const stop = startListening(
      spawnPoint.location,
      (result: SpeechRecognitionResult) => {
        setTranscript(result.transcript);
        setIsListening(false);

        if (result.isMatch || result.score >= 70) {
          audioManager.playCheer();
          setReadAloudDone(true);
          setReadStars(3);
          setFeedbackMsg('太棒了！发音非常清晰！🎉 Great Job!');
        } else {
          audioManager.playSuccess();
          setReadAloudDone(true);
          setReadStars(2);
          setFeedbackMsg('读得很好！继续加油！👏 Good Try!');
        }
      },
      (error) => {
        setIsListening(false);
        setFeedbackMsg('麦克风未识别到，没关系！点击下方绿色按钮也可以完成打卡！');
      },
      () => {
        setIsListening(false);
      }
    );

    setStopListeningFn(() => stop);
  };

  const handleManualPass = () => {
    audioManager.playSuccess();
    setReadAloudDone(true);
    setReadStars(3);
    setFeedbackMsg('朗读完成！获得朗读之星 ⭐⭐⭐');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8 overflow-hidden text-center">
        {/* Decorative Top Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        {/* Round Counter & Close/Next header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Round {roundNumber} of {totalRounds}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Location:</span>
            <span className={`font-bold ${isCity ? 'text-sky-600' : 'text-emerald-600'}`}>
              {isCity ? '🏙️ City (城市)' : '🏡 Town (小镇)'}
            </span>
          </div>
        </div>

        {/* Mascot & Celebration */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl animate-bounce">🎈</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
            Found the Clown!
          </h2>
          <span className="text-4xl animate-bounce">🎪</span>
        </div>

        <p className="text-sm text-slate-600 mb-5">
          小丑出现在：<strong className="text-slate-800">{spawnPoint.spotName}</strong>（{spawnPoint.spotNameEn}）
        </p>

        {/* Main Big English Sentence with Phonics Highlight */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 md:p-6 mb-6 shadow-inner">
          <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-slate-800 font-display leading-tight flex flex-wrap items-center justify-center gap-2">
            <span>The</span>
            <span className="bg-amber-200/80 text-amber-900 px-3 py-1 rounded-xl shadow-xs border border-amber-300 transform -rotate-1 hover:rotate-0 transition-transform">
              clown
            </span>
            <span>is</span>
            <span>in</span>
            <span>the</span>
            <span
              className={`px-3 py-1 rounded-xl shadow-xs border transform rotate-1 hover:rotate-0 transition-transform ${
                isCity
                  ? 'bg-sky-200/90 text-sky-950 border-sky-300'
                  : 'bg-emerald-200/90 text-emerald-950 border-emerald-300'
              }`}
            >
              {targetWord}
            </span>
            <span>!</span>
          </div>

          <div className="mt-2.5 text-base font-semibold text-slate-600">
            {chineseSentence}
          </div>

          {/* Phonics comparison tag */}
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {targetWord === 'town' ? (
              <span>
                Phonics Tip: <strong className="font-bold underline">clown</strong> 和 <strong className="font-bold underline">town</strong> 押同样的 <strong>-own</strong> 韵 (/aʊn/)！
              </span>
            ) : (
              <span>
                Phonics Tip: <strong className="font-bold">city</strong> 是大都市，包含高楼与车流！
              </span>
            )}
          </div>
        </div>

        {/* Audio Listen Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={handleListenNormal}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>听原声 (Listen)</span>
          </button>
          <button
            onClick={handleListenSlow}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-semibold rounded-xl border border-slate-300 transition-all cursor-pointer"
          >
            <Snail className="w-5 h-5 text-amber-600" />
            <span>慢速听 (Slow)</span>
          </button>
        </div>

        {/* Read Aloud Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-500" />
              <span>跟读挑战 (Read Aloud)</span>
            </div>
            {readStars > 0 && (
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(readStars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 animate-ping-once" />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {micSupported && (
              <button
                onClick={handleStartSpeech}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isListening ? '正在录音... (点击结束)' : '点击大声读句子'}</span>
              </button>
            )}

            <button
              onClick={handleManualPass}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 rounded-xl shadow-xs active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>我读完啦 (已跟读)</span>
            </button>
          </div>

          {/* Feedback message */}
          <p className="mt-3 text-xs font-medium text-slate-600 min-h-[1.25rem]">
            {feedbackMsg}
          </p>

          {transcript && (
            <div className="mt-2 text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-700">
              听到了: &ldquo;{transcript}&rdquo;
            </div>
          )}
        </div>

        {/* Action Button: Next Round */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              audioManager.playPop();
              const bonus = readAloudDone ? 100 : 50;
              onNextRound(bonus);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>{roundNumber >= totalRounds ? '查看成绩与排行榜' : '进入下一关 (Next Round)'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
