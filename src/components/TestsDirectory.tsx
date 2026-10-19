import React from 'react';
import { Award, CheckCircle2, Lock, ArrowRight, Play, AlertCircle, Sparkles } from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';
import { Level, UserProgress } from '../types/learning';

interface TestsDirectoryProps {
  progress: UserProgress;
  onStartExam: (level: Level) => void;
  onOpenPlacementTest: () => void;
}

export const TestsDirectory: React.FC<TestsDirectoryProps> = ({
  progress,
  onStartExam,
  onOpenPlacementTest,
}) => {
  const isLevelUnlocked = (levelIndex: number): boolean => {
    if (levelIndex === 0) return true;
    const prevLevel = CURRICULUM_LEVELS[levelIndex - 1];
    const prevExamPassed = progress.completedTestScores[prevLevel.finalTest.id]?.passed;
    const prevLessonsDone = prevLevel.lessons.every((l) => progress.completedLessonIds.includes(l.id));
    return Boolean(prevExamPassed || prevLessonsDone);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Ingliz Tili Standart Imtihonlari
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Har bir daraja bo'yicha yakuniy imtihonlarni topshirib bilimingizni sinab ko'ring. Kamida 70% to'plab keyingi darajaga yo'llanma oling!
          </p>
        </div>

        <button
          onClick={onOpenPlacementTest}
          className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>Darajani Aniqlash Testi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Test Cards Grid */}
      <div className="space-y-4">
        {CURRICULUM_LEVELS.map((level, idx) => {
          const unlocked = isLevelUnlocked(idx);
          const test = level.finalTest;
          const result = progress.completedTestScores[test.id];

          return (
            <div
              key={test.id}
              className={`p-6 rounded-2xl border transition-all ${
                unlocked
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-slate-50 border-slate-200/60 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                      unlocked
                        ? result?.passed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {unlocked ? (
                      result?.passed ? <CheckCircle2 className="w-6 h-6" /> : <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-blue-600">{level.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{level.cefr}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{test.questions.length} ta savol</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-slate-900">
                      {test.uzbekTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* Status & CTA */}
                <div className="flex items-center gap-4 shrink-0">
                  {result && (
                    <div className="text-right text-xs">
                      <span
                        className={`font-bold block ${
                          result.passed ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {result.passed ? "O'tildi" : "Qayta topshirish kerak"}
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        Natija: {result.score}/{result.total} ({result.percentage}%)
                      </span>
                    </div>
                  )}

                  <button
                    disabled={!unlocked}
                    onClick={() => onStartExam(level)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      !unlocked
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : result?.passed
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    <span>{result ? 'Qayta topshirish' : 'Imtihonni boshlash'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
