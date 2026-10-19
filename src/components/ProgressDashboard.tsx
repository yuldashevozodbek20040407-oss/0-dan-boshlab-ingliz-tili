import React, { useState } from 'react';
import { Award, Flame, Sparkles, BookOpen, CheckCircle2, TrendingUp, AlertCircle, Trash2, RotateCcw, Calendar, Check, ExternalLink } from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';
import { ALL_BADGES } from '../utils/storage';
import { MistakeItem, UserProgress } from '../types/learning';

interface ProgressDashboardProps {
  progress: UserProgress;
  onClearMistakes: () => void;
  onRemoveMistake: (mistakeId: string) => void;
  onOpenCertificate: () => void;
  onResetProgress: () => void;
  onUpdateUserName: (name: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onClearMistakes,
  onRemoveMistake,
  onOpenCertificate,
  onResetProgress,
  onUpdateUserName,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.userName || 'Talaba');
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');

  const totalLessons = 25;
  const completedLessons = progress.completedLessonIds.length;
  const overallPercentage = Math.round((completedLessons / totalLessons) * 100);

  // User title based on XP
  const getUserRank = (xp: number): string => {
    if (xp >= 500) return 'Advanced English Speaker 🏆';
    if (xp >= 300) return 'Pre-Intermediate Scholar 🌟';
    if (xp >= 150) return 'Elementary Explorer ⚡';
    if (xp >= 50) return 'Beginner Learner 📚';
    return 'Starter Novice 🌱';
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setEditingName(false);
    }
  };

  const filteredMistakes = filterLevel === 'all'
    ? progress.mistakes
    : progress.mistakes.filter((m) => m.levelId === filterLevel);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Profile & Key Metrics Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {progress.userName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-2 py-1 text-base font-bold border border-blue-400 rounded-lg outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Saqlash
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold font-display text-slate-900">
                      {progress.userName}
                    </h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      O'zgartirish
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">
                {getUserRank(progress.totalXp)}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>So'nggi faollik: {progress.lastActiveDate}</span>
                <span aria-hidden="true">·</span>
                <span>ID: #{progress.avatarSeed}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sertifikatni Ko'rish</span>
            </button>
          </div>
        </div>

        {/* 4 Essential Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Umumiy Progress</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {overallPercentage}%
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              {completedLessons} / {totalLessons} dars yakunlandi
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Kunlik Olov (Streak)</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {progress.streakDays} kun
            </div>
            <div className="text-xs text-slate-500 mt-1">
              To'xtovsiz har kuni o'qish
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tajriba Ballari (XP)</span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {progress.totalXp} XP
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Dars va testlardan to'plandi
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Xatolar Qaydnomasi</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {progress.mistakes.length} ta
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Qayta ko'rib chiqish tavsiya etiladi
            </div>
          </div>
        </div>
      </div>

      {/* Level-by-Level Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            Darajalar Bo'yicha O'zlashtirish Tahlili
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Har bir darajadagi darslar va imtihon natijalari balansi.
          </p>
        </div>

        <div className="space-y-4">
          {CURRICULUM_LEVELS.map((level) => {
            const completedCount = level.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const pct = Math.round((completedCount / level.lessons.length) * 100);
            const examRes = progress.completedTestScores[level.finalTest.id];

            return (
              <div
                key={level.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-blue-600">{level.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{level.cefr}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {level.uzbekTitle}
                  </h4>
                  <div className="text-xs text-slate-500 tabular-nums">
                    Darslar: {completedCount} / {level.lessons.length} tugatildi
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress bar */}
                  <div className="w-36 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Darslar:</span>
                      <span className="font-bold tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Exam badge */}
                  <div className="w-36 text-right">
                    {examRes ? (
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            examRes.passed ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {examRes.passed ? '✓ Imtihon topshirildi' : '✗ Qayta topshiring'}
                        </span>
                        <span className="text-xs text-slate-400 tabular-nums">
                          Ball: {examRes.percentage}% ({examRes.date})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 block">
                        Imtihon hali topshirilmadi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Yutuqlar va Nishonlar
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Topshiriqlarni muvaffaqiyatli bajarib yangi yutuqlarga ega bo'ling.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 tabular-nums">
            Ochilgan: {progress.unlockedBadgeIds?.length || 0} / {ALL_BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadgeIds?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {badge.uzbekTitle}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {badge.description}
                </p>
                <div className="mt-2 text-[10px] font-semibold">
                  {isUnlocked ? (
                    <span className="text-emerald-600">✓ Erishildi</span>
                  ) : (
                    <span className="text-slate-400">Qulflangan</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mistakes Notebook (Xatolar Daftari) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>Xatolar Daftari (Mistakes Review)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Darslar va testlarda xato qilingan savollarni qayta takrorlang va mustahkamlang.
            </p>
          </div>

          {progress.mistakes.length > 0 && (
            <button
              onClick={onClearMistakes}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Daftarni tozalash</span>
            </button>
          )}
        </div>

        {progress.mistakes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">
              Xatolar yo'q!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Siz dars va testlardagi barcha savollarni to'g'ri bajardingiz yoki avvalgi xatolarni tozaladingiz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-rose-900 block text-sm">
                      {m.promptUz}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Mavzu: {m.lessonTitle} · Sana: {m.date}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveMistake(m.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Xatoni o'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-rose-100/70 grid sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-lg border border-rose-200 text-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Sizning javobingiz:</span>
                    <span className="font-medium text-rose-700">{m.userAnswer || '(belgilanmadi)'}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">To'g'ri javob:</span>
                    <span className="font-bold text-emerald-700">{m.correctAnswer}</span>
                  </div>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                  <strong className="text-slate-900">Qoida:</strong> {m.explanationUz}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          <strong className="text-slate-800">Ma'lumotlarni qayta o'rnatish:</strong>
          <span className="ml-1">Agar platformani yangidan 0 dan boshlamoqchi bo'lsangiz.</span>
        </div>
        <button
          onClick={onResetProgress}
          className="px-3 py-1.5 text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
        >
          Noldan boshlash
        </button>
      </div>
    </div>
  );
};
