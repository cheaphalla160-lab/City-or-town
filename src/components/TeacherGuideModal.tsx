import React from 'react';
import { BookOpen, Lightbulb, Users, Award, PlayCircle, MessageSquare } from 'lucide-react';

export const TeacherGuideModal: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
        <span className="text-3xl mb-2 inline-block">👩‍🏫</span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
          小学英语备课与课堂互动指南
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1">
          专为小学阶段设计的直观视觉与听觉互动课例：融合词汇习得、自然拼读押韵感知、沉浸式句型跟读及排行榜小组PK机制。
        </p>
      </div>

      {/* Teaching Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>核心词汇目标</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            掌握 <strong>city</strong>、<strong>town</strong> 与 <strong>clown</strong> 的音、形、意。通过左右分屏视觉清晰辨析大都市与小镇风貌。
          </p>
        </div>

        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-orange-800 font-bold text-sm mb-2">
            <Lightbulb className="w-4 h-4 text-orange-600" />
            <span>拼读押韵 (Phonics)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            重点点拨 <strong>town</strong> 和 <strong>clown</strong> 的 <strong>-own</strong> 押韵发音（/aʊn/），引导孩子们发现英文韵律之美。
          </p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm mb-2">
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>核心句型操练</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            熟练输出目标句型：<br />
            <strong>&ldquo;The clown is in the city!&rdquo;</strong><br />
            <strong>&ldquo;The clown is in the town!&rdquo;</strong>
          </p>
        </div>
      </div>

      {/* Recommended 4-Step Classroom Flow */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 font-display">
          课堂教学 4 步互动流程建议
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Step 1: 视觉认知与自然拼读导入 (5 mins)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                打开导航栏的 <strong>Words & Phonics</strong> 页面，先投屏展示 City 与 Town 的对比图片。让学生观察建筑、车辆。播放音频，引导学生闭上眼睛感受 <strong>t-own</strong> 与 <strong>cl-own</strong> 的尾音押韵。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Step 2: 班级寻宝游戏互动 (10-15 mins)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                开启 <strong>Play Game</strong> 页面。在电子白板上邀请学生轮流上台寻找小丑，或将全班分为两组（City Team vs Town Team）。小丑出现后，抢先指出并在屏幕上点击小丑！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Step 3: 全员脱口而出跟读打卡 (10 mins)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                点击找到小丑后，大屏幕弹出放大英语句型。利用页面自带的 <strong>&ldquo;大声跟着读 (Read Aloud)&rdquo;</strong> 麦克风功能，邀请学生全班齐读或个别挑战，系统实时点亮 3 颗金星，给予即时成就感！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-purple-500 text-white font-black text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Step 4: 排行榜表彰与总结拓展 (5 mins)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                游戏结束后，将各小组的总分登记到 <strong>Leaderboard (排行榜)</strong>，评选出当堂课的 &ldquo;Clown Detective Master&rdquo;，全班给予掌声表彰。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classroom English Scripts */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 font-display mb-4">
          教师课堂全英教学实用话术 (Classroom English Scripts)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-amber-800">游戏开启指令：</span>
            <p className="text-slate-800 font-medium">
              &ldquo;Look at the screen! On the left is the big city, and on the right is the cozy town. Where is the clown? Let&apos;s find him together!&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-amber-800">引导读句子：</span>
            <p className="text-slate-800 font-medium">
              &ldquo;Bingo! You got the clown! Now, read after me loudly: The clown is in the city! Once again, ready, go!&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-amber-800">自然拼读提问：</span>
            <p className="text-slate-800 font-medium">
              &ldquo;Listen carefully: t-own, cl-own. Do they sound alike? Yes! They both have the &apos;-own&apos; sound! Repeat: clown, town!&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-amber-800">表彰与排行榜：</span>
            <p className="text-slate-800 font-medium">
              &ldquo;Super job, Group One! You caught all the clowns! Let&apos;s put your name on our Champion Leaderboard! Give them a big round of applause!&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
