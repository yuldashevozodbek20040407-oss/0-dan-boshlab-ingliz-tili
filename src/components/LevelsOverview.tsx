import React from 'react';
import { CheckCircle2, Lock, Play, Award, Compass, ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';
import { Lesson, Level, UserProgress } from '../types/learning';

interface LevelsOverviewProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson, level: Level) => void;
  onStartExam: (level: Level) => void;
  onOpenPlacementTest: () => void;
}

export const LevelsOverview: React.FC<LevelsOverviewProps> = ({
  progress,
  onSelectLesson,
  onStartExam,
  onOpenPlacementTest,
}) => {
  // Check if a level is unlocked: Level 0 is always open.
  // Other levels open when previous level exam is passed OR all previous lessons done.
  const isLevelUnlocked = (levelIndex: number): boolean => {
    if (levelIndex === 0) return true;
    const prevLevel = CURRICULUM_LEVELS[levelIndex - 1];
    const prevExamPassed = progress.completedTestScores[prevLevel.finalTest.id]?.passed;
    const prevLessonsDone = prevLevel.lessons.every((l) => progress.completedLessonIds.includes(l.id));
    return Boolean(prevExamPassed || prevLessonsDone);
  };

  const getLevelProgress = (level: Level): number => {
    const totalLessons = level.lessons.length;
    const completedCount = level.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
    const examPassed = progress.completedTestScores[level.finalTest.id]?.passed;
    if (totalLessons === 0) return 0;
    const lessonWeight = (completedCount / totalLessons) * 80;
    const examWeight = examPassed ? 20 : 0;
    return Math.round(lessonWeight + examWeight);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="grid lg:grid-cols-12 items-stretch min-h-[360px]">
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-3 tracking-wide uppercase">
                <span>0 Dan Boshlanuvchi Metodika</span>
                <span aria-hidden="true">·</span>
                <span>CEFR A1 dan B2 gacha</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                Ingliz Tilini Noldan <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Bosqichma-Bosqich
                </span>{' '}
                O'rganing
              </h1>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Alifbo va tovushlardan tortib erkin suhbatgacha bo'lgan tizimli o'quv dasturi. Har bir darsda audio talaffuz, interaktiv mashqlar va daraja imtihonlari mavjud.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  const firstIncomplete = CURRICULUM_LEVELS[0].lessons.find(
                    (l) => !progress.completedLessonIds.includes(l.id)
                  ) || CURRICULUM_LEVELS[0].lessons[0];
                  onSelectLesson(firstIncomplete, CURRICULUM_LEVELS[0]);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ta'limni Davom Ettirish</span>
              </button>

              <button
                onClick={onOpenPlacementTest}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Darajangizni Aniqlang (Test)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_english_learning_1792381505895.jpg"
              alt="Ingliz tili bosqichma-bosqich o'rganish xaritasi"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          </div>
        </div>

        {/* 4-Item Indicator Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-slate-950/70 border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
          <div className="py-2 px-4">
            <span className="block text-slate-200 font-semibold text-sm tabular-nums">5 Ta Daraja</span>
            <span>Noldan B2 gacha</span>
          </div>
          <div className="py-2 px-4">
            <span className="block text-slate-200 font-semibold text-sm tabular-nums">25 Ta Dars</span>
            <span>Interaktiv qoidalar</span>
          </div>
          <div className="py-2 px-4">
            <span className="block text-slate-200 font-semibold text-sm tabular-nums">100+ So'zlar</span>
            <span>Ovozli talaffuz bilan</span>
          </div>
          <div className="py-2 px-4">
            <span className="block text-slate-200 font-semibold text-sm tabular-nums">5 Ta Imtihon</span>
            <span>Rasmiy sertifikat</span>
          </div>
        </div>
      </section>

      {/* Curriculum Levels Roadmap */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Bosqichma-bosqich O'quv Yo'li
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Har bir darajadagi barcha darslarni o'zlashtiring va keyingi daraja qulfini ochish uchun yakuniy testni topshiring.
            </p>
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            Tugatilgan darslar: <strong className="text-slate-900">{progress.completedLessonIds.length}</strong> / 25
          </div>
        </div>

        <div className="space-y-6">
          {CURRICULUM_LEVELS.map((level, lvlIndex) => {
            const unlocked = isLevelUnlocked(lvlIndex);
            const levelPercentage = getLevelProgress(level);
            const testResult = progress.completedTestScores[level.finalTest.id];
            const allLessonsDone = level.lessons.every((l) => progress.completedLessonIds.includes(l.id));

            return (
              <div
                key={level.id}
                className={`rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                }`}
              >
                {/* Level Card Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                        unlocked
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {unlocked ? lvlIndex : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-blue-600">{level.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>{level.cefr}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{level.lessons.length} ta dars</span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-slate-900">
                        {level.uzbekTitle}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                        {level.description}
                      </p>
                    </div>
                  </div>

                  {/* Level Right Stats & Progress Bar */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <span>O'zlashtirish:</span>
                      <span className="font-bold text-slate-900 tabular-nums">{levelPercentage}%</span>
                    </div>
                    <div className="w-full sm:w-44 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${levelPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lesson Grid inside this level */}
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {level.lessons.map((lesson) => {
                      const isCompleted = progress.completedLessonIds.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          disabled={!unlocked}
                          onClick={() => onSelectLesson(lesson, level)}
                          className={`group text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            !unlocked
                              ? 'bg-slate-100/50 border-slate-200 cursor-not-allowed opacity-60'
                              : isCompleted
                              ? 'bg-emerald-50/50 border-emerald-200/70 hover:border-emerald-300'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                              <span className="font-semibold text-slate-700">Dars {lesson.order}</span>
                              <div className="flex items-center gap-1 tabular-nums">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{lesson.durationMinutes} daq</span>
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {lesson.uzbekTitle}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {lesson.title}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                            <span className="text-amber-600 font-medium flex items-center gap-1 tabular-nums">
                              <Sparkles className="w-3 h-3" />
                              +{lesson.xpReward} XP
                            </span>

                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Tugatilgan</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-0.5 transition-transform font-medium">
                                <span>Boshlash</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Level Final Exam Card */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{level.finalTest.title}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">O'tish bali: {level.finalTest.passingPercentage}%</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {level.finalTest.uzbekTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {testResult ? (
                        <div className="text-right text-xs mr-1">
                          <span className={testResult.passed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {testResult.passed ? "Muvaffaqiyatli topshirildi" : "Qayta urinib ko'ring"}
                          </span>
                          <span className="block text-slate-400 tabular-nums">
                            Natija: {testResult.score}/{testResult.total} ({testResult.percentage}%)
                          </span>
                        </div>
                      ) : null}

                      <button
                        disabled={!unlocked}
                        onClick={() => onStartExam(level)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                          !unlocked
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : testResult?.passed
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : allLessonsDone
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>
                          {testResult?.passed ? 'Testni Qayta Topshirish' : 'Imtihonni Boshlash'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
