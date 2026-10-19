import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LevelsOverview } from './components/LevelsOverview';
import { LessonView } from './components/LessonView';
import { QuizModal } from './components/QuizModal';
import { ProgressDashboard } from './components/ProgressDashboard';
import { VocabularyBook } from './components/VocabularyBook';
import { TestsDirectory } from './components/TestsDirectory';
import { PlacementTestModal } from './components/PlacementTestModal';
import { CertificateModal } from './components/CertificateModal';
import { CURRICULUM_LEVELS } from './data/curriculumData';
import {
  checkAndUnlockBadges,
  loadUserProgress,
  saveUserProgress,
} from './utils/storage';
import {
  Lesson,
  Level,
  MistakeItem,
  Question,
  QuizTest,
  TestResultRecord,
  UserProgress,
} from './types/learning';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentTab, setCurrentTab] = useState<'levels' | 'tests' | 'vocabulary' | 'progress'>('levels');

  // Active sub-views
  const [activeLessonContext, setActiveLessonContext] = useState<{
    lesson: Lesson;
    level: Level;
  } | null>(null);

  const [activeExamLevel, setActiveExamLevel] = useState<Level | null>(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [recentBadgeToast, setRecentBadgeToast] = useState<string | null>(null);

  // Sync progress changes to localStorage and check badges
  const updateProgressAndCheckBadges = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      const { updatedProgress, newlyUnlocked } = checkAndUnlockBadges(next);
      saveUserProgress(updatedProgress);

      if (newlyUnlocked.length > 0) {
        setRecentBadgeToast(`Yangi Yutuq! ${newlyUnlocked[0].icon} ${newlyUnlocked[0].uzbekTitle}`);
        setTimeout(() => setRecentBadgeToast(null), 4500);
      }
      return updatedProgress;
    });
  };

  const handleSelectLesson = (lesson: Lesson, level: Level) => {
    setActiveLessonContext({ lesson, level });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromLesson = () => {
    setActiveLessonContext(null);
  };

  const handleCompleteLesson = (lessonId: string, earnedXp: number) => {
    updateProgressAndCheckBadges((prev) => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const updatedLessons = isAlreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];
      const xpAdd = isAlreadyCompleted ? 5 : earnedXp;

      return {
        ...prev,
        completedLessonIds: updatedLessons,
        totalXp: prev.totalXp + xpAdd,
      };
    });
  };

  const handleNextLesson = () => {
    if (!activeLessonContext) return;
    const { lesson, level } = activeLessonContext;
    const currentLessonIdx = level.lessons.findIndex((l) => l.id === lesson.id);

    if (currentLessonIdx >= 0 && currentLessonIdx + 1 < level.lessons.length) {
      // Next lesson in current level
      setActiveLessonContext({
        lesson: level.lessons[currentLessonIdx + 1],
        level,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished all lessons in this level -> prompt to take final exam
      setActiveLessonContext(null);
      setActiveExamLevel(level);
    }
  };

  const handleStartExam = (level: Level) => {
    setActiveExamLevel(level);
  };

  const handleFinishQuiz = (quizId: string, result: TestResultRecord, earnedXp: number) => {
    updateProgressAndCheckBadges((prev) => ({
      ...prev,
      completedTestScores: {
        ...prev.completedTestScores,
        [quizId]: result,
      },
      totalXp: prev.totalXp + earnedXp,
    }));
  };

  const handleRecordMistake = (
    question: Question,
    userAnswer: string,
    lessonTitle: string,
    levelId: number
  ) => {
    updateProgressAndCheckBadges((prev) => {
      const newMistake: MistakeItem = {
        id: `mistake_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        questionId: question.id,
        levelId,
        lessonTitle,
        promptUz: question.promptUz,
        promptEn: question.promptEn,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanationUz: question.explanationUz,
        date: new Date().toLocaleDateString('uz-UZ'),
      };
      return {
        ...prev,
        mistakes: [newMistake, ...prev.mistakes.slice(0, 49)], // Store up to 50 recent mistakes
      };
    });
  };

  const handleRemoveMistake = (mistakeId: string) => {
    updateProgressAndCheckBadges((prev) => ({
      ...prev,
      mistakes: prev.mistakes.filter((m) => m.id !== mistakeId),
    }));
  };

  const handleClearMistakes = () => {
    updateProgressAndCheckBadges((prev) => ({
      ...prev,
      mistakes: [],
    }));
  };

  const handleToggleBookmarkWord = (wordId: string) => {
    updateProgressAndCheckBadges((prev) => {
      const exists = prev.bookmarkedWordIds.includes(wordId);
      return {
        ...prev,
        bookmarkedWordIds: exists
          ? prev.bookmarkedWordIds.filter((id) => id !== wordId)
          : [...prev.bookmarkedWordIds, wordId],
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm("Barcha darslar, testlar va XP ballaringizni noldan boshlashga ishonchingiz komilmi?")) {
      const cleanProgress: UserProgress = {
        userName: progress.userName || 'Talaba',
        avatarSeed: 'scholar',
        currentLevelId: 0,
        completedLessonIds: [],
        completedTestScores: {},
        totalXp: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        mistakes: [],
        unlockedBadgeIds: [],
        bookmarkedWordIds: [],
      };
      saveUserProgress(cleanProgress);
      setProgress(cleanProgress);
      setActiveLessonContext(null);
      setCurrentTab('levels');
    }
  };

  const handleUpdateUserName = (newName: string) => {
    updateProgressAndCheckBadges((prev) => ({
      ...prev,
      userName: newName,
    }));
  };

  const handleSelectRecommendedLevel = (targetLevelId: number) => {
    const targetLevel = CURRICULUM_LEVELS.find((l) => l.id === targetLevelId) || CURRICULUM_LEVELS[0];
    setCurrentTab('levels');
    setActiveLessonContext(null);
    // Open first lesson of that level
    if (targetLevel.lessons.length > 0) {
      setActiveLessonContext({
        lesson: targetLevel.lessons[0],
        level: targetLevel,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveLessonContext(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPlacementTest={() => setShowPlacementTest(true)}
        onOpenCertificate={() => setShowCertificate(true)}
        progress={progress}
      />

      {/* Floating Badge Notification Toast */}
      {recentBadgeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-bounce">
          <span className="text-xs font-semibold">{recentBadgeToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeLessonContext ? (
          <LessonView
            lesson={activeLessonContext.lesson}
            level={activeLessonContext.level}
            onBack={handleBackFromLesson}
            onCompleteLesson={handleCompleteLesson}
            onRecordMistake={handleRecordMistake}
            onNextLesson={handleNextLesson}
          />
        ) : (
          <>
            {currentTab === 'levels' && (
              <LevelsOverview
                progress={progress}
                onSelectLesson={handleSelectLesson}
                onStartExam={handleStartExam}
                onOpenPlacementTest={() => setShowPlacementTest(true)}
              />
            )}

            {currentTab === 'tests' && (
              <TestsDirectory
                progress={progress}
                onStartExam={handleStartExam}
                onOpenPlacementTest={() => setShowPlacementTest(true)}
              />
            )}

            {currentTab === 'vocabulary' && (
              <VocabularyBook
                bookmarkedIds={progress.bookmarkedWordIds || []}
                onToggleBookmark={handleToggleBookmarkWord}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressDashboard
                progress={progress}
                onClearMistakes={handleClearMistakes}
                onRemoveMistake={handleRemoveMistake}
                onOpenCertificate={() => setShowCertificate(true)}
                onResetProgress={handleResetProgress}
                onUpdateUserName={handleUpdateUserName}
              />
            )}
          </>
        )}
      </main>

      {/* Level Final Exam Modal */}
      {activeExamLevel && (
        <QuizModal
          quiz={activeExamLevel.finalTest}
          levelTitle={activeExamLevel.code}
          onClose={() => setActiveExamLevel(null)}
          onFinishQuiz={handleFinishQuiz}
          onRecordMistake={handleRecordMistake}
        />
      )}

      {/* Placement Diagnostic Test Modal */}
      {showPlacementTest && (
        <PlacementTestModal
          onClose={() => setShowPlacementTest(false)}
          onSelectRecommendedLevel={handleSelectRecommendedLevel}
        />
      )}

      {/* Official Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          progress={progress}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            Ingliz Tili 0+ · Noldan B2 gacha Bosqichma-bosqich Ta'lim Platformasi
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <span>Interaktiv Darslar</span>
            <span aria-hidden="true">·</span>
            <span>Audio Talaffuz</span>
            <span aria-hidden="true">·</span>
            <span>Daraja Imtihonlari</span>
            <span aria-hidden="true">·</span>
            <span>Progress Monitoringi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
